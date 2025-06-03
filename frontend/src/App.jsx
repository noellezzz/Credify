// App.js
import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Main from "./components/layouts/Main";
import Welcome from "./pages/Welcome/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard/Index";
import SideLayout from "./components/layouts/Side";
import CertificateUpload from "./pages/CertificateUpload"; 
import CertificatesList from "./pages/CertificatesList";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />}/>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<SideLayout />}>
        <Route index element={<Dashboard />} />
        {/* Add this new route for OCR */}
        <Route path="certificates" element={<CertificateUpload />} />
        <Route path="certificates/list" element={<CertificatesList />} />
      </Route>
    </Routes>
  );
};

export default App;
