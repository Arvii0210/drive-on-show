// src/components/ui/badge.tsx
import React from "react";
import { twMerge } from "tailwind-merge";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "danger";
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "primary" }) => {
  return (
    <span
      className={twMerge(
        "inline-block rounded-full px-3 py-1 text-xs font-semibold",
        variant === "primary" && "bg-blue-100 text-blue-800",
        variant === "secondary" && "bg-gray-200 text-gray-800",
        variant === "success" && "bg-green-100 text-green-800",
        variant === "danger" && "bg-red-100 text-red-800"
      )}
    >
      {children}
    </span>
  );
};
