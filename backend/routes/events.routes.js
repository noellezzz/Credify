import express from "express";
import {
    getOrganizationEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    publishEvent,
    getPublicEvents,
    getPublicEvent
} from "../controllers/events.controller.js";

const router = express.Router();

// Organization-specific event routes (protected in real app)
router.get("/organization/events", getOrganizationEvents);
router.post("/organization/events", createEvent);
router.put("/organization/events/:id", updateEvent);
router.delete("/organization/events/:id", deleteEvent);
router.post("/organization/events/:id/publish", publishEvent);

// Public event routes (for users) - only from verified organizations
router.get("/", getPublicEvents);
router.get("/:id", getPublicEvent);

export default router;