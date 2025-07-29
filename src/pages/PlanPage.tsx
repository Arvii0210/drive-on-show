// src/pages/PlanPage.tsx
import React from "react";
import { Crown, Zap, ArrowUpRight } from "lucide-react";
import ProfileLayout from "@/components/ui/ProfileLayout";

const PlanPage = () => {
  return (
    <ProfileLayout>
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Crown className="text-yellow-400" size={26} />
          Your Current Plan
        </h2>

        {/* Plan Card */}
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-xl shadow-xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="inline-block bg-white text-orange-600 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                Premium
              </span>
              <h3 className="text-xl font-semibold">Unlimited Creative Access</h3>
              <p className="text-sm opacity-90">Expires on: <strong>Aug 15, 2025</strong></p>
            </div>
            <div className="flex flex-col items-end text-sm">
              <p className="text-white/80">Downloads used</p>
              <p className="text-lg font-bold">20 / 100</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button className="bg-white text-orange-600 hover:text-orange-700 font-semibold px-5 py-2 rounded-full flex items-center gap-2 transition">
              <ArrowUpRight size={18} />
              Upgrade Plan
            </button>
          </div>
        </div>

       
      </section>
    </ProfileLayout>
  );
};

export default PlanPage;
