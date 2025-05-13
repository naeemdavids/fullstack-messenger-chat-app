import express from "express";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import {
  getMessagesFromUsersInChronologicalOrder,
  getUsersForSideBar,
  sendMessage,
  deleteMessage,
  deleteAnyMessage,
} from "../controllers/message.controller.js";

const router = express();

// Get the list of users for the sidebar.
router.get("/users", protectRoute, getUsersForSideBar);
// Retrieve messages between two users in chronological order.
router.get("/:id", protectRoute, getMessagesFromUsersInChronologicalOrder);
// Send a new message to a specific user.
router.post("/send/:id", protectRoute, sendMessage);
// Route to delete a message.
router.delete("/:id", protectRoute, deleteMessage);
// Delete Any Message for Admin.
router.delete("/any/:id", protectRoute, requireAdmin, deleteAnyMessage);

export default router;
