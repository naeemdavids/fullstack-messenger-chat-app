import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Camera, Mail, User } from "lucide-react";
import { useAuthenticationStore } from "../store/useAuthenticationStore";

//Page that allows the admin to view the profile of other users.
const AdminUserProfile = () => {
  const { id } = useParams();
  const fetchUserById = useAuthenticationStore((s) => s.fetchUserById);
  const updateUserPicAdmin = useAuthenticationStore(
    (s) => s.updateUserPicAdmin
  );

  const [user, setUser] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load the selected user's profile on mount.
  useEffect(() => {
    (async () => {
      const u = await fetchUserById(id);
      setUser(u);
    })();
  }, [id, fetchUserById]);

  // Handle image selection.
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Convert to base64 for preview & upload.
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      setIsUpdating(true);
      // Update via admin action
      const updated = await updateUserPicAdmin(id, base64Image);
      if (updated) setUser(updated);
      setIsUpdating(false);
      setSelectedImg(null);
    };
    reader.readAsDataURL(file);
  };

  if (!user) return <div className="p-4">Loading user…</div>;

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Manage Profile</h1>
            <p className="my-2">Edit user profile information.</p>

            {/* Profile picture section. */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={selectedImg || user.profilePic || "/defaultAvatar.jpg"}
                  alt={user.fullName}
                  className="size-32 rounded-full object-cover border-4 m-auto"
                />
                <label
                  htmlFor="admin-avatar-upload"
                  className={`
                    absolute bottom-10 right-10
                    bg-base-content hover:scale-105
                    p-2 rounded-full cursor-pointer
                    transition-all duration-200
                    ${isUpdating ? "animate-pulse pointer-events-none" : ""}
                  `}
                >
                  <Camera className="w-10 h-10 text-base-200" />
                  <input
                    type="file"
                    id="admin-avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdating}
                  />
                </label>
                <div>
                  <p className="text-sm mt-1 text-zinc-400">
                    {isUpdating
                      ? "Uploading..."
                      : "Click to update user picture"}
                  </p>
                  <p className="text-pink-700">
                    Admin Can Also Edit Profile Pic:
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Full Name. */}
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name.
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {user.fullName}
                </p>
              </div>

              {/* Email. */}
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address.
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {user.email}
                </p>
              </div>

              {/* Account Details. */}
              <div className="mt-6 bg-base-300 rounded-xl p-6">
                <h2 className="text-lg font-medium mb-4">Account Details</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-zinc-500">
                    <span>Joined.</span>
                    <span>{user.createdAt?.split("T")[0]}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Admin.</span>
                  <span className="text-red-400">
                    {user.isAdmin ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserProfile;
