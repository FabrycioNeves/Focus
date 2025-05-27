import { create } from "zustand";

export const useWriteonStore = create((set) => ({
  NotiWrite: "",
  setWriteNoti: (noti) => set({ NotiWrite: noti }),
}));
