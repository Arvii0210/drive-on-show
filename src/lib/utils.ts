import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileType(type: string): string {
  const typeMap: Record<string, string> = {
    'jpg': 'JPEG',
    'jpeg': 'JPEG', 
    'png': 'PNG',
    'svg': 'SVG',
    'pdf': 'PDF',
    'ai': 'AI',
    'eps': 'EPS',
    'psd': 'PSD'
  };
  return typeMap[type.toLowerCase()] || type.toUpperCase();
}

export function getTimeUntilReset(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const diff = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
}
