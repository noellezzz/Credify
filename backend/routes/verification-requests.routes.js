import express from "express";
import {
    getVerificationRequests,
    getVerificationRequest,
    approveVerificationRequest,
    rejectVerificationRequest,
    submitVerificationRequest,
    getUserVerificationStatus,
    getVerificationStats
} from "../controllers/verification-requests.controller.js";

const router = express.Router();

// School-specific verification routes (protected in real app) - legacy
router.get("/school", getVerificationRequests);
router.get("/school/stats", getVerificationStats);
router.get("/school/:id", getVerificationRequest);
router.put("/school/:id/approve", approveVerificationRequest);
router.put("/school/:id/reject", rejectVerificationRequest);

// Organization-specific verification routes (protected in real app)
router.get("/organization", getVerificationRequests);
router.get("/organization/stats", getVerificationStats);
router.get("/organization/:id", getVerificationRequest);
router.put("/organization/:id/approve", approveVerificationRequest);
router.put("/organization/:id/reject", rejectVerificationRequest);

// User submission routes
router.post("/events/:eventId/apply", submitVerificationRequest);
router.get("/events/:eventId/status", getUserVerificationStatus);

// Public route for users to check their request status
router.get("/:id", getVerificationRequest);

export default router;
