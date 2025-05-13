import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthenticationStore } from "./useAuthenticationStore";

// Manage chat-related state, including contacts, selected user, messages and real-time functionality.
export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // Fetch the list of users available for chat.
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data }); // Update the users state with the fetched data.
    } catch (error) {
      toast.error(error.response.data.message); // Notify if an error occurs.
    } finally {
      set({ isUsersLoading: false }); // Ensure loading state is cleared.
    }
  },

  // Retrieve conversation messages for the selected user.
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data }); // Save messages in state for rendering.
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Send a new message to the selected user.
  sendMessages: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      // Append the new message to the existing messages list.
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Delete a message by its ID.
  deleteMessage: async (messageId) => {
    try {
      await axiosInstance.delete(`/messages/${messageId}`);
      // Update the state by filtering out the deleted message.
      set({ messages: get().messages.filter((msg) => msg._id !== messageId) });
    } catch (error) {
      toast.error(error.response.data.message); // Notify error.
    }
  },

  deleteUser: async (userId) => {
    try {
      // Call the admin-only endpoint.
      await axiosInstance.delete(`/admin/user/${userId}`);
      // Remove user from local state.
      set({
        users: get().users.filter((u) => u._id !== userId),
      });
      toast.success("User deleted successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user.");
    }
  },

  // Set up a real-time message listener using socket.io.
  getMessagesInRealTime: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthenticationStore.getState().socket;
    // Listen to incoming messages and only add them if they are from the selected conversation.
    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;
      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  // Remove the real-time message listener when the chat is closed or on logout.
  stopGettingMessagesInRealTime: () => {
    const socket = useAuthenticationStore.getState().socket;
    socket.off("newMessage"); // This avoids duplicate listeners or memory leaks.
  },

  // Set the currently selected one-on-one chat user.
  setSelectedUser: (selectedUser) => set({ selectedUser, selectedGroup: null }),
}));
