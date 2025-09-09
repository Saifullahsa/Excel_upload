import React, { useState } from "react";
import { Upload } from "lucide-react";
import { RiFolderUploadFill } from "react-icons/ri";
import Img from '../Page/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjU0NmJhdGNoMy1teW50LTM0LWJhZGdld2F0ZXJjb2xvcl8xLmpwZw.webp'
import { useNavigate } from "react-router-dom";

  const Rifo  = RiFolderUploadFill as React.ComponentType


export default function UploadPage() {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!excelFile) {
      setMessage("Please select an Excel file first");
      return;
    }

    const formData = new FormData();
    formData.append("excel", excelFile);

    try {
      setLoading(true);
      const res = await fetch("https://excel-node-js.onrender.com/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.error);
      }
    } catch {
      setMessage("Upload failed, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
    style={{
        backgroundImage: `url(${Img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        width: "100%",
        minHeight: "100vh",
      }}
      className="flex flex-col items-center p-8"
    >
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800 flex items-center gap-2 text-green-400">
        <Upload className="w-8 h-8 text-green-400 " />
        Excel Upload
      </h1>

       <form
        onSubmit={handleUpload}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg border border-gray-200"
      >
       
        <label className="w-full mb-6 cursor-pointer">
  <input
    type="file"
    accept=".xlsx,.xls"
    onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
    className="hidden" 
  />
  <div className="flex flex-col items-center justify-center outline-dashed outline-2 outline-blue-300 rounded-2xl p-4 transition hover:border-blue-500 hover:bg-blue-50 gap-1">
     <p className="w-15 h-15 text-blue-600 text-7xl mr-5"> <Rifo/> </p>
    <p className="text-blue-700 font-medium text-lg">
      Click or drag files here
    </p>
    {excelFile && (
      <p className="mt-2 text-sm text-gray-600">{excelFile.name}</p>
    )}
  </div>
</label>
   
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 mt-10"
        > 
          {loading ? "Uploading..." : "Upload & Save"}
        </button>

         <center> <button
        className="mt-6 bg-blue-500 text-white border-2 px-2 py-1 hover:bg-blue-600 rounded-lg"
        onClick={() => navigate("/tables")}
      >
        Go to Tables
      </button> </center>
       <center>{message && <p className="mt-4 text-sm text-green-700">{message}</p>}</center>
      </form>
    </div>
  );
}
