import { create } from "zustand";

export const useNotificationStore = create((set) => ({
  finalDateTime: null,
  setFinalDateTime: (date) => set({ finalDateTime: date }),
}));
