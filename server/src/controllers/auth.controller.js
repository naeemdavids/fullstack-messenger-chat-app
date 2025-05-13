import { generateToken } from "../lib/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

//Controllers for authentication.

export const signup = async (req, res) => {
  // Extract necessary data from the sign-up request.
  const { fullName, email, password } = req.body;
  try {
    // Validate that all required fields are provided.
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Enforce minimum password length.
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 charaters" });
    }

    // Check if the user already exists to prevent duplicate accounts.
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    // Securely hash the password before saving.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // Generate a JSON Web Token and set it as an HTTP-only cookie.
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        isAdmin: newUser.isAdmin,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Retrieve user by email for login.
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Validate the password using bcrypt's compare function.
    const isThisPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isThisPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a new token and attach it via cookies.
    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    // Clear the token cookie to effectively log the user out.
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    // Retrieve the new profile picture from the request.
    const { profilePic } = req.body;
    // The authenticated user is attached to the request by the protectRoute middleware.
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile Picture is Required" });
    }

    // Upload the profile picture to Cloudinary and retrieve its URL.
    const uploadProfilePicResponse = await cloudinary.uploader.upload(
      profilePic
    );
    // Update the user's profile picture in the database.
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadProfilePicResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in Update Profile", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    // Simply return the authenticated user data that was attached by middleware.
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth Controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fetch any user’s public profile (admin only).
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    console.error("getUserById error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update any user’s profile picture (admin only).
export const updateUserPicByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { profilePic } = req.body;
    if (!profilePic)
      return res.status(400).json({ message: "No picture provided" });

    // Upload to Cloudinary—reuse existing logic.
    const uploadRes = await cloudinary.uploader.upload(profilePic);
    const updated = await User.findByIdAndUpdate(
      id,
      { profilePic: uploadRes.secure_url },
      { new: true, select: "-password" }
    );
    if (!updated) return res.status(404).json({ message: "User not found" });

    return res.json(updated);
  } catch (err) {
    console.error("updateUserPicByAdmin error", err);
    return res.status(500).json({ message: "Server error" });
  }
};
