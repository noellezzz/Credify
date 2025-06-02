import express from "express";
import {
  uploadBase64,
  getOcrContent,
  getOcrContentByHash,
  generateHashes,
  verifyFileHash,
  verifyContentHash,
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

export default router;
