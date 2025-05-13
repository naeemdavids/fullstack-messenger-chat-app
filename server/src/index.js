import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";
import adminRoutes from "./routes/admin.route.js";

import session from "express-session";
import passport from "./lib/passport.js";

import path from "path";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({ limit: "5mb" })); // Allow JSON bodies up to 5MB for image uploads.
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// Global error handler to catch payload size issues.
app.use((err, req, res, next) => {
  if (err.type === "entity.too.large") {
    return res
      .status(413)
      .json({ message: "Image is too large. Max size is 5MB." });
  }
  next(err);
});

app.use(cookieParser()); // Parse cookies for authentication.
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Set up authentication and messaging routes.
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.use("/api/admin", adminRoutes);

//Google Login Services.
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

// Start the server and connect to the database.
server.listen(PORT, () => {
  console.log("Server is Running on Port:" + PORT);
  connectDB(); // Ensure that the database is connected once the server starts.
});
