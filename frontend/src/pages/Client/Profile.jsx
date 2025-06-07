import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser, selectUserRole } from "../../features/user/userSelector";
import { Link } from "react-router-dom";
import Header from "../../components/layouts/Header";

const HEADER_HEIGHT = 88;

const Profile = () => {
  const user = useSelector(selectUser);
  const userRole = useSelector(selectUserRole);
  const [selectedCert, setSelectedCert] = useState(null);
  const [tab, setTab] = useState("profile");

  const handleLogout = () => {
    dispatch(clearUser());
    setIsMobileMenuOpen(false);
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
        <aside style={styles.sidebar}>
          <div style={styles.avatar}>
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div style={styles.name}>{user?.firstname || "User"} {user?.lastname}</div>
          <div style={styles.sidebarButtons}>
            <button
              style={styles.sidebarTab(tab === "profile")}
              onClick={() => setTab("profile")}
            >
              Profile
            </button>
            <button
              style={styles.sidebarTab(tab === "certificates")}
              onClick={() => setTab("certificates")}
            >
              Certificates
            </button>
            <Link style={styles.backBtn}>
              Logout
            </Link>
          </div>
        </aside>
        <main style={styles.main}>
          <div style={styles.headerTitle}>
            <h2 style={styles.tabsTitle}>
              {tab === "profile" ? "Profile" : "Certificates"}
            </h2>
          </div>
          <div style={styles.card}>
            {tab === "profile" && (
              <>
                <div style={{ width: "100%", marginTop: 16 }}>
                  <div style={styles.infoRow}>
                    <span style={styles.label}>Email:</span>
                    <span style={styles.value}>{user?.email || "Not provided"}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.label}>First Name:</span>
                    <span style={styles.value}>{user?.firstname || "Not provided"}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.label}>Last Name:</span>
                    <span style={styles.value}>{user?.lastname || "Not provided"}</span>
                  </div>
                </div>
              </>
            )}
            {tab === "certificates" && (
              <div style={styles.tabPanel}>
                <h3 style={{ color: "var(--secondary-color)", marginBottom: 16 }}>
                  My Certificates
                </h3>
                {certificates.length === 0 ? (
                  <p style={{ color: "white" }}>No certificates found.</p>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0, width: "100%" }}>
                    {certificates.map((cert) => (
                    <li
                    key={cert.id}
                    style={{
                        background: "rgba(255,255,255,0.06)",
                        borderRadius: 12,
                        padding: "16px 20px",
                        marginBottom: 12,
                        border: "1px solid rgba(255,255,255,0.08)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                    }}
                    >
                    <span style={{ fontWeight: 600, color: "var(--secondary-color)" }}>
                        {cert.title}
                    </span>
                    <span style={{ fontSize: 14, color: "var(--secondary-color)" }}>
                        Issued: {cert.issued}
                    </span>
                    <span
                        style={{
                        fontSize: 14,
                        color: cert.status === "Valid" ? "var(--secondary-color)" : "#f87171",
                        fontWeight: 500,
                        }}
                    >
                        Status: {cert.status}
                    </span>
                    <span style={{ fontSize: 13, color: "var(--secondary-color)" }}>
                        ID: {cert.id}
                    </span>

                   <button
                        style={{
                            marginTop: 10,
                            backgroundColor: "var(--tertiary-color)",
                            color: "var(--secondary-color)",
                            padding: "8px 12px",
                            fontSize: 14,
                            fontWeight: 600,
                            borderRadius: 8,
                            border: "none",
                            cursor: "pointer",
                            alignSelf: "flex-start",
                        }}
                        onClick={() => setSelectedCert(cert)}
                        >
                        View Certificate
                    </button>

                    </li>

                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
      {selectedCert && (
        <div style={styles.modalBackdrop} onClick={() => setSelectedCert(null)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: "var(--secondary-color)" }}>{selectedCert.title}</h3>
            <img
                src={selectedCert.image}
                alt={selectedCert.title}
                style={{ width: "100%", borderRadius: 8, marginTop: 12 }}
            />
            <a
                href={selectedCert.image}
                download
                style={styles.downloadBtn}
            >
                Download
            </a>
            <button onClick={() => setSelectedCert(null)} style={styles.closeBtn}>
                Close
            </button>
            </div>
        </div>
        )}
    </div>

    
  );
};

export default Profile;

const styles = {
  page: {
    minHeight: "100vh",
    background: "var(--primary-color)",
  },
  container: {
    width: "90%",
    maxWidth: 1100,
    margin: "0 auto",
    padding: "32px 16px",
    display: "flex",
    gap: 40,
    alignItems: "flex-start",
    boxSizing: "border-box",
  },
  sidebar: {
    width: 260,
    minWidth: 200,
    background: "rgba(255,255,255,0.07)",
    borderRadius: 20,
    boxShadow: "0 4px 24px 0 rgba(31,38,135,0.10)",
    padding: "32px 20px 24px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 18,
    position: "sticky",
    top: 32 + 88,
    height: "500px",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: "var(--tertiary-color)",
    color: "var(--secondary-color)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 40,
    fontWeight: 700,
    boxShadow: "0 2px 12px 0 rgba(0,0,0,0.10)",
    marginBottom: 8,
    userSelect: "none",
  },
  name: {
    fontSize: 22,
    fontWeight: 600,
    color: "var(--secondary-color)",
    margin: 0,
    textAlign: "center",
    marginBottom: 2,
  },
  sidebarButtons: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: "100%",
    marginTop: 10,
  },
  sidebarTab: (active) => ({
    padding: "10px 0",
    width: "100%",
    background: active ? "var(--tertiary-color)" : "transparent",
    color: active ? "var(--secondary-color)" : "var(--secondary-color)",
    border: "none",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer",
    marginBottom: 2,
    transition: "background 0.2s, color 0.2s",
  }),
  backBtn: {
    marginTop: 10,
    background: "var(--tertiary-color)",
    color: "var(--secondary-color)",
    padding: "10px 0",
    borderRadius: 8,
    fontWeight: 500,
    fontSize: 16,
    border: "none",
    boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
    cursor: "pointer",
    transition: "background 0.2s, color 0.2s",
    textDecoration: "none",
    display: "block",
    width: "100%",
    textAlign: "center",
    marginTop: '50%'
  },
  main: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  headerTitle: {
    marginBottom: 8,
    marginTop: 8,
  },
  tabsTitle: {
    color: "var(--secondary-color)",
    fontSize: 28,
    fontWeight: 700,
    margin: 0,
    letterSpacing: 1,
  },
  card: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 24,
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
    padding: 32,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 24,
    marginBottom: 32,
    width: "100%",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    color: "rgba(255,255,255,0.85)",
    fontSize: 16,
    margin: "8px 0",
  },
  label: {
    fontWeight: 600,
    color: 'var(--secondary-color)',
  },
  value: {
    fontWeight: 400,
    color: 'var(--secondary-color)',
  },
  tabPanel: {
    marginTop: 8,
    color: "white",
    minHeight: 120,
    width: "100%",
  },
  modalBackdrop: {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
},
modal: {
  background: "var(--primary-color)",
  padding: 24,
  borderRadius: 16,
  width: "90%",
  maxWidth: 500,
  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
  position: "relative",
  textAlign: "center",
},
downloadBtn: {
  marginTop: 16,
  display: "inline-block",
  backgroundColor: "var(--tertiary-color)",
  color: "var(--secondary-color)",
  padding: "8px 16px",
  borderRadius: 8,
  fontWeight: 600,
  textDecoration: "none",
},
closeBtn: {
  marginTop: 12,
  background: "none",
  border: "none",
  color: "var(--secondary-color)",
  fontWeight: 600,
  fontSize: 16,
  cursor: "pointer",
},

};
