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
import Profile from "./pages/Client/Profile";
import About from "./pages/Welcome/About";
import SchoolRegister from "./pages/SchoolRegister";
import SchoolReview from "./pages/Admin/SchoolManagement";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/verification" element={<CertificateVerification />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/about" element={<About />} />

      {/* Main layout for the application */}

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/as-school" element={<SchoolRegister />} />

      <Route path="/admin" element={<Sidebar />}>
        {/* Index route - this will be the default when /admin is accessed */}
        <Route index element={<CertificateUpload />} />
        <Route path="schools" element={<SchoolReview />} />
        <Route path="certificates" element={<CertificateUpload />} />
        <Route path="certificates/all" element={<AllCertificatesList />} />
        <Route
          path="certificates/revoked"
          element={<RevokedCertificatesList />}
        />
        <Route path="certificates/users" element={<UserManagement />} />
      </Route>
    </Routes>
  );
};

export default App;
