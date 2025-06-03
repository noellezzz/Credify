import express from "express";
import {
  uploadBase64,
  getOcrContent,
  getOcrContentByHash,
  generateHashes,
  verifyFileHash,
  verifyContentHash,
  getUserCertificates,
  getAllCertificates,
  getCertificateStats,
  revokeCertificate,
  unrevokeCertificate,
  getRevokedCertificates,
} from "../controllers/certificates.controller.js";

const router = express.Router();

// Upload file (image or PDF) and automatically generate hashes
router.post("/upload-base64", uploadBase64);

// Get OCR content for existing certificates
router.get("/content/:certificateId", getOcrContent);
router.get("/content/hash/:certificateHash", getOcrContentByHash);

// Generate both file and content hashes
router.post("/generate", generateHashes);

// Verify file integrity
router.post("/verify-file", verifyFileHash);

// Verify content integrity
router.post("/verify-content", verifyContentHash);

// Get certificates
router.get("/all", getAllCertificates); // Get all certificates
router.get("/revoked", getRevokedCertificates); // Get revoked certificates
router.get("/stats", getCertificateStats); // Get certificate statistics
router.get("/user/:userId", getUserCertificates); // Get user's certificates

// Certificate management
router.post("/revoke/:certificateId", revokeCertificate);
router.post("/unrevoke/:certificateId", unrevokeCertificate);

export default router;
