// Enhanced subscription hook with API integration
import { useState, useEffect } from "react";
import { subscriptionAPI } from "@/lib/api";
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
  features?: string[];
  popular?: boolean;
  bestValue?: boolean;
}

interface UserSubscription {
  id: string;
  planId: string;
  plan: Plan;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "CANCELLED" | "EXPIRED";
  standardCreditsUsed: number;
  premiumCreditsUsed: number;
}

interface UserStats {
  standardCreditsUsed: number;
  premiumCreditsUsed: number;
  standardCreditsRemaining: number;
  premiumCreditsRemaining: number;
  downloadsToday: number;
  totalDownloads: number;
}

export const useSubscription = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const isLoggedIn = () => 
    typeof window !== "undefined" && !!localStorage.getItem("accessToken");

  const getUserId = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.sub;
    } catch {
      return null;
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const fetchPlans = async () => {
    try {
      const response = await subscriptionAPI.getPlans();
      setPlans(response.data?.data || response.data || []);
    } catch (err: any) {
      setError("Failed to load subscription plans");
      console.error("Error fetching plans:", err);
    }
  };

  const fetchUserSubscription = async () => {
    if (!isLoggedIn()) return;

    try {
      const response = await subscriptionAPI.getCurrentSubscription();
      setUserSubscription(response.data?.data || response.data);
    } catch (err: any) {
      // Don't show error for 404 (no subscription found)
      if (err.response?.status !== 404) {
        console.error("Error fetching user subscription:", err);
      }
    }
  };

  const fetchUserStats = async () => {
    if (!isLoggedIn()) return;

    const userId = getUserId();
    if (!userId) return;

    try {
      const response = await subscriptionAPI.getUserStats(userId);
      setUserStats(response.data?.data || response.data);
    } catch (err: any) {
      console.error("Error fetching user stats:", err);
    }
  };

  const createSubscription = async (planId: string): Promise<boolean> => {
    if (!isLoggedIn()) {
      toast({
        title: "Login Required",
        description: "Please login to subscribe to a plan",
        variant: "destructive"
      });
      return false;
    }

    try {
      const response = await subscriptionAPI.createSubscription(planId);
      
      if (response.data?.success || response.status === 200) {
        triggerConfetti();
        toast({
          title: "Success! 🎉",
          description: "Your subscription has been activated!",
        });
        
        // Refresh data
        await Promise.all([
          fetchUserSubscription(),
          fetchUserStats()
        ]);
        
        return true;
      }
      return false;
    } catch (err: any) {
      toast({
        title: "Subscription Failed",
        description: err.response?.data?.message || "Failed to create subscription",
        variant: "destructive"
      });
      return false;
    }
  };

  const autoAssignFreePlan = async () => {
    if (!isLoggedIn() || userSubscription) return;

    const freePlan = plans.find(p => p.type === "FREE");
    if (freePlan) {
      await createSubscription(freePlan.id);
    }
  };

  const getRemainingCredits = () => {
    if (!userSubscription || !userStats) return { standard: 0, premium: 0 };
    
    return {
      standard: userStats.standardCreditsRemaining,
      premium: userStats.premiumCreditsRemaining
    };
  };

  const isSubscriptionExpiringSoon = () => {
    if (!userSubscription) return false;
    
    const endDate = new Date(userSubscription.endDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysUntilExpiry <= 7;
  };

  const getActivePlanId = () => {
    return userSubscription?.planId || null;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchPlans();
      
      if (isLoggedIn()) {
        await Promise.all([
          fetchUserSubscription(),
          fetchUserStats()
        ]);
      }
      
      setLoading(false);
    };

    loadData();
  }, []);

  // Auto-assign free plan for logged-in users without subscription
  useEffect(() => {
    if (plans.length > 0 && isLoggedIn() && !userSubscription && !loading) {
      autoAssignFreePlan();
    }
  }, [plans, userSubscription, loading]);

  return {
    plans,
    userSubscription,
    userStats,
    loading,
    error,
    createSubscription,
    getRemainingCredits,
    isSubscriptionExpiringSoon,
    getActivePlanId,
    isLoggedIn: isLoggedIn(),
    refreshSubscription: fetchUserSubscription,
    refreshStats: fetchUserStats,
    triggerConfetti
  };
};