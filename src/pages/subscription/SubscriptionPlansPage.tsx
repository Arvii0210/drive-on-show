import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlanCard from "./PlanCard";
import { useSubscription } from "@/hooks/useSubscription";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SubscriptionPlansPage: React.FC = () => {
  const {
    plans,
    userSubscription,
    loading,
    error,
    createSubscription,
    isLoggedIn,
  } = useSubscription();

  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (userSubscription?.plan?.id) {
      setActiveId(userSubscription.plan.id);
    } else if (userSubscription?.planId) {
      setActiveId(userSubscription.planId);
    }
  }, [userSubscription]);

  const handleBuy = async (planId: string, type: string) => {
    if (!isLoggedIn) {
      if (type === "FREE") {
        localStorage.setItem("activate_free_after_login", planId);
      }
      navigate("/login", { state: { from: "/subscription" } });
      return;
    }

    if (planId === activeId) {
      toast({ title: "You're already on this plan." });
      return;
    }

    if (type === "FREE") {
      try {
        const success = await createSubscription("FREE");
        if (success) {
          toast({ title: "Free plan activated!" });
          setActiveId(planId);
        }
      } catch {
        toast({ title: "Error", description: "Activation failed", variant: "destructive" });
      }
      return;
    }

    // For paid plans, redirect to checkout
    window.location.href = `/api/payments/checkout?planId=${planId}`;
  };

  // Handle auto free plan activation post-login
  useEffect(() => {
    const delayedPlan = localStorage.getItem("activate_free_after_login");
    if (isLoggedIn && delayedPlan) {
      const activate = async () => {
        try {
          const success = await createSubscription("FREE");
          if (success) {
            toast({ title: "Free plan activated!" });
            setActiveId(delayedPlan);
          }
        } catch {
          toast({ title: "Error", description: "Could not activate free plan", variant: "destructive" });
        } finally {
          localStorage.removeItem("activate_free_after_login");
        }
      };
      activate();
    }
  }, [isLoggedIn]);

  if (loading) return <div className="text-center py-20">Loading plans...</div>;
  if (error) return <div className="text-center text-red-500 py-20">{error}</div>;

  const starterPlan = plans.find((p) => p.type === "FREE");
  const premiumPlans = plans.filter((p) => p.type === "PREMIUM");
  const litePlans = plans.filter((p) => p.type === "LITE");

  return (
    <>
      <Header />
      <div className="relative bg-gradient-to-br from-blue-100 via-white to-indigo-100 min-h-screen overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">
          <h1 className="text-4xl font-extrabold text-center mb-8">Choose Your Plans</h1>

          {starterPlan && (
            <section className="mb-12 text-center">
              <h2 className="text-2xl font-bold">Starter Plan</h2>
              <div className="flex justify-center mt-4">
                <div className="w-full sm:w-[300px]">
                  <PlanCard
                    {...starterPlan}
                    isActive={starterPlan.id === activeId}
                    isLoggedIn={isLoggedIn}
                    onBuy={() => handleBuy(starterPlan.id, starterPlan.type)}
                    accent="green"
                    badge="FREE"
                  />
                </div>
              </div>
            </section>
          )}

          {premiumPlans.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-center">Premium Plans</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {premiumPlans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    {...plan}
                    isActive={plan.id === activeId}
                    isLoggedIn={isLoggedIn}
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

          {litePlans.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-center">Lite Plans</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                {litePlans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    {...plan}
                    isActive={plan.id === activeId}
                    isLoggedIn={isLoggedIn}
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
            <span>
              If you upgrade within your current plan duration, remaining credits and days carry forward.
            </span>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SubscriptionPlansPage;
