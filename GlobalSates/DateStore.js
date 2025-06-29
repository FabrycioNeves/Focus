import { create } from "zustand";
import { persist } from "zustand/middleware";
import { zustandStorage } from "./zustandStore";

export const useDateStore = create(
  persist(
    (set) => ({
      finalDateTime: null,
      setFinalDateTime: (date) => set({ finalDateTime: date }),
    }),
    {
      name: "date-storage",
      storage: zustandStorage,
      deserialize: (str) => {
        //Transforma de volta em Date para o usuário poder usar no código normalmente.
        const state = JSON.parse(str);
        return {
          ...state,
          finalDateTime: state.finalDateTime
            ? new Date(state.finalDateTime)
            : null,
        };
      },
    }
  )
);
