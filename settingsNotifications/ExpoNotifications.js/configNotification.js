import { Alert } from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useNotificationStore } from "../GlobalSatesNoti/NotificationStore";
import { useDateStore } from "../GlobalSatesNoti/DateStore";
import { useTaskStore } from "../GlobalSatesNoti/TaskStore";
import { useRepetitionStore } from "../GlobalSatesNoti/RepetionsStore";

// Configuração padrão para exibição das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Solicita permissão para notificações
export async function registerForPushNotificationsAsync() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permissão negada", "Permissão para notificações foi negada!");
  }
}

// Agendamento da notificação
export async function scheduleNotification(task) {
  const { finalDateTime } = useDateStore.getState();
  const { notification1, notification2 } = useNotificationStore.getState();
  const { repetition } = useRepetitionStore.getState(); // ← novo
  const { updateTaskNotificationId } = useTaskStore.getState();

  if (!task || !finalDateTime) {
    console.warn("❌ Tarefa ou data não encontrada");
    return;
  }

  const parsedDate = new Date(finalDateTime);
  if (isNaN(parsedDate.getTime())) {
    console.warn("❌ Data inválida");
    return;
  }

  let trigger;
  if (repetition === "none") {
    trigger = { type: "date", date: parsedDate }; // sem repeats
  } else if (repetition === "daily") {
    trigger = {
      hour: parsedDate.getHours(),
      minute: parsedDate.getMinutes(),
      repeats: true,
    };
  } else if (repetition === "weekly") {
    trigger = {
      weekday: parsedDate.getDay() === 0 ? 7 : parsedDate.getDay(),
      hour: parsedDate.getHours(),
      minute: parsedDate.getMinutes(),
      repeats: true,
    };
  }

  try {
    // Notificação principal
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${task.text}:`,
        body: notification1 || "",
      },
      trigger,
    });

    // Lembrete (sem repetição, 2 min depois)
    const reminderTime = new Date(parsedDate.getTime() + 2 * 60 * 1000);
    const reminderId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Lembrete:",
        body: notification2 || `Você ainda não completou "${task.text}"`,
      },
      trigger: { type: "date", date: reminderTime },
    });

    await AsyncStorage.setItem(`REMINDER_ID_${task.id}`, reminderId);

    updateTaskNotificationId(task.id, notificationId, reminderId);

    console.log("✅ Notificações agendadas com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao agendar notificações:", error);
  }
}
