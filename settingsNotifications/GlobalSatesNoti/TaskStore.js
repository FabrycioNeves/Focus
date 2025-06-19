import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

export const useTaskStore = create(
  persist(
    (set) => ({
      tasks: [],
      nextId: 1,

      addTask: (text) =>
        set((state) => {
          const newTask = {
            id: state.nextId,
            text,
            completed: false,
            notificationId: null,
            reminderId: null,
          };
          console.log(" Nova tarefa adicionada:", newTask);
          return {
            tasks: [...state.tasks, newTask],
            nextId: state.nextId + 1,
          };
        }),

      toggleTask: (id) => {
        console.log("toggleTask chamado com id:", id);
        return set((state) => {
          return {
            tasks: state.tasks.map((task) => {
              if (task.id === id) {
                const updatedTask = { ...task, completed: !task.completed };

                console.log(" Tarefa antes:", task);
                console.log(" Tarefa depois:", updatedTask);

                if (updatedTask.completed) {
                  // Se a task foi marcada como completa, cancela notificações:

                  if (task.notificationId) {
                    //Cancela notificação principal
                    console.log(
                      "⏹️ Cancelando notificação principal:",
                      task.notificationId
                    );
                    Notifications.cancelScheduledNotificationAsync(
                      task.notificationId
                    );
                    updatedTask.notificationId = null;
                  }

                  // Cancela lembrete
                  if (task.reminderId) {
                    console.log("⏹️ Cancelando lembrete:", task.reminderId);
                    Notifications.cancelScheduledNotificationAsync(
                      task.reminderId
                    );
                    updatedTask.reminderId = null;

                    // Remove lembrete salvo no AsyncStorage
                    AsyncStorage.removeItem(`REMINDER_ID_${task.id}`)
                      .then(() =>
                        console.log(
                          ` REMINDER_ID_${task.id} removido do AsyncStorage`
                        )
                      )
                      .catch((err) =>
                        console.error(
                          " Erro ao remover lembrete do AsyncStorage:",
                          err
                        )
                      );
                  }
                }

                return updatedTask;
              }
              return task;
            }),
          };
        });
      },

      updateTaskNotificationId: (id, notificationId, reminderId = null) =>
        set((state) => {
          console.log(
            `Atualizando notificationId para task ${id}: notificationId:${notificationId}, reminderId:${reminderId}`
          );
          return {
            tasks: state.tasks.map((task) =>
              task.id === id
                ? {
                    ...task,
                    notificationId, // ✅ Atualiza o notificationId
                    reminderId: reminderId ?? task.reminderId, // ✅ Atualiza reminderId se passado, senão mantém o atual
                  }
                : task
            ),
          };
        }),

      deleteTask: (id) =>
        set((state) => {
          console.log(" Deletando tarefa com id:", id);
          return {
            tasks: state.tasks.filter((task) => task.id !== id),
          };
        }),

      clearTasks: () => {
        console.log(" Limpando todas as tarefas");
        set({ tasks: [], nextId: 1 });
      },
    }),
    {
      name: "task-storage",
      storage: {
        getItem: async (name) => {
          const item = await AsyncStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);
