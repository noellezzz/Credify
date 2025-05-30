import express from "express";
import { uploadBase64 } from "../controllers/ocr.controller.js";

const router = express.Router();

router.post("/upload-base64", uploadBase64);

export default router;
