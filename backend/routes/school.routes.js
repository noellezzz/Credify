import { getSchools, updateSchool, getSchoolProfile, updateSchoolProfile } from "../controllers/schools.controller.js";
import { 
  getSchoolEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  publishEvent 
} from "../controllers/events.controller.js";
import { 
  getVerificationRequests, 
  getVerificationRequest, 
  approveVerificationRequest, 
  rejectVerificationRequest,
  getVerificationStats
} from "../controllers/verification-requests.controller.js";
import express from "express";

const router = express.Router();

// School profile routes
router.get("/", getSchools);
router.get("/profile", getSchoolProfile);
router.put("/profile", updateSchoolProfile);
router.put("/:id", updateSchool);

// School events routes
router.get("/events", getSchoolEvents);
router.post("/events", createEvent);
router.put("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);
router.post("/events/:id/publish", publishEvent);

// School verification requests routes
router.get("/verification-requests", getVerificationRequests);
router.get("/verification-requests/stats", getVerificationStats);
router.get("/verification-requests/:id", getVerificationRequest);
router.put("/verification-requests/:id/approve", approveVerificationRequest);
router.put("/verification-requests/:id/reject", rejectVerificationRequest);

export default router;
