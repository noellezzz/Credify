import express from "express";
import { 
  uploadBase64, 
  getOcrContent, 
  getOcrContentByHash 
} from "../controllers/ocr.controller.js";

const router = express.Router();

// Upload file (image or PDF) and automatically generate hashes
router.post("/upload-base64", uploadBase64);

// Get OCR content for existing certificates
router.get("/content/:certificateId", getOcrContent);
router.get("/content/hash/:certificateHash", getOcrContentByHash);

export default router;