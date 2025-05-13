import React, { useState } from "react";
import { useAuthenticationStore } from "../store/useAuthenticationStore";
import { Camera, Mail, User } from "lucide-react";

//User profile page.
const ProfilePage = () => {
  // Get the current user info and functions needed for profile updates.
  const { authUser, isUpdatingProfile, updateProfile } =
    useAuthenticationStore();
  // Local state to temporarily hold a new profile image.
  const [selectedImg, setSelectedImg] = useState(null);

  // Handle file selection and upload to update profile picture.
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Use FileReader to convert the image for preview and upload.
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      // Update the profile picture on the server.
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="my-2">Your Profile Information.</p>

            {/* Section to upload and display the profile picture. */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={
                    selectedImg || authUser.profilePic || "/defaultAvatar.jpg"
                  }
                  alt="Profile Picture"
                  className="size-32 rounded-full object-cover border-4 m-auto"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`
                  absolute bottom-5 right-8
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                  `}
                >
                  <Camera className="w-10 h-10 text-base-200" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
                <div>
                  <p className="text-sm mt-1 text-zinc-400">
                    {isUpdatingProfile
                      ? "Uploading..."
                      : "Click to update profile picture"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Display the full name of the user. */}
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name.
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {authUser?.fullName}
                </p>
              </div>

              {/* Display the email address of the user. */}
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address.
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {authUser?.email}
                </p>
              </div>

              {/* Section to display additional account details. */}
              <div className="mt-6 bg-base-300 rounded-xl p-6">
                <h2 className="text-lg font-medium mb-4">Account Details</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-zinc-500">
                    <span>Joined.</span>
                    <span>{authUser.createdAt?.split("T")[0]}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Status.</span>
                  <span className="text-green-400">Active.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
