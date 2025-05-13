import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

//Controllers for the app messages.

export const getUsersForSideBar = async (req, res) => {
  try {
    // Verify that the request is authenticated.
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const loggedInUserId = req.user._id;
    // Retrieve all users except the currently logged-in user.
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSideBar controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessagesFromUsersInChronologicalOrder = async (req, res) => {
  try {
    // Extract the other user's ID from the URL parameters.
    const { id: userToChatId } = req.params;
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const myId = req.user._id; // Logged-in user's ID.

    // Retrieve the conversation between the two users sorted by creation time.
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error(
      "Error in getMessagesFromUsersInChronologicalOrder controller:",
      error.message
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body; // Get the text and optional image.
    const { id: receiverId } = req.params; // Target user from the URL.
    const senderId = req.user._id; // Authenticated sender.

    let imageUrl;
    if (image) {
      // If an image is included, upload it to Cloudinary.
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    // Create and save the new message document.
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    // Use socket.io to emit the new message directly to the receiver.
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    // Retrieve the message ID from the URL parameters.
    const { id } = req.params;
    // Find the message document by its ID.
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    // Allow deletion only if the current user is the sender of the message.
    if (message.senderId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this message" });
    }
    // Delete the message from the database.
    await message.deleteOne(); // Alternatively, message.remove() can be used.
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    // Log the full error for debugging purposes.
    console.error("Error in deleteMessage controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Allows admin to delete any message by ID, bypassing sender check.
export const deleteAnyMessage = async (req, res) => {
  try {
    const { id } = req.params; // Message ID from URL.
    const message = await Message.findById(id); // Find the message.
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    await message.deleteOne(); // Remove the message.
    res.status(200).json({ message: "Message deleted by admin" });
  } catch (error) {
    console.error("Error in deleteAnyMessage controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Allows admin to delete any user by ID, excluding themselves.
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // User ID from URL.
    // Prevent admin from deleting their own account accidentally.
    if (req.user._id.toString() === id) {
      return res
        .status(400)
        .json({ message: "Cannot delete own admin account" });
    }
    const user = await User.findById(id); // Find the user.
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await User.deleteOne({ _id: id }); // Delete the user.
    res.status(200).json({ message: "User deleted by admin" });
  } catch (error) {
    console.error("Error in deleteUser controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
