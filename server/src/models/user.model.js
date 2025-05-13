import mongoose from "mongoose";

// Schema definition for a user.
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // Ensure emails are unique.
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Enforce minimum password length.
    },
    profilePic: {
      type: String,
      default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // Automatically manage timestamps.
);

const User = mongoose.model("User", userSchema);

export default User;
