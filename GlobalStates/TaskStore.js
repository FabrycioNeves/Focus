import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useDateStore } from "./DateStore";
import { useNotificationStore } from "./NotificationsStore";
import { useRepetitionStore } from "./RepetionsStore";

export const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      nextId: 1,
      addTask: (text) =>
        set((state) => {
          const finalDateTime = useDateStore.getState().finalDateTime;
          const notification1 = useNotificationStore.getState().notification1;
          const notification2 = useNotificationStore.getState().notification2;
          const repetition = useRepetitionStore.getState().repetition;
          const newTask = {
            id: state.nextId,
            text,
            completed: false,
            notificationId: null,
            reminderId: null,
            finalDateTime: finalDateTime || null,
            notification1: notification1 || null,
            notification2: notification2 || null,
            repetition: repetition || null,
          };

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
      deleteTask: async (id) => {
        const state = get();
        const task = state.tasks.find((t) => t.id === id);

        if (!task) {
          console.warn("❌ Tarefa não encontrada para deletar");
          return;
        }

        // 1. Cancelar notificações principais
        try {
          const notificationIdsJson = await AsyncStorage.getItem(
            `NOTIFICATION_IDS_${id}`
          );
          if (notificationIdsJson) {
            const notificationIds = JSON.parse(notificationIdsJson);
            for (const notifId of notificationIds) {
              await Notifications.cancelScheduledNotificationAsync(notifId);
              console.log("🗑️ Notificação cancelada:", notifId);
            }
            await AsyncStorage.removeItem(`NOTIFICATION_IDS_${id}`);
          }
        } catch (e) {
          console.error("Erro ao cancelar notificações:", e);
        }

        // 2. Cancelar lembretes
        try {
          const reminderIdsJson = await AsyncStorage.getItem(
            `REMINDER_IDS_${id}`
          );
          if (reminderIdsJson) {
            const reminderIds = JSON.parse(reminderIdsJson);
            for (const remId of reminderIds) {
              await Notifications.cancelScheduledNotificationAsync(remId);
              console.log("🗑️ Lembrete cancelado:", remId);
            }
            await AsyncStorage.removeItem(`REMINDER_IDS_${id}`);
          }
        } catch (e) {
          console.error("Erro ao cancelar lembretes:", e);
        }

        // 3. Remover lembrete único (caso tenha)
        await AsyncStorage.removeItem(`REMINDER_ID_${id}`);

        // 4. Remover do estado Zustand
        set({
          tasks: state.tasks.filter((t) => t.id !== id),
        });

        console.log("✅ Tarefa deletada com id:", id);
      },

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
