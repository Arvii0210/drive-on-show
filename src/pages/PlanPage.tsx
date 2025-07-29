// src/pages/PlanPage.tsx
import React from "react";
import { Crown, Download, Calendar, ArrowUpRight } from "lucide-react";
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
        <div className="text-center py-20">Loading your plan...</div>
      </ProfileLayout>
    );
  }

  if (!userSubscription) {
    return (
      <ProfileLayout>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Crown className="text-yellow-400" size={26} />
            No Active Plan
          </h2>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You don't have an active subscription plan.
            </p>
            <Link to="/plans">
              <Button>View Plans</Button>
            </Link>
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

  const isExpiringSoon = () => {
    const endDate = new Date(userSubscription.endDate);
    const today = new Date();
    const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 7;
  };

  return (
    <ProfileLayout>
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Crown className="text-yellow-400" size={26} />
          Your Current Plan
        </h2>

        <div className={`rounded-xl shadow-xl p-6 sm:p-8 text-white ${
          userSubscription.plan.type === "FREE"
            ? "bg-gradient-to-br from-green-400 to-blue-500"
            : userSubscription.plan.type === "PREMIUM"
            ? "bg-gradient-to-br from-purple-500 to-pink-500"
            : "bg-gradient-to-br from-blue-400 to-indigo-500"
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">
                {userSubscription.plan.type}
              </span>
              <h3 className="text-xl font-semibold">{userSubscription.plan.displayName}</h3>
              <p className="text-sm opacity-90 flex items-center gap-1">
                <Calendar size={14} />
                Expires: <strong>{new Date(userSubscription.endDate).toLocaleDateString()}</strong>
                {isExpiringSoon() && <span className="ml-2 bg-red-500 px-2 py-1 rounded text-xs">Expiring Soon!</span>}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {standardTotal > 0 && (
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Standard Downloads</span>
                  <span className="text-sm">{remainingCredits.standard} / {standardTotal}</span>
                </div>
                <Progress value={standardProgress} className="h-2" />
              </div>
            )}

            {premiumTotal > 0 && (
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Premium Downloads</span>
                  <span className="text-sm">{remainingCredits.premium} / {premiumTotal}</span>
                </div>
                <Progress value={premiumProgress} className="h-2" />
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/plans" className="flex-1">
              <Button variant="secondary" className="w-full">
                <ArrowUpRight size={18} />
                Upgrade Plan
              </Button>
            </Link>
            <Link to="/profile/downloads" className="flex-1">
              <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Download size={18} />
                View Downloads
              </Button>
            </Link>
          </div>
        </div>

        {(remainingCredits.standard <= 2 || remainingCredits.premium <= 2) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              ⚠️ You're running low on download credits. Consider upgrading your plan to continue downloading.
            </p>
          </div>
        )}
      </section>
    </ProfileLayout>
  );
};

export default PlanPage;
