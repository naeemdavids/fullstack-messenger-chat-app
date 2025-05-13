import React from "react";
import { useChatStore } from "../store/useChatStore.js";
import SidebarPanel from "../components/SidebarPanel.jsx";
import NoChatSelected from "../components/NoChatSelected.jsx";
import ChatContainer from "../components/ChatContainer.jsx";

//The landing homepage after you log in.
const LandingHomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow=xl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rouned-lg overflow-hidden">
            <SidebarPanel />
            {/* Conditionally render either NoChatSelected prompt or the chat container. */}
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingHomePage;

{
  /* Conditionally render either NoChatSelected prompt or the chat container. */
}
