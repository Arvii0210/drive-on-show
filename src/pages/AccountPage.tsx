import React from "react";
import ProfileLayout from "../components/ui/ProfileLayout"; // Adjust path as needed
import { useAuth } from "@/context/AuthContext";

const AccountPage = () => {
  const { user } = useAuth();

  const defaultAvatar = "assets/images/user-avatar.jpg"; // ✅ Make sure this path is correct

  return (
    <ProfileLayout>
      <h2 className="text-2xl font-bold mb-4">Account Information</h2>

      <div className="space-y-4 text-gray-800 dark:text-gray-100">
        <div><strong>Name:</strong> {user?.name || "N/A"}</div> {/* ✅ Added name display */}
        <div><strong>Email:</strong> {user?.email || "N/A"}</div>

        <div className="flex items-center gap-3">
          <strong>Avatar:</strong>
          <img
            src={user?.avatar || defaultAvatar}
            alt="User Avatar"
            className="w-12 h-12 rounded-full object-cover border"
          />
        </div>
      </div>
    </ProfileLayout>
  );
};

export default AccountPage;
