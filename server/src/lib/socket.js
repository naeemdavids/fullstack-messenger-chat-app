import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // Allow requests from the client application.
  },
});

// Map to store online users where key is userId and value is socketId.
const userSocketMap = {};

// Retrieve the socket ID for the given userId.
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Handle socket connection events.
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id; // Map the user with its socket ID.

  // Broadcast the updated list of online users to all connected clients.
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId]; // Remove the user from the online map.
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
