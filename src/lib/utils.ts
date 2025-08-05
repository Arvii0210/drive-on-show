import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Quota and timezone utilities
export function getNextMidnight(userTimezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone): Date {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  // Convert to user's timezone
  const userTime = new Date(tomorrow.toLocaleString("en-US", { timeZone: userTimezone }));
  return userTime;
}

export function getTimeUntilReset(userTimezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone): string {
  const now = new Date();
  const nextMidnight = getNextMidnight(userTimezone);
  const timeDiff = nextMidnight.getTime() - now.getTime();
  
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
}

export function isNewDay(lastDownloadDate: string, userTimezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone): boolean {
  const lastDownload = new Date(lastDownloadDate);
  const now = new Date();
  
  // Convert both dates to user's timezone for comparison
  const lastDownloadUserTime = new Date(lastDownload.toLocaleString("en-US", { timeZone: userTimezone }));
  const nowUserTime = new Date(now.toLocaleString("en-US", { timeZone: userTimezone }));
  
  return lastDownloadUserTime.getDate() !== nowUserTime.getDate() ||
         lastDownloadUserTime.getMonth() !== nowUserTime.getMonth() ||
         lastDownloadUserTime.getFullYear() !== nowUserTime.getFullYear();
}

export function formatFileType(fileType: string): string {
  if (!fileType) return 'Unknown';
  return fileType.toUpperCase();
}



