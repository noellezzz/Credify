import express from "express";
import {
  getUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getUserStats,
} from "../controllers/user.controller.js";

const router = express.Router();

// Route to get all users
router.get("/", getUsers);

// Route to get user statistics
router.get("/stats", getUserStats);

// Route to update user role
router.patch("/:userId/role", updateUserRole);

// Route to update user status
router.patch("/:userId/status", updateUserStatus);

// Route to delete user
router.delete("/:userId", deleteUser);

export default router;
