// taskGlobalStore.js
import { create } from "zustand";

export const useTaskGlobalStore = create((set) => ({
  taskGlobal: "",
  setTaskGlobal: (newTask) => set({ taskGlobal: newTask }), //adcionar mais logicas e colocar estados locais acima do asyncstorage
}));
