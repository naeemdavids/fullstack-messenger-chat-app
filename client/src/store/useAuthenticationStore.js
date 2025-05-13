import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
const APP_BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

// Manage authentication, user data, and socket connection for real-time communications.
export const useAuthenticationStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // Verify user's authentication status on app start.
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      // Save user data on successful authentication.
      set({ authUser: res.data });
      get().connectSocket(); // Establish socket connection after authentication.
    } catch (error) {
      console.log("checkAuth Error:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false }); // Mark end of authentication check.
    }
  },

  // Register a new user and update authentication state.
  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account Successfully Created");
      get().connectSocket(); // Start socket communication after sign-up.
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Process user login and store authenticated user info.
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Login is Successfull");
      get().connectSocket(); // Connect to socket for real-time updates.
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // Handle user logout by clearing stored data and disconnecting the socket.
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out Successfully");
      get().disconnectSocket(); // Terminate socket connection on logout.
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Update user profile details such as profile picture.
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/updateProfile", data);
      set({ authUser: res.data });
      toast.success("Profile Updated");
    } catch (error) {
      console.log("Error Updating Profile", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Fetch another user's profile (admin only).
  fetchUserById: async (userId) => {
    try {
      const res = await axiosInstance.get(`/admin/user/${userId}`);
      return res.data; // return the user object
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch user");
    }
  },

  // Update another user's profile picture (admin only).
  updateUserPicAdmin: async (userId, base64Pic) => {
    try {
      const res = await axiosInstance.put(`/admin/user/${userId}/pic`, {
        profilePic: base64Pic,
      });
      toast.success("Profile picture updated");
      return res.data; // updated user
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update picture");
    }
  },

  // Establish a socket connection for real-time messaging and online status updates.
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(APP_BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();
    set({ socket: socket });
    // Listen for online users and update global state.
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  // Disconnect the current socket connection.
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
