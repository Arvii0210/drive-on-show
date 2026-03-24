import { create } from 'zustand';
import { mockNotifications, type NotificationItem } from '@/data/mockData';

interface NotificationState {
  notifications: NotificationItem[];
  addNotification: (notification: NotificationItem) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [...mockNotifications],

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
}));
