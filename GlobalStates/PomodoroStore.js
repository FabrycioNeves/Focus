import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useTimerConfigStore = create(
  persist(
    (set) => ({
      configs: {},

      setTimerMinutes: (id, minutes) =>
        set((state) => ({
          configs: {
            ...state.configs,
            [id]: {
              ...state.configs[id],
              timerMinutes: minutes,
            },
          },
        })),

      setBreakMinutes: (id, minutes) =>
        set((state) => ({
          configs: {
            ...state.configs,
            [id]: {
              ...state.configs[id],
              breakMinutes: minutes,
            },
          },
        })),

      setRepetitions: (id, reps) =>
        set((state) => ({
          configs: {
            ...state.configs,
            [id]: {
              ...state.configs[id],
              repetitions: reps,
            },
          },
        })),
    }),
    {
      name: "timer-config-storage",
      storage: createJSONStorage(() => AsyncStorage), // ✅ ESSENCIAL!
    }
  )
);
