import express from "express";
import { adminOnly, protect } from "../middlewares/authMiddlewares.js";
import { getUsers, getUserById } from "../controllers/userControllers.js"; // Assuming these handlers exist

const router = express.Router();

// User Management Routes
router.get("/", protect, adminOnly, getUsers);           // Get all users (Admin only)
router.get("/:id", protect, getUserById);                // Get user by ID


export default router;
