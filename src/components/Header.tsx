import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  User,
  LogOut,
  CreditCard,
  History,
  ChevronDown,
  Menu,
  X,
  Camera,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const [searchText, setSearchText] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !(profileRef.current as any).contains(e.target)
      ) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignIn = () => navigate("/login");

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/80 dark:bg-black/50 border-b border-white/10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-white"
        >
          <div className="bg-gradient-to-br from-teal-500 to-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-extrabold shadow">
            Px
          </div>
          <span>Pextee</span>
        </Link>

        {/* Search Bar */}
        <div className="relative w-full md:flex-1 md:max-w-xl order-3 md:order-none">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search assets or start creating"
            className="w-full rounded-full border border-gray-300 bg-white px-12 py-2.5 text-sm font-medium shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          {searchText && (
            <button
              onClick={() => setSearchText("")}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition text-lg"
            >
              ×
            </button>
          )}
          <Camera className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 w-4 h-4" />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/category"
            className="text-sm font-medium text-gray-700 dark:text-white hover:text-blue-600"
          >
            Categories
          </Link>
          <Link
            to="/photos"
            className="text-sm font-medium text-gray-700 dark:text-white hover:text-blue-600"
          >
            Photos
          </Link>
          <Link to="/plans">
            <button className="rounded-full px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 hover:brightness-110 transition shadow-lg">
              View Plans
            </button>
          </Link>

          {!isLoggedIn ? (
            <Link
              onClick={handleSignIn}
              to="/login"
              className="px-4 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-medium transition"
            >
              Log In
            </Link>
          ) : (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 text-gray-800 dark:text-white hover:text-blue-600"
              >
                <img
                  src={user.avatar || "/user-avatar.png"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border"
                />
                <ChevronDown
                  size={16}
                  className={`${
                    showProfile ? "rotate-180" : ""
                  } transition-transform`}
                />
              </button>

              {showProfile && (
                <div className="absolute top-12 right-0 w-72 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                  <div className="flex items-center gap-3 p-4 border-b dark:border-zinc-700">
                    <img
                      src={user.avatar || "assets/images/user-avatar.jpg"}
                      alt="User"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="p-4 space-y-2 text-sm text-gray-800 dark:text-white">
                    <Link
                      to="/profile/downloads"
                      className="flex items-center gap-3 hover:text-blue-600"
                    >
                      <History size={16} /> Downloads
                    </Link>
                    <Link
                      to="/profile/plan"
                      className="flex items-center gap-3 hover:text-blue-600"
                    >
                      <CreditCard size={16} /> Active Plan
                    </Link>
                    <Link
                      to="/profile/account"
                      className="flex items-center gap-3 hover:text-blue-600"
                    >
                      <User size={16} /> Account Info
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center gap-3 text-red-600 hover:underline"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 shadow-xl p-6 space-y-4 text-sm font-medium text-gray-800 dark:text-white">
          <Link to="/category" className="block hover:text-blue-600">
            Categories
          </Link>
          <Link to="/photos" className="block hover:text-blue-600">
            Photos
          </Link>
          <Link to="/plans" className="block hover:text-blue-600">
            Plans
          </Link>

          {!isLoggedIn ? (
            <Button
              onClick={handleSignIn}
              className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2"
            >
              <User size={16} className="mr-2" />
              Sign In
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar || "/user-avatar.png"}
                  alt="avatar"
                  className="w-10 h-10 rounded-full border"
                />
                <div>
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <Link
                to="/profile/downloads"
                className="flex items-center gap-2 hover:text-blue-600"
              >
                <History size={16} /> Downloads
              </Link>
              <Link
                to="/profile/plan"
                className="flex items-center gap-2 hover:text-blue-600"
              >
                <CreditCard size={16} /> Active Plan
              </Link>
              <Link
                to="/profile/account"
                className="flex items-center gap-2 hover:text-blue-600"
              >
                <User size={16} /> Account Info
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-red-600 hover:underline"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
