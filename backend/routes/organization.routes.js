import express from "express";
import { authenticateOrganization } from "../middleware/orgAuth.js";
import {
    getOrganizations,
    getOrganizationProfile,
    getPublicOrganization,
    updateOrganizationProfile,
    updateOrganization,
    submitVerificationRequest,
    getVerificationStatus,
    getOrganizationEvents
} from "../controllers/organizations.controller.js";
import {
    getOrganizationEvents as getOrgEvents,
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

const router = express.Router();

// Organization profile routes (protected) - Must come before /:id routes
router.get("/profile/me", authenticateOrganization, getOrganizationProfile);
router.put("/profile/me", authenticateOrganization, updateOrganizationProfile);

// Organization verification routes (protected) - Must come before /:id routes
router.post("/verification/submit", authenticateOrganization, submitVerificationRequest);
router.get("/verification/status", authenticateOrganization, getVerificationStatus);

// Organization events management routes (protected) - Must come before /:id routes
router.get("/events/manage", authenticateOrganization, getOrgEvents);
router.post("/events", authenticateOrganization, createEvent);
router.put("/events/:id", authenticateOrganization, updateEvent);
router.delete("/events/:id", authenticateOrganization, deleteEvent);
router.post("/events/:id/publish", authenticateOrganization, publishEvent);

// Organization verification requests routes (protected) - Must come before /:id routes
router.get("/verification-requests", authenticateOrganization, getVerificationRequests);
router.get("/verification-requests/stats", authenticateOrganization, getVerificationStats);
router.get("/verification-requests/:id", authenticateOrganization, getVerificationRequest);
router.put("/verification-requests/:id/approve", authenticateOrganization, approveVerificationRequest);
router.put("/verification-requests/:id/reject", authenticateOrganization, rejectVerificationRequest);

// Public organization routes - Must come after specific routes to avoid conflicts
router.get("/", getOrganizations); // Get all verified organizations
router.get("/:id", getPublicOrganization); // Get specific organization details
router.get("/:id/events", getOrganizationEvents); // Get organization's public events

// Organization update routes (protected) - Must come after public /:id route
router.put("/:id", authenticateOrganization, updateOrganization);

export default router;
