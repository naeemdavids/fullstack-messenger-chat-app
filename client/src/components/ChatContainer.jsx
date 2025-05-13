import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore.js";
import ChatBoxHeader from "./ChatBoxHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import { useAuthenticationStore } from "../store/useAuthenticationStore.js";
import formatMessageTime from "../lib/formatMessageTime.js";

//Container for the chat messages.
const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    getMessagesInRealTime,
    stopGettingMessagesInRealTime,
  } = useChatStore();
  const { authUser } = useAuthenticationStore();
  const messageEndRef = useRef(null);

  // When the selected chat user changes, load messages and set up real-time updates.
  useEffect(() => {
    // Fetch chat messages for the selected user.
    getMessages(selectedUser._id); // Retrieve the conversation from the server.
    // Establish real-time messaging using sockets.
    getMessagesInRealTime(); // Listen for incoming messages continuously.
    // Clean up the socket listener when component unmounts or dependency changes.
    return () => stopGettingMessagesInRealTime(); // Stop the socket subscription to avoid memory leaks.
  }, [
    selectedUser._id,
    getMessages,
    getMessagesInRealTime,
    stopGettingMessagesInRealTime,
  ]);

  // Automatically scroll to the latest message when new messages are received.
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" }); // Ensure conversation view stays up-to-date.
    }
  }, [messages]);

  // If no chat is selected, inform the user.
  if (!selectedUser) {
    return <div>Select a user to chat with</div>; // Inform the user to select a chat.
  }

  if (isMessagesLoading) return <div className="text-2xl">Loading...</div>; // Display loading text when messages are being fetched.

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatBoxHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Render messages using different styling for sender and receiver. */}
        {messages.map((message, index) => (
          // Wrap each message in a relative container for correct placement of overlay elements.
          <div key={message._id} className="relative">
            <div
              className={`chat ${
                message.senderId === authUser._id ? "chat-end" : "chat-start"
              }`}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  {/* Dynamically show the correct profile picture depending on the sender. */}
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || "defaultAvatar.jpg"
                        : selectedUser.profilePic || "defaultAvatar.jpg"
                    }
                    alt="Profile Picture"
                  />
                </div>
              </div>
              {/* Message bubble container with relative positioning for overlay elements. */}
              <div
                className={`chat-bubble flex flex-col ${
                  message.senderId === authUser._id
                    ? "bg-teal-600 text-black"
                    : ""
                }`}
              >
                {/* If the current user is the sender, display the delete button in the top-right corner of the bubble. */}
                {message.senderId === authUser._id && (
                  <button
                    className="absolute -top-2 -right-2 z-10 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs cursor-pointer"
                    onClick={() => {
                      // Confirm deletion action.
                      if (
                        window.confirm(
                          "Are you sure you want to delete this message?"
                        )
                      ) {
                        // Call the store method to delete the message.
                        useChatStore.getState().deleteMessage(message._id);
                      }
                    }}
                  >
                    X
                  </button>
                )}
                {/* Display message image if available. */}
                {message.image && (
                  <img
                    src={message.image}
                    alt="Image Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {/* Display the text of the message if available. */}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
            {/* Display the timestamp below the message bubble.
                It is right-aligned if the message belongs to the current user and left-aligned otherwise. */}
            <time
              className={`block text-xs opacity-50 mt-1 ${
                message.senderId === authUser._id ? "text-right" : "text-left"
              }`}
            >
              {formatMessageTime(message.createdAt)}
            </time>
            {/* Attach the scrolling reference element to the last message container. */}
            {index === messages.length - 1 && <div ref={messageEndRef} />}
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
