import { create } from "zustand";

export const useRepetitionStore = create((set) => ({
  repetition: "none",
  setRepetition: (value) => set({ repetition: value }),
}));
