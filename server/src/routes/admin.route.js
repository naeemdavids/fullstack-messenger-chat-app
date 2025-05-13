import express from "express";
import { deleteUser } from "../controllers/message.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import {
  getUserById,
  updateUserPicByAdmin,
} from "../controllers/auth.controller.js";

const router = express.Router();
// Delete any user by ID (admin only).
router.delete("/user/:id", protectRoute, requireAdmin, deleteUser);

// Fetch user profile.
router.get("/user/:id", protectRoute, requireAdmin, getUserById);

// Update user profile pic.
router.put("/user/:id/pic", protectRoute, requireAdmin, updateUserPicByAdmin);

export default router;
