import express from "express";
import {
  verifyCertificate,
  getVerificationStats,
} from "../controllers/verification.controller.js";

const router = express.Router();

// Verify certificate by file upload
router.post("/verify", verifyCertificate);

// Get verification statistics
router.get("/stats", getVerificationStats);

export default router;