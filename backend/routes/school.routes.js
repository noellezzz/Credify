import { getSchools, updateSchool } from "../controllers/schools.controller.js";
import express from "express";

const router = express.Router();

router.get("/", getSchools);
router.put("/:id", updateSchool);

export default router;
