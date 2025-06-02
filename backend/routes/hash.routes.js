import express from "express";
import { 
  generateHashes, 
  verifyFileHash, 
  verifyContentHash 
} from "../controllers/hash.controller.js";

const router = express.Router();

// Generate both file and content hashes
router.post("/generate", generateHashes);

// Verify file integrity
router.post("/verify-file", verifyFileHash);

// Verify content integrity
router.post("/verify-content", verifyContentHash);

export default router;