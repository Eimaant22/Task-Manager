import React, { useContext, useRef, useState } from "react";
import { LuUser, LuCamera } from "react-icons/lu";
import { UserContext } from "../../context/UserContext.jsx";
import { API_PATHS } from "../../utils/apiPaths.jsx";
import axiosInstance from "../../utils/axiosInstance.jsx";
import uploadImage from "../../utils/uploadImage.jsx";

// Clickable profile photo with a "change photo" button.
// Put this in the sidebar where the old <img ... alt="Profile Image" /> was.
const SideMenuAvatar = () => {
  const { user, updateUser } = useContext(UserContext);
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [broken, setBroken] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow choosing the same file again
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      // 1) upload the file -> { imageUrl }
      const { imageUrl } = await uploadImage(file);

      // 2) save the URL on the user's profile
      const response = await axiosInstance.put(API_PATHS.AUTH.GET_PROFILE, {
        profileImageUrl: imageUrl,
      });

      // 3) update context so the sidebar refreshes immediately
      updateUser({ ...user, ...response.data });
      setBroken(false);
    } catch (err) {
      console.error("Profile photo update failed:", err);
      setError("Could not update photo");
    } finally {
      setUploading(false);
    }
  };

  const showImage = user?.profileImageUrl && !broken;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        {showImage ? (
          <img
            src={user.profileImageUrl}
            alt="Profile"
            onError={() => setBroken(true)}
            className="w-20 h-20 rounded-full object-cover bg-slate-400"
          />
        ) : (
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-100/50">
            <LuUser className="text-4xl text-primary" />
          </div>
        )}

        <input
          type="file"
          accept="image/png,image/jpeg"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          title="Change profile photo"
          className="w-7 h-7 absolute -bottom-1 -right-1 flex items-center justify-center bg-primary text-white rounded-full cursor-pointer disabled:opacity-60"
        >
          <LuCamera className="text-sm" />
        </button>
      </div>
      {uploading && <p className="text-[11px] text-gray-500 mt-2">Uploading...</p>}
      {error && <p className="text-[11px] text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default SideMenuAvatar;
