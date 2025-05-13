import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Protect routes by validating the user's authentication token.
export const protectRoute = async (req, res, next) => {
  try {
    // Extract the token from cookies.
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized => No Token Provided" });
    }

    // Verify token validity using the JWT secret.
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized => Invalid Token" });
    }

    // Retrieve the user from the database while excluding their password.
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // Attach the user data to the request object for downstream use.
    req.user = user;
    next(); // Proceed to the next middleware or route handler.
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Ensures only administrators can access certain routes.
export const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
