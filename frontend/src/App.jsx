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
import SchoolDashboard from "./pages/School/SchoolDashboard";

// Organization imports
import OrganizationRegister from "./pages/Organization/OrganizationRegister";
import OrganizationLogin from "./pages/Organization/OrganizationLogin";
import OrganizationDashboard from "./pages/Organization/OrganizationDashboard";
import OrganizationVerificationPending from "./pages/Organization/OrganizationVerificationPending";
import OrganizationProtectedRoute from "./components/auth/OrganizationProtectedRoute";
import OrganizationReview from "./pages/Admin/OrganizationManagement";
import PublicEvents from "./pages/PublicEvents";
import EventDetails from "./pages/Events/EventDetails";
import PublicOrganizations from "./pages/PublicOrganizations";
import PublicOrganizationProfile from "./pages/PublicOrganizationProfile";
import OrganizationCertificateUpload from "./pages/Organization/OrganizationCertificateUpload";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/verification" element={<CertificateVerification />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/about" element={<About />} />

      {/* Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/as-school" element={<SchoolRegister />} />
      <Route path="/register/as-organization" element={<OrganizationRegister />} />

      {/* Organization Auth */}
      <Route path="/organization/login" element={<OrganizationLogin />} />
      <Route path="/organization/register" element={<OrganizationRegister />} />
      <Route path="/organization/verification-pending" element={<OrganizationVerificationPending />} />

      {/* School Dashboard */}
      <Route path="/school/*" element={<SchoolDashboard />} />

      {/* Organization Dashboard & Protected Routes */}
      <Route path="/organization/*" element={
        <OrganizationProtectedRoute>
          <OrganizationDashboard />
        </OrganizationProtectedRoute>
      } />
      <Route path="/organization/certificates" element={
        <OrganizationProtectedRoute>
          <OrganizationCertificateUpload />
        </OrganizationProtectedRoute>
      } />

      {/* Public Organization/Events */}
      <Route path="/events" element={<PublicEvents />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/organizations" element={<PublicOrganizations />} />
      <Route path="/organizations/:id" element={<PublicOrganizationProfile />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<Sidebar />}>
        <Route index element={<CertificateUpload />} />
        <Route path="schools" element={<SchoolReview />} />
        <Route path="organizations" element={<OrganizationReview />} />
        <Route path="certificates" element={<CertificateUpload />} />
        <Route path="certificates/all" element={<AllCertificatesList />} />
        <Route path="certificates/revoked" element={<RevokedCertificatesList />} />
        <Route path="certificates/users" element={<UserManagement />} />
      </Route>
    </Routes>
  );
};

export default App;
