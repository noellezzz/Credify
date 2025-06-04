import express from "express";
import {
  uploadBase64,
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

// Get certificates
router.get("/all", getAllCertificates); // Get all certificates
router.get("/revoked", getRevokedCertificates); // Get revoked certificates
router.get("/stats", getCertificateStats); // Get certificate statistics
router.get("/user/:userId", getUserCertificates); // Get user's certificates

// Certificate management
router.post("/revoke/:certificateId", revokeCertificate);
router.post("/unrevoke/:certificateId", unrevokeCertificate);

export default router;