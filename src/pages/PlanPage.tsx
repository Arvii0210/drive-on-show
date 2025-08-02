// src/pages/PlanPage.tsx
import React from "react";
import { 
  Crown, 
  Download, 
  Calendar, 
  ArrowUpRight, 
  Sparkles, 
  Zap, 
  TrendingUp,
  Clock,
  AlertCircle,
  ChevronRight,
  Gem,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ProfileLayout from "@/components/ui/ProfileLayout";
import { useSubscription } from "@/hooks/useSubscription";
import { Link } from "react-router-dom";

const PlanPage = () => {
  const { userSubscription, loading, getRemainingCredits } = useSubscription();

  if (loading) {
    return (
      <ProfileLayout>
        <div className="flex flex-col items-center justify-center py-12 sm:py-20 space-y-3 sm:space-y-4">
          <div className="relative">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin border-t-blue-500"></div>
            <Crown className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500 w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 animate-pulse text-center px-4">
            Loading your plan details...
          </p>
        </div>
      </ProfileLayout>
    );
  }

  if (!userSubscription) {
    return (
      <ProfileLayout>
        <section className="space-y-4 sm:space-y-6 px-4 sm:px-0">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-xl sm:shadow-2xl">
                <Crown className="text-white w-8 h-8 sm:w-9 sm:h-9" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                No Active Plan
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto px-4">
                Unlock premium features and unlimited downloads with our subscription plans
              </p>
              
              <Link to="/plans">
                <Button 
                  size="default" 
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Sparkles className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  Explore Plans
                  <ArrowUpRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </ProfileLayout>
    );
  }

  const remainingCredits = getRemainingCredits();
  const standardUsed = userSubscription.standardDownloadsUsed;
  const premiumUsed = userSubscription.premiumDownloadsUsed;
  const standardTotal = userSubscription.standardDownloadsTotal;
  const premiumTotal = userSubscription.premiumDownloadsTotal;

  const standardProgress = standardTotal > 0 ? (standardUsed / standardTotal) * 100 : 0;
  const premiumProgress = premiumTotal > 0 ? (premiumUsed / premiumTotal) * 100 : 0;

  const daysRemaining = () => {
    const endDate = new Date(userSubscription.endDate);
    const today = new Date();
    return Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const isExpiringSoon = daysRemaining() <= 7;

  const getPlanGradient = () => {
    switch (userSubscription.plan.type) {
      case "FREE":
        return "from-gray-600 to-gray-800";
      case "PREMIUM":
        return "from-purple-600 via-pink-600 to-orange-600";
      default:
        return "from-blue-600 via-indigo-600 to-purple-600";
    }
  };

  const getPlanIcon = () => {
    switch (userSubscription.plan.type) {
      case "FREE":
        return <Star className="w-6 h-6 sm:w-8 sm:h-8" />;
      case "PREMIUM":
        return <Gem className="w-6 h-6 sm:w-8 sm:h-8" />;
      default:
        return <Zap className="w-6 h-6 sm:w-8 sm:h-8" />;
    }
  };

  return (
    <ProfileLayout>
      <section className="space-y-4 sm:space-y-6 lg:space-y-8 px-4 sm:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl sm:rounded-2xl shadow-lg">
              <Crown className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-xl sm:text-3xl">Subscription Plan</span>
          </h2>
          <Link to="/plans">
            <Button variant="outline" size="sm" className="group w-full sm:w-auto">
              <TrendingUp className="mr-2 w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
              Compare Plans
            </Button>
          </Link>
        </div>

        {/* Main Plan Card */}
        <div className={`relative rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden bg-gradient-to-br ${getPlanGradient()}`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 sm:w-64 h-32 sm:h-64 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="relative z-10 p-4 sm:p-6 lg:p-10">
            {/* Plan Header */}
            <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg w-fit">
                  {getPlanIcon()}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <span className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm text-white shadow-sm">
                      {userSubscription.plan.type} PLAN
                    </span>
                    {userSubscription.status === "ACTIVE" && (
                      <span className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 backdrop-blur-sm text-green-100 shadow-sm">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full mr-1.5 sm:mr-2 animate-pulse"></div>
                        Active
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
                    {userSubscription.plan.displayName}
                  </h3>
                  <p className="text-white/80 text-sm sm:text-base line-clamp-2">
                    {userSubscription.plan.description}
                  </p>
                </div>
              </div>

              {/* Expiry Info - Mobile Optimized */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 w-full">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
                      <span className="text-xs sm:text-sm text-white/80">Time Remaining</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white">
                      {daysRemaining()} days
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs sm:text-sm text-white/70">
                      Expires
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-white">
                      {new Date(userSubscription.endDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
                {isExpiringSoon && (
                  <div className="mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2 text-yellow-300">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs font-medium">Expiring soon!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Credits Usage - Responsive Grid */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2 lg:gap-6 mb-6 sm:mb-8">
              {standardTotal > 0 && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/15 transition-colors">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg sm:rounded-xl">
                        <Download className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm sm:text-base">Standard Downloads</h4>
                        <p className="text-xs text-white/70 hidden sm:block">Regular quality assets</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl sm:text-3xl font-bold text-white">{remainingCredits.standard}</span>
                      <span className="text-xs sm:text-sm text-white/70">of {standardTotal}</span>
                    </div>
                    <div className="relative h-2 sm:h-3 bg-white/20 rounded-full overflow-hidden">
                      <Progress 
                        value={100 - standardProgress} 
                        className="h-full bg-gradient-to-r from-green-400 to-blue-400"
                      />
                    </div>
                    <p className="text-xs text-white/60">{standardUsed} used</p>
                  </div>
                </div>
              )}

              {premiumTotal > 0 && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/15 transition-colors">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg sm:rounded-xl">
                        <Gem className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm sm:text-base">Premium Downloads</h4>
                        <p className="text-xs text-white/70 hidden sm:block">High-quality exclusive</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl sm:text-3xl font-bold text-white">{remainingCredits.premium}</span>
                      <span className="text-xs sm:text-sm text-white/70">of {premiumTotal}</span>
                    </div>
                    <div className="relative h-2 sm:h-3 bg-white/20 rounded-full overflow-hidden">
                      <Progress 
                        value={100 - premiumProgress} 
                        className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                      />
                    </div>
                    <p className="text-xs text-white/60">{premiumUsed} used</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link to="/plans" className="flex-1">
                <Button 
                  size="default" 
                  className="w-full bg-white text-gray-900 hover:bg-gray-100 shadow-lg sm:shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
                >
                  <ArrowUpRight className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  Upgrade Plan
                </Button>
              </Link>
              <Link to="/profile/downloads" className="flex-1">
                <Button 
                  size="default" 
                  variant="outline" 
                  className="w-full bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/40 shadow-lg text-sm sm:text-base"
                >
                  <Download className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  View Downloads
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Warning Alert - Mobile Optimized */}
        {(remainingCredits.standard <= 2 || remainingCredits.premium <= 2) && (
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-yellow-200 dark:border-yellow-800 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-1.5 sm:p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg sm:rounded-xl flex-shrink-0">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1 text-sm sm:text-base">
                  Running Low on Credits
                </h4>
                <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-200">
                  You're almost out of download credits. Upgrade your plan to continue enjoying unlimited access.
                </p>
                <Link to="/plans">
                  <Button variant="link" className="text-yellow-700 dark:text-yellow-300 p-0 h-auto mt-2 group text-xs sm:text-sm">
                    Explore upgrade options
                    <ChevronRight className="ml-1 w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats - Mobile Optimized Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Plan Type</span>
              <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
            </div>
            <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
              {userSubscription.plan.displayName}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Monthly Price</span>
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
            </div>
            <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            ₹{userSubscription.plan.price}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 xs:col-span-2 md:col-span-1">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Status</span>
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
            </div>
            <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white capitalize">
              {userSubscription.status.toLowerCase()}
            </p>
          </div>
        </div>
      </section>
    </ProfileLayout>
  );
};

export default PlanPage;
