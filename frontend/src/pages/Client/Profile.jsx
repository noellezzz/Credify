import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, selectUserRole } from "../../features/user/userSelector";
import { clearUser } from "../../features/user/userSlice";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/layouts/Header";
import styles from "../../styles/Profile.jsx";
import Loader from "../../components/layouts/Loader";

const HEADER_HEIGHT = 88;

const Profile = () => {
  const user = useSelector(selectUser);
  const userRole = useSelector(selectUserRole);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedCert, setSelectedCert] = useState(null);
  const [tab, setTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader fullPage size="xl" />;
  } 

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
  };

  const certificates = [
    {
      id: "CERT-001",
      title: "COVID-19 Vaccination",
      issued: "2023-04-12",
      status: "Valid",
      image: "/certificates/vaccine-cert.png",
    },
    {
      id: "CERT-002",
      title: "Medical License",
      issued: "2022-09-01",
      status: "Valid",
      image: "/certificates/medical-license.png",
    },
  ];

  return (
    <div style={styles.page}>
      <Header />
      <div style={{ ...styles.container, paddingTop: HEADER_HEIGHT + 32 }}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <div style={styles.profileSection}>
            <div style={styles.avatar}>
              {user?.firstname?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div style={styles.userInfo}>
              <h3 style={styles.userName}>{user?.firstname || "User"} {user?.lastname}</h3>
              <span style={styles.userRole}>{userRole}</span>
            </div>
          </div>

          <nav style={styles.navigation}>
            <button
              style={styles.navButton(tab === "profile")}
              onClick={() => setTab("profile")}
            >
              <i className="fas fa-user" style={styles.icon}></i>
              Profile Information
            </button>
            <button
              style={styles.navButton(tab === "certificates")}
              onClick={() => setTab("certificates")}
            >
              <i className="fas fa-certificate" style={styles.icon}></i>
              My Certificates
            </button>
          </nav>

          <button onClick={handleLogout} style={styles.logoutButton}>
            <i className="fas fa-sign-out-alt" style={styles.icon}></i>
            Logout
          </button>
        </aside>

        {/* Main Content */}
        <main style={styles.main}>
          <div style={styles.pageHeader}>
            <h1 style={styles.pageTitle}>
              {tab === "profile" ? "Profile Information" : "My Certificates"}
            </h1>
            <p style={styles.breadcrumb}>
              Dashboard / {tab === "profile" ? "Profile" : "Certificates"}
            </p>
          </div>

          {tab === "profile" ? (
            <div style={styles.contentCard}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>Personal Details</h2>
                <button style={styles.editButton}>
                  <i className="fas fa-pen"></i>
                  Edit Profile
                </button>
              </div>

              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <label style={styles.infoLabel}>First Name</label>
                  <p style={styles.infoValue}>{user?.firstname || "Not provided"}</p>
                </div>
                <div style={styles.infoItem}>
                  <label style={styles.infoLabel}>Last Name</label>
                  <p style={styles.infoValue}>{user?.lastname || "Not provided"}</p>
                </div>
                <div style={styles.infoItem}>
                  <label style={styles.infoLabel}>Email</label>
                  <p style={styles.infoValue}>{user?.email || "Not provided"}</p>
                </div>
                <div style={styles.infoItem}>
                  <label style={styles.infoLabel}>Role</label>
                  <p style={styles.infoValue}>{userRole || "User"}</p>
                </div>
              </div>
            </div>
          ) : (
            <div style={styles.certificatesGrid}>
              {certificates.map((cert) => (
                <div key={cert.id} style={styles.certCard}>
                  <div style={styles.certHeader}>
                    <span style={styles.certBadge(cert.status)}>{cert.status}</span>
                    <h3 style={styles.certTitle}>{cert.title}</h3>
                  </div>

                  <div style={styles.certDetails}>
                    <div style={styles.certInfo}>
                      <span style={styles.certLabel}>Issue Date</span>
                      <span style={styles.certValue}>
                        {new Date(cert.issued).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={styles.certInfo}>
                      <span style={styles.certLabel}>Certificate ID</span>
                      <span style={styles.certValue}>{cert.id}</span>
                    </div>
                  </div>

                  <button
                    style={styles.viewCertButton}
                    onClick={() => setSelectedCert(cert)}
                  >
                    <i className="fas fa-eye" style={styles.buttonIcon}></i>
                    View Certificate
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Certificate Modal */}
      {selectedCert && (
        <div style={styles.modalOverlay} onClick={() => setSelectedCert(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{selectedCert.title}</h3>
              <button
                style={styles.modalClose}
                onClick={() => setSelectedCert(null)}
              >
                ×
              </button>
            </div>
            
            <div style={styles.modalBody}>
              <img
                src={selectedCert.image}
                alt={selectedCert.title}
                style={styles.certImage}
              />
            </div>

            <div style={styles.modalFooter}>
              <a
                href={selectedCert.image}
                download
                style={styles.downloadButton}
              >
                <i className="fas fa-download" style={styles.buttonIcon}></i>
                Download Certificate
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;