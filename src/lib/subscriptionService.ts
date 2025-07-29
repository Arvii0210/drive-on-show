// src/lib/subscriptionService.ts
import axios from "axios";

const subApi = axios.create({
  baseURL: "http://localhost:3000/api/subscription",
  headers: { "Content-Type": "application/json" },
});

const plansApi = axios.create({
  baseURL: "http://localhost:3000/api/subscription-plans",
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
  const res = await subApi.get(`/user/${userId}`);
  return res.data.data?.[0] ?? null;
};

export const createSubscription = async (
  userId: string,
  type: "FREE" | "PREMIUM" | "LITE" = "FREE"
) => {
  const plans = await getAllPlans();
  const plan = plans.find((p) => p.type === type);
  if (!plan) throw new Error(`No plan found for type: ${type}`);

  const res = await subApi.post("/", {
    userId: userId,
    planId: plan.id,
  });

  return res.status === 201;
};
