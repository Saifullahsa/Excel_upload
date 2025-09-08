import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadPage from "./Page/UploadPage";
import TablesPage from "./Page/TablesPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/tables" element={<TablesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
