// App.js
import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Main from "./components/layouts/Main";
import Welcome from "./pages/Welcome/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Sidebar from "./components/layouts/Sidebar";
import CertificateUpload from "./pages/Admin/CertificateUpload";
import AllCertificatesList from "./pages/Admin/AllCertificatesList";
import RevokedCertificatesList from "./pages/Admin/RevokedCertificates";
import UserManagement from "./pages/Admin/UserManagement";
import CertificateVerification from "./pages/Welcome/Verification";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/admin" element={<Sidebar />}>

        {/* Index route - this will be the default when /admin is accessed */}
        <Route index element={<CertificateUpload />} />
        <Route path="certificates" element={<CertificateUpload />} />
        <Route path="certificates/all" element={<AllCertificatesList />} />
        <Route path="certificates/revoked" element={<RevokedCertificatesList/>} />
        <Route path="certificates/users" element={<UserManagement/>} />
      </Route>
    </Routes>
  );
};

export default App;
