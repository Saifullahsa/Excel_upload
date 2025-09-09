import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "lucide-react";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaLongArrowAltLeft } from "react-icons/fa";
import Imgs from '../Page/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjU0NmJhdGNoMy1teW50LTM0LWJhZGdld2F0ZXJjb2xvcl8xLmpwZw.webp'

import Loading from './Loading';

export default function TablesPage() {
  const [tables, setTables] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [tableRows, setTableRows] = useState<any[]>([]);
  const [editRow, setEditRow] = useState<any | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const Delete = MdDelete as React.ComponentType;
  const Edit = MdEdit as React.ComponentType;
  const Arrow = FaLongArrowAltLeft as React.ComponentType;

  const navigate = useNavigate();

  const fetchTables = async () => {
    try {
      const res = await fetch("https://excel-node-js.onrender.com/tables");
      const data = await res.json();
      setTables(data);
    } catch {
      console.error("Failed to fetch tables");
    }
  };

  const fetchRows = async (tableName: string) => {
    setSelectedTable(tableName);
    setCurrentPage(1); 
    try {
      const res = await fetch(`https://excel-node-js.onrender.com/tables/${tableName}`);
      const data = await res.json();
      setTableRows(data.data || data);
    } catch {
      console.error("Failed to fetch table rows");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleDeleteTable = async (tableName: string) => {
    if (!window.confirm(`Are you sure you want to delete the table "${tableName}"`)) return;

    try {
      const res = await fetch(`https://excel-node-js.onrender.com/tables/${tableName}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setTables((prev) => prev.filter((t) => t !== tableName));
      } else {
        alert(`Error: ${data.message || data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to drop table. Please try again.");
    }
    fetchTables();
  };

  const handleEdit = (row: any) => {
    setEditRow(row);
    setEditData(row);
  };

  const handleSaveEdit = async () => {
    if (!editRow) return;

    try {
      const primaryKey = Object.keys(editRow)[0];
      const id = editRow[primaryKey];

      const res = await fetch(`https://excel-node-js.onrender.com/tables/${selectedTable}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setEditRow(null);
        fetchRows(selectedTable);
      } else {
        alert(`Error: ${data.message || data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update row.");
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tableRows.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(tableRows.length / rowsPerPage);

  return (
    <div 
       style={{
        backgroundImage: `url(${Imgs})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        width: "100%",
        minHeight: "100vh",
      }}
      className="p-8 min-h-screen bg-gray-50">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-800 mt-5">
          <Table className="w-8 h-8 text-blue-600" />
          Available Tables
        </h1>

        <button
          onClick={handleBack}
          className="border-2 bg-gray-700 hover:bg-gray-900 text-white my-5 px-3 mr-20 flex items-center gap-2 rounded"
        >
          <Arrow />
          Back
        </button>
      </div>

      {tables.length === 0 ? (
        <center>
          <div className="text-blue-700 text-xl font-bold flex items-center gap-4 justify-center">
            <Loading />
          </div>
        </center>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tables.map((t) => (
            <button
              key={t.table_name}
              onClick={() => fetchRows(t.table_name)}
              className={`px-4 py-2 rounded-lg shadow-md transition font-medium ${
                selectedTable === t.table_name
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-300 hover:bg-blue-50"
              }`}
            >
              {t.table_name}
            </button>
          ))}
        </div>
      )}

      {selectedTable && tableRows.length > 0 && (
        <div>
          <div className="mt-10 bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-700">
                Rows from <span className="text-blue-600">{selectedTable}</span>
              </h2>
              <div className="flex items-center gap-5">
                <span className="text-sm text-gray-500">
                  Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, tableRows.length)} of {tableRows.length} rows
                </span>
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch(`https://excel-node-js.onrender.com/export/${selectedTable}`);
                      if (!res.ok) throw new Error("Export failed");
                      const blob = await res.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${selectedTable}.xlsx`;
                      a.click();
                      window.URL.revokeObjectURL(url);
                    } catch (err) {
                      console.error(err);
                      alert("Failed to export table");
                    }
                  }}
                  className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Export
                </button>
                <button
                  onClick={() => handleDeleteTable(selectedTable)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <Delete />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 font-semibold">
                <tr>
                    {Object.keys(tableRows[0]).map((col) => {
                    if(col !='table_id'){
                   return <th key={col} className="px-4 py-2 border-b">
                      {col}
                    </th>
                  }
                 })}
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition border-b last:border-none">
                    {Object.entries(row).map(([key, val], i) => {
      if (key !== "table_id") {
        return (
          <td key={i} className="px-4 py-2">
            {val === null ? "—" : String(val)}
          </td>
        );
      }
      return null; 
    })}
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEdit(row)}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        <Edit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>

          {editRow && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl w-1/2 max-h-[80vh] shadow-xl overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">Edit Row</h3>
                {Object.keys(editRow).map((col) => (
                  <div key={col} className="mb-3">
                    <label className="block text-sm font-medium text-gray-700">{col}</label>
                    <input
                      type="text"
                      value={editData[col] ?? ""}
                      onChange={(e) =>
                        setEditData({ ...editData, [col]: e.target.value })
                      }
                      className="mt-1 p-2 border rounded w-full"
                      disabled={col === Object.keys(editRow)[0]}
                    />
                  </div>
                ))}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditRow(null)}
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
