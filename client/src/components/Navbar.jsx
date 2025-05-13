import React from "react";
import { useAuthenticationStore } from "../store/useAuthenticationStore";
import { LogOut, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  // Retrieve logout function and current authenticated user from our global store.
  const { logout, authUser, onlineUsers } = useAuthenticationStore();
  const isOnline = authUser && onlineUsers.includes(authUser._id);
  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base=100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-all"
            >
              <h1 className="text-lg font-bold">Messenger Chat App</h1>
            </Link>
          </div>

          {/* Logged-in user info. */}
          {authUser && (
            <div className="flex items-center gap-4">
              {/* User avatar */}
              <div className="avatar">
                <div className="w-8 h-8 rounded-full overflow-hidden border">
                  <img
                    src={authUser.profilePic || "/defaultAvatar.jpg"}
                    alt={authUser.fullName}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              {/* User name and status. */}
              <div className="hidden sm:flex flex-col">
                <span className="font-medium">{authUser.fullName}</span>
                <span
                  className={`text-xs ${
                    isOnline ? "text-green-500" : "text-gray-400"
                  }`}
                >
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          )}

          {/* Admin Tag if applicable. */}
          {authUser?.isAdmin && (
            <span className="ml-2 px-2 py-1 bg-red-600 text-white rounded-full text-xs">
              Administrator
            </span>
          )}

          {/* Settings, Profile, Logout. */}
          <div className="flex items-center gap-2">
            <Link to="/settings" className="btn btn-sm gap-2 transition-colors">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to="/profile" className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  className="hover:opacity-80 cursor-pointer flex gap-2 items-center btn btn-sm"
                  onClick={logout}
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
