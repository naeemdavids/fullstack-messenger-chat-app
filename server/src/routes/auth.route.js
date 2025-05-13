import express from "express";
import passport from "../lib/passport.js";
import session from "express-session";
import { generateToken } from "../lib/generateToken.js";
import {
  login,
  logout,
  signup,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Initialize session and Passport middleware once.
router.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);
router.use(passport.initialize());
router.use(passport.session());

// Public routes for signing up and logging in.
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes for actions requiring authentication.
router.put("/updateProfile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

// Google OAuth initiation.
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback.
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    generateToken(req.user._id, res);
    res.redirect("http://localhost:5173/");
  }
);

// GitHu OAuth callback.
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    generateToken(req.user._id, res);
    res.redirect("http://localhost:5173/");
  }
);

export default router;
