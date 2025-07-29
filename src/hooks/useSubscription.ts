// src/hooks/useSubscription.ts
import { useState, useEffect } from "react";
import { getAllPlans, getUserSubscription } from "@/lib/subscriptionService";
import confetti from "canvas-confetti";
import { useToast } from "@/hooks/use-toast";

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

interface UserSubscription {
  id: string;
  plan: Plan;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "CANCELLED";
  standardCreditsUsed: number;
  premiumCreditsUsed: number;
}

export const useSubscription = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const isLoggedIn = () => 
    typeof window !== "undefined" && !!localStorage.getItem("accessToken");

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const createSubscription = async (planId: string) => {
    if (!isLoggedIn()) return false;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ planId })
      });

      if (response.ok) {
        triggerConfetti();
        toast({
          title: "Success!",
          description: "Your subscription has been activated! 🎉",
        });
        await fetchUserSubscription(); // Refresh subscription data
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to create subscription:", err);
      return false;
    }
  };

  const fetchPlans = async () => {
    try {
      const plansData = await getAllPlans();
      setPlans(plansData);
    } catch (err) {
      setError("Failed to load plans");
    }
  };

  const fetchUserSubscription = async () => {
    if (!isLoggedIn()) return;

    try {
      const subData = await getUserSubscription();
      setUserSubscription(subData);
    } catch (err) {
      console.error("Failed to fetch user subscription:", err);
    }
  };

  const getRemainingCredits = () => {
    if (!userSubscription) return { standard: 0, premium: 0 };
    
    const standardRemaining = userSubscription.plan.standardDownloads - userSubscription.standardCreditsUsed;
    const premiumRemaining = userSubscription.plan.premiumDownloads - userSubscription.premiumCreditsUsed;
    
    return {
      standard: Math.max(0, standardRemaining),
      premium: Math.max(0, premiumRemaining)
    };
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchPlans(),
        fetchUserSubscription()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    plans,
    userSubscription,
    loading,
    error,
    createSubscription,
    getRemainingCredits,
    isLoggedIn: isLoggedIn(),
    refreshSubscription: fetchUserSubscription
  };
};