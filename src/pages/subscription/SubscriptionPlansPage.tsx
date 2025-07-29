// src/pages/subscription/SubscriptionPlansPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlanCard from "./PlanCard"; 
import { getAllPlans, getUserSubscription } from "@/lib/subscriptionService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Info } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  displayName: string;
  type: "FREE" | "PREMIUM" | "LITE";
  price: number;
  premiumDownloads: number;
  standardDownloads: number;
  duration: number;
  description?: string;
}

const SubscriptionPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isLoggedIn = () =>
    typeof window !== "undefined" && !!localStorage.getItem("accessToken");

  useEffect(() => {
    async function fetchData() {
      try {
        const [plansRes, userSub] = await Promise.all([
          getAllPlans(),
          isLoggedIn() ? getUserSubscription() : Promise.resolve(null)
        ]);

        setPlans(plansRes);

        if (isLoggedIn() && userSub?.plan?.id) {
          setActivePlanId(userSub.plan.id);
        } else {
          setActivePlanId(null);
        }
      } catch {
        setError("Failed to load plans");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleBuy = (planId: string, type: string) => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    if (type === "FREE") {
      // FREE plan auto-assigned—no further action
      return;
    }
    // go to payment, as configured by your backend
    window.location.href = `/api/payments/checkout?planId=${planId}`;
  };

  if (loading) return <div className="text-center py-20">Loading plans...</div>;
  if (error) return <div className="text-center text-red-500 py-20">{error}</div>;

  const starterPlan = plans.find(p => p.type === "FREE");
  const premiumPlans = plans.filter(p => p.type === "PREMIUM");
  const litePlans = plans.filter(p => p.type === "LITE");

  return (
    <>
      <Header />
      <div className="relative bg-gradient-to-br from-blue-100 via-white to-indigo-100 min-h-screen overflow-hidden">
        {/* your decorative background */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">
          <h1 className="text-4xl font-extrabold text-center mb-8">
            Choose Your Plans
          </h1>

          {/* Starter Plan */}
          {starterPlan && (
            <section className="mb-12 text-center">
              <h2 className="text-2xl font-bold">Starter Plan</h2>
              <div className="flex justify-center mt-4">
                <div className="w-full sm:w-[300px]">
                  <PlanCard
                    {...starterPlan}
                    isActive={starterPlan.id === activePlanId}
                    isLoggedIn={isLoggedIn()}
                    onBuy={() => handleBuy(starterPlan.id, starterPlan.type)}
                    accent="green"
                    badge="FREE"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Premium Plans */}
          {premiumPlans.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-center">Premium Plans</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {premiumPlans.map(plan => (
                  <PlanCard
                    key={plan.id}
                    {...plan}
                    isActive={plan.id === activePlanId}
                    isLoggedIn={isLoggedIn()}
                    onBuy={() => handleBuy(plan.id, plan.type)}
                    accent={
                      plan.displayName === "Elite"
                        ? "purple"
                        : plan.displayName === "Pro"
                        ? "yellow"
                        : "orange"
                    }
                    badge={
                      plan.displayName === "Elite"
                        ? "BEST VALUE"
                        : plan.displayName === "Pro"
                        ? "POPULAR"
                        : "RECOMMENDED"
                    }
                  />
                ))}
              </div>
            </section>
          )}

          {/* Lite Plans */}
          {litePlans.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-center">Lite Plans</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                {litePlans.map(plan => (
                  <PlanCard
                    key={plan.id}
                    {...plan}
                    isActive={plan.id === activePlanId}
                    isLoggedIn={isLoggedIn()}
                    onBuy={() => handleBuy(plan.id, plan.type)}
                    accent="blue"
                    badge={plan.displayName === "Lite 2" ? "GIFT" : undefined}
                  />
                ))}
              </div>
            </section>
          )}

          <div className="bg-indigo-50 border-indigo-200 border rounded-lg p-4 mt-12 text-center">
            <Info className="inline-block h-5 w-5 mr-2 text-indigo-600" />
            <span>If you upgrade within your current plan duration, remaining credits and days carry forward.</span>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SubscriptionPlansPage;
