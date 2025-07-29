// src/lib/subscriptionService.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/subscription-plans", // ✅ Correct path
  headers: { "Content-Type": "application/json" },
});

const normalizeType = (type?: string): "FREE" | "PREMIUM" | "LITE" => {
  switch (type?.toUpperCase()) {
    case "FREE":
      return "FREE";
    case "PLUS":
    case "PRO":
    case "ELITE":
      return "PREMIUM";
    case "LITE1":
    case "LITE2":
    default:
      return "LITE";
  }
};

export const getAllPlans = async () => {
  const res = await api.get("/plans");
  const list: any[] = res.data?.data || [];

  return list.map((plan) => ({
    ...plan,
    type: normalizeType(plan.type),
  }));
};

export const getUserSubscription = async () => {
  const token = typeof window !== "undefined" && localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const res = await api.get("/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data?.data;
  } catch (err) {
    console.error("❌ Failed to fetch user subscription", err);
    return null;
  }
};
