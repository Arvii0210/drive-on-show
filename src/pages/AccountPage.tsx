import React from "react";
import ProfileLayout from "../components/ui/ProfileLayout";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Camera,
  CreditCard,
  Download
} from "lucide-react";

const AccountPage = () => {
  const { user } = useAuth();

  const defaultAvatar = "/assets/images/user-avatar.jpg";

  // Format member since date from createdAt
  const formatMemberSince = (createdAt: string | undefined) => {
    if (!createdAt) return "Not available";
    const date = new Date(createdAt);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  

  return (
    <ProfileLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="relative">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-32 rounded-2xl mb-16"></div>
          
          {/* Profile Avatar */}
          <div className="absolute left-8 -bottom-12">
            <div className="relative">
              <img
                src={user?.avatar || defaultAvatar}
                alt="User Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {user?.name || "User Name"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 flex items-center mt-1">
                <Mail size={16} className="mr-2" />
                {user?.email || "user@example.com"}
              </p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Shield size={14} className="mr-1" />
              Verified
            </Badge>
          </div>

          

          {/* Account Details */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <CardTitle className="flex items-center">
                <User size={20} className="mr-2" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                      <User size={18} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Full Name</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user?.name || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                      <Mail size={18} className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Email Address</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3">
  <div className="flex items-center">
    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-3">
      <Calendar size={18} className="text-purple-600 dark:text-purple-400" />
    </div>
    <div>
      <p className="font-medium text-gray-900 dark:text-white">Member Since</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {formatMemberSince(user?.createdAt)}
      </p>
    </div>
  </div>
</div>

              </div>
            </CardContent>
          </Card>

          
        </div>
      </div>
    </ProfileLayout>
  );
};

export default AccountPage;
