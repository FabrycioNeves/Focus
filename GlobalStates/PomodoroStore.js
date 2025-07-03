import { create } from "zustand";

export const useTimerConfigStore = create((set) => ({
  configs: {},

  setTimerMinutes: (taskId, minutes) =>
    set((state) => ({
      configs: {
        ...state.configs,
        [taskId]: {
          ...state.configs[taskId],
          timerMinutes: minutes,
        },
      },
    })),

  setBreakMinutes: (taskId, minutes) =>
    set((state) => ({
      configs: {
        ...state.configs,
        [taskId]: {
          ...state.configs[taskId],
          breakMinutes: minutes,
        },
      },
    })),

  setRepetitions: (taskId, reps) =>
    set((state) => ({
      configs: {
        ...state.configs,
        [taskId]: {
          ...state.configs[taskId],
          repetitions: reps,
        },
      },
    })),
}));
