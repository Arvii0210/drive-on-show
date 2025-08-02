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
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getUserSubscription } from "@/lib/subscriptionService";

const Header = () => {
  const [searchText, setSearchText] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

const [userSubscription, setUserSubscription] = useState<any>(null);
const [isLoadingPlan, setLoading] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/photos?q=${encodeURIComponent(searchText.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

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

  useEffect(() => {
    const fetchUserSubscription = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          const subscription = await getUserSubscription(user.id);
          console.log("Fetched subscription:", subscription);
          setUserSubscription(subscription);
        } catch (error) {
          console.error('Error fetching user subscription:', error);
          // Set default free plan if error
          setUserSubscription({ plan: { type: 'FREE', displayName: 'Free Plan' } });
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchUserSubscription();
  }, [user?.id]);

  const getPlanBadgeStyle = (subscription: any) => {
    const planType = subscription?.plan?.type?.toUpperCase();
    const planName = subscription?.plan?.displayName || subscription?.plan?.name;
    
    switch (planType) {
      case 'PREMIUM':
      case 'PLUS':
      case 'PRO':
      case 'ELITE':
        return {
          gradient: 'from-amber-500 to-orange-500',
          text: planName || 'Premium',
          icon: '⭐'
        };
      case 'LITE':
        return {
          gradient: 'from-blue-500 to-purple-500',
          text: planName || 'Lite Plan',
          icon: '💎'
        };
      case 'FREE':
      default:
        return {
          gradient: 'from-gray-500 to-gray-600',
          text: planName || 'Free Plan',
          icon: ''
        };
    }
  };

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
        <form onSubmit={handleSearch} className="relative w-full md:flex-1 md:max-w-xl order-3 md:order-none">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search assets or start creating"
            className="w-full rounded-full border border-gray-300 bg-white px-12 py-2.5 text-sm font-medium shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          {searchText && (
            <button
              type="button"
              onClick={() => setSearchText("")}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition text-lg"
            >
              ×
            </button>
          )}
        </form>

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
                  src={user.avatar || "assets/images/user-avatar.jpg"}
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
               <div className="absolute top-12 right-0 w-80 bg-white dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-zinc-800 overflow-hidden z-50 transform transition-all duration-200 ease-out">
               {/* User Profile Section */}
               <div className="relative overflow-hidden">
                 {/* Gradient Background */}
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20" />
                 
                 <div className="relative flex items-center gap-4 p-5">
                   {/* Avatar with Status Indicator */}
                   <div className="relative">
                     <div className="relative">
                       <img
                         src={user.avatar || "/assets/images/user-avatar.jpg"}
                         alt="User"
                         className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white dark:ring-zinc-800 shadow-lg"
                       />
                       <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900" />
                     </div>
                   </div>
                   
                   {/* User Info */}
                   <div className="flex-1 min-w-0">
                     <h3 className="font-semibold text-base text-gray-900 dark:text-white truncate">
                       {user.name || user.email?.split('@')[0]}
                     </h3>
                     <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                       {user.email}
                     </p>
                     
                     {/* Dynamic Plan Badge */}
                     {isLoadingPlan ? (
                       <div className="flex items-center gap-2 mt-2">
                         <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                       </div>
                     ) : userSubscription ? (
                       <div className="flex items-center gap-2 mt-2">
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${getPlanBadgeStyle(userSubscription).gradient} text-white shadow-sm`}>
                           {getPlanBadgeStyle(userSubscription).icon && (
                             <span className="mr-1">{getPlanBadgeStyle(userSubscription).icon}</span>
                           )}
                           {getPlanBadgeStyle(userSubscription).text}
                         </span>
                         
                         {/* Show expiry info for paid plans */}
                         {userSubscription.plan?.type !== 'FREE' && !userSubscription.isExpired && (
                           <span className="text-xs text-gray-500 dark:text-gray-400">
                             {userSubscription.daysRemaining > 0 
                               ? `${userSubscription.daysRemaining}d left`
                               : 'Expires today'
                             }
                           </span>
                         )}
                         
                         {/* Show expired status */}
                         {userSubscription.isExpired && (
                           <span className="text-xs text-red-500 dark:text-red-400">
                             Expired
                           </span>
                         )}
                       </div>
                     ) : (
                       // Default to free plan if no subscription found
                       <div className="flex items-center gap-2 mt-2">
                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-sm">
                           Free Plan
                         </span>
                       </div>
                     )}
                     
                     {/* Optional: Show download limits */}
                     {userSubscription && (
                       <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                         {userSubscription.remainingPremiumDownloads > 0 && (
                           <span>
                             {userSubscription.remainingPremiumDownloads} premium
                           </span>
                         )}
                         {userSubscription.remainingStandardDownloads > 0 && (
                           <span>
                             {userSubscription.remainingStandardDownloads} standard
                           </span>
                         )}
                       </div>
                     )}
                   </div>
                 </div>
               </div>
             
               {/* Navigation Links */}
               <div className="px-2 py-2">
                 <nav className="space-y-0.5">
                   <Link
                     to="/profile/downloads"
                     className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-200"
                   >
                     <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-colors">
                       <History className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                     </div>
                     <div className="flex-1">
                       <p className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                         Downloads
                       </p>
                       <p className="text-xs text-gray-500 dark:text-gray-400">View your history</p>
                     </div>
                     <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transform group-hover:translate-x-0.5 transition-transform" />
                   </Link>
             
                   <Link
                     to="/profile/plan"
                     className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-200"
                   >
                     <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-500/10 group-hover:bg-purple-100 dark:group-hover:bg-purple-500/20 transition-colors">
                       <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                     </div>
                     <div className="flex-1">
                       <p className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                         Active Plan
                       </p>
                       <p className="text-xs text-gray-500 dark:text-gray-400">
                         {(typeof userSubscription !== "undefined" && userSubscription?.plan?.displayName) || 'Manage subscription'}
                       </p>
                     </div>
                     <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transform group-hover:translate-x-0.5 transition-transform" />
                   </Link>
              
                    <Link
                      to="/profile/account"
                      className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-200"
                    >
                      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-green-50 dark:bg-green-500/10 group-hover:bg-green-100 dark:group-hover:bg-green-500/20 transition-colors">
                        <User className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                          Account Info
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Personal details</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transform group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </nav>
                </div>
              
                {/* Divider */}
                <div className="mx-4 my-2 border-t border-gray-100 dark:border-zinc-800" />
              
                {/* Logout Section */}
                <div className="px-2 pb-2">
                  <button
                    onClick={logout}
                    className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-50 dark:bg-zinc-800 group-hover:bg-red-100 dark:group-hover:bg-red-500/20 transition-colors">
                      <LogOut className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transform group-hover:-translate-x-0.5 transition-all" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-red-600 dark:group-hover:text-red-400">
                        Sign Out
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">See you soon!</p>
                    </div>
                  </button>
                </div>
              
                {/* Footer */}
                <div className="px-5 py-3 bg-gray-50 dark:bg-zinc-800/50 border-t border-gray-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>© Pextee</span>
                  </div>
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
                  src={user.avatar || "assets/images/user-avatar.jpg"}
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
