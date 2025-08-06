// src/lib/subscriptionService.ts
import axios from "axios";
import { API_CONFIG } from "../config/api";

const subApi = axios.create({
  baseURL: API_CONFIG.SUBSCRIPTION,
  headers: { "Content-Type": "application/json" },
});

const plansApi = axios.create({
  baseURL: API_CONFIG.SUBSCRIPTION_PLANS,
  headers: { "Content-Type": "application/json" },
});

subApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const normalizeType = (type?: string): "FREE" | "PREMIUM" | "LITE" => {
  if (!type) return "LITE";
  const t = type.toUpperCase();
  if (t === "FREE") return "FREE";
  if (["PLUS", "PRO", "ELITE", "PREMIUM"].includes(t)) return "PREMIUM";
  return "LITE";
};

export const getAllPlans = async () => {
  const res = await plansApi.get("/plans");
  return (res.data.data || []).map((plan: any) => ({
    ...plan,
    type: normalizeType(plan.type),
  }));
};

export const getUserSubscription = async (userId: string) => {
  try {
    console.log("Calling getUserSubscription for userId:", userId);
    const res = await subApi.get(`/user/${userId}`);
    console.log("API response:", res.data);
    
    const subscription = res.data.data?.[0] ?? null;
    console.log("Extracted subscription:", subscription);
    return subscription;
  } catch (error: any) {
    console.error("Error fetching user subscription:", error.response?.data || error.message);
    console.error("Error status:", error.response?.status);
    
    // If it's a 409 error (user already has subscription), we should still try to get the subscription
    if (error.response?.status === 409) {
      console.log("User already has subscription, trying to fetch existing subscription...");
      // You might need to call a different endpoint to get the existing subscription
      // For now, we'll return null and let the frontend handle it
      return null;
    }
    
    throw error; // Re-throw other errors
  }
};

export const createSubscription = async (
  userId: string,
  type: "FREE" | "PREMIUM" | "LITE" = "FREE"
) => {
  const plans = await getAllPlans();
  const plan = plans.find((p) => p.type === type);
  if (!plan) throw new Error(`No plan found for type: ${type}`);

  try {
    const res = await subApi.post("/", {
      userId: userId,
      planId: plan.id,
    });
    return res.status === 201;
  } catch (error: any) {
    // If user already has a subscription (409 error), treat it as success
    if (error.response?.status === 409) {
      console.log("User already has an active subscription - treating as success");
      return true; // Return true to indicate "success" even though subscription already exists
    }
    throw error; // Re-throw other errors
  }
};
