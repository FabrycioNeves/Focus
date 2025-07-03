import { create } from "zustand";
import { persist } from "zustand/middleware";
import { zustandStorage } from "./zustandStore";

export const useNotificationStore = create(
  persist(
    (set) => ({
      notification1: "",
      notification2: "",
      defaultNotification: false,
      alarmEnabled: false,

      setNotification1: (text) => set({ notification1: text }),
      setNotification2: (text) => set({ notification2: text }),
    }),
    {
      name: "notification-storage",
      storage: zustandStorage,
    }
  )
);
