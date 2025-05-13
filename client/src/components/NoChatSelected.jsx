import React from "react";

//Shows when no user is selected to message.
const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-4">
        <h2 className="text-2xl font-bold text-primary animate-fade-in">
          Welcome to Messenger Chat App!
        </h2>
        <p className="text-base-content/70">
          Select a chat to start messaging or create a new conversation.
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
