import React, { useEffect, useState, useMemo } from "react";
import { useChatStore } from "../store/useChatStore";
import { Users } from "lucide-react";
import { useAuthenticationStore } from "../store/useAuthenticationStore";
import { useNavigate } from "react-router-dom";

//Sidebar to display the users.
const SidebarPanel = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    deleteUser,
  } = useChatStore();
  const { onlineUsers, authUser } = useAuthenticationStore();
  const navigate = useNavigate();

  // Filter and sort state.
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [sortBy, setSortBy] = useState("alphabetical"); //Users list for listing by date.
  const [sortOrder, setSortOrder] = useState("asc"); //Users list for listing by acending or decending.

  useEffect(() => {
    getUsers(); // Fetch all users.
  }, [getUsers]);

  // Step 1: filter.
  // Used to filter the users that are online when selected.
  const filtered = useMemo(() => {
    return showOnlineOnly
      ? users.filter((u) => onlineUsers.includes(u._id))
      : users.slice();
  }, [users, showOnlineOnly, onlineUsers]);

  // Step 2: sort.
  // Sort the users/contacts in Alphabetical order or by Date added, in decending or acending order.
  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sortBy === "alphabetical") {
      list.sort((a, b) => a.fullName.localeCompare(b.fullName));
    } else if (sortBy === "date") {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    if (sortOrder === "desc") list.reverse();
    return list;
  }, [filtered, sortBy, sortOrder]);

  if (isUsersLoading) return <div>Loading…</div>;

  return (
    <aside className="h-full w-20 lg:w-72 border-base-300 flex flex-col">
      {/* Header with filters and sorting. */}
      <div className="border-b border-base-300 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Users className="size-10" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        {/* Online-only toggle. */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
            className="checkbox checkbox-sm"
          />
          <span className="text-sm">Online Only</span>
        </label>

        {/* Sort controls. */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <label className="text-sm">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select select-sm"
            >
              <option value="alphabetical">Name</option>
              <option value="date">Date Added</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Order:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="select select-sm"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contacts List. */}
      <div className="overflow-y-auto flex-1 py-3">
        {sorted.map((user) => (
          <div
            key={user._id}
            className="relative flex items-center justify-between p-3 hover:bg-base-300 transition-colors"
          >
            <button
              onClick={() => setSelectedUser(user)}
              className={`flex items-center gap-3 flex-1 text-left ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }`}
            >
              <img
                src={user.profilePic || "/defaultAvatar.jpg"}
                alt={user.fullName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="hidden lg:block truncate">
                <div className="font-medium">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>

            {/* Admin only features. */}
            {authUser?.isAdmin && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (window.confirm(`Delete user ${user.fullName}?`)) {
                      deleteUser(user._id);
                    }
                  }}
                  className="btn btn-xs btn-error text-white"
                  title="Delete User"
                >
                  ✕
                </button>
                <button
                  onClick={() => navigate(`/admin/user/${user._id}`)}
                  className="btn btn-xs btn-primary text-white"
                  title="View Profile"
                >
                  🔍
                </button>
              </div>
            )}
          </div>
        ))}

        {sorted.length === 0 && (
          <div className="text-center text-amber-200 py-4">No users found.</div>
        )}
      </div>
    </aside>
  );
};

export default SidebarPanel;
