import React from "react";
import { useAuthenticationStore } from "../store/useAuthenticationStore";
import { useChatStore } from "../store/useChatStore";
import { X } from "lucide-react";

//Header for the box where the messages are shown. Shows the username and if they are online or offline.
const ChatBoxHeader = () => {
  // Retrieve the currently selected user for chatting and method to update it.
  const { selectedUser, setSelectedUser } = useChatStore();
  // Retrieve the list of online users from the authentication store.
  const { onlineUsers } = useAuthenticationStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* User icon display with default avatar fallback. */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/defaultAvatar.jpg"}
                alt={selectedUser.fullname}
              />
            </div>
          </div>

          {/* Display selected user details and online status. */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            {/* Display online status based on the onlineUsers array from global state. */}
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close the chat by deselecting the user. */}
        <button
          className="text-3xl cursor-pointer"
          onClick={() => setSelectedUser(null)}
        >
          <X className="size-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatBoxHeader;
