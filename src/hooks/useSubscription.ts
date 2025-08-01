// src/hooks/useSubscription.ts
import { useState, useEffect } from "react";
import {
  getAllPlans,
  getUserSubscription,
  createSubscription as svcCreate,
} from "@/lib/subscriptionService"; 


import confetti from "canvas-confetti";
import { useToast } from "@/hooks/use-toast";

export const useSubscription = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const isLoggedIn = !!localStorage.getItem("accessToken");

  const triggerConfetti = () =>
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

  const fetchPlans = async () => {
    try {
      const data = await getAllPlans();
      setPlans(data);
      return data;
    } catch {
      setError("Failed to load plans");
      return [];
    }
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.log("No access token found");
        setUserSubscription(null);
        return null;
      }
      
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload?.id;
      if (!userId) {
        console.log("No userId found in token");
        setUserSubscription(null);
        return null;
      }

      console.log("Fetching subscription for userId:", userId);
      const sub = await getUserSubscription(userId);
      console.log("Subscription data received:", sub);
      setUserSubscription(sub);
      return sub;
    } catch (error) {
      console.error("Error fetching user subscription:", error);
      // Don't set userSubscription to null on error, keep existing state
      // This prevents the UI from showing "Start for Free" when there's a network error
      return null;
    }
  };

  const createSubscription = async (
    planType: "FREE" | "PREMIUM" | "LITE" = "FREE"
  ) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast({
        title: "Error",
        description: "Not logged in",
        variant: "destructive",
      });
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload?.id;

    if (!userId) {
      toast({
        title: "Error",
        description: "Invalid token",
        variant: "destructive",
      });
      return;
    }

    try {
      const ok = await svcCreate(userId, planType);
      if (ok) {
        triggerConfetti();
        toast({ title: "Success!", description: "Plan activated 🎉" });
        // Always fetch the latest subscription data, whether it was just created or already existed
        await fetchUser();
        return true;
      } else {
        toast({
          title: "Error",
          description: "Activation failed",
          variant: "destructive",
        });
        return false;
      }
    } catch (err) {
      console.error("Error creating subscription:", err);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
      return false;
    }
  };

  const getRemainingCredits = () => {
    if (!userSubscription) return { standard: 0, premium: 0 };
    return {
      standard: userSubscription.remainingStandardDownloads || 0,
      premium: userSubscription.remainingPremiumDownloads || 0,
    };
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchPlans();
      await fetchUser();
      setLoading(false);
    };
    init();
  }, [isLoggedIn]);

  return {
    plans,
    userSubscription,
    loading,
    error,
    createSubscription,
    refreshSubscription: fetchUser,
    getRemainingCredits,
    isLoggedIn,
  };
};
