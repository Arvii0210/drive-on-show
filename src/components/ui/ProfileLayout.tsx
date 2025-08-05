// src/components/layouts/ProfileLayout.tsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { User, LogOut, Download, CreditCard } from "lucide-react";
import Header from "@/components/Header"; // ✅ Your global top header

const ProfileLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };



  const links = [
    { name: "Account Info", path: "/profile/account", icon: <User size={18} /> },
    { name: "Downloads", path: "/profile/downloads", icon: <Download size={18} /> },
    { name: "Active Plan", path: "/profile/plan", icon: <CreditCard size={18} /> },
  ];

  return (
    <>
      {/* Top Global Header */}
      <Header />

      {/* Profile Page Layout */}
      <section className="mt-24 px-4 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-md p-5 space-y-6">
          {/* User Info */}
          <div className="flex flex-col items-center gap-2 text-center">
            <img
                                src={user.avatar || "assets/images/user-avatar.jpg"}

              alt="avatar"
              className="w-16 h-16 rounded-full border"
            />
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <div className="font-semibold">{user?.name}</div>
              <div className="text-xs">{user?.email}</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition text-sm font-medium ${
                  location.pathname === link.path
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6">
          {children}
        </main>
      </section>
    </>
  );
};

export default ProfileLayout;
