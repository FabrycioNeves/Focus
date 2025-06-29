import { Alert } from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useNotificationStore } from "../GlobalSates/NotificationsStore";
import { useDateStore } from "../GlobalSates/DateStore";
import { useTaskStore } from "../GlobalSates/TaskStore";
import { useRepetitionStore } from "../GlobalSates/RepetionsStore";

// Configuração padrão
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permissão negada", "Permissão para notificações foi negada!");
  }
}

export async function scheduleNotification(task) {
  const { finalDateTime } = useDateStore.getState();
  const { notification1, notification2 } = useNotificationStore.getState();
  const { repetition } = useRepetitionStore.getState();
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

  const now = new Date();
  const scheduledHour = parsedDate.getHours();
  const scheduledMinute = parsedDate.getMinutes();

  // 🔁 REPETIÇÃO DIÁRIA POR 30 DIAS
  if (repetition === "daily") {
    const todayTime = new Date();
    todayTime.setHours(scheduledHour);
    todayTime.setMinutes(scheduledMinute);
    todayTime.setSeconds(0);
    todayTime.setMilliseconds(0);

    const DIAS = 30;
    const notificationIds = [];
    const reminderIds = [];

    for (let i = 0; i < DIAS; i++) {
      const day = new Date(todayTime);
      day.setDate(todayTime.getDate() + i);

      if (i === 0 && day <= now) continue;

      // Notificação principal
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: `${task.text}:`,
          body: notification1 || "",
        },
        trigger: {
          type: "date",
          date: day,
        },
      });
      notificationIds.push(id);

      // Lembrete 2 minutos depois
      const reminderTime = new Date(day.getTime() + 2 * 60 * 1000);
      const reminderId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Lembrete:",
          body: notification2 || `Você ainda não completou "${task.text}"`,
        },
        trigger: {
          type: "date",
          date: reminderTime,
        },
      });
      reminderIds.push(reminderId);

      console.log(`📆 ${i + 1} - Notificação para ${day.toLocaleString()} ✅`);
    }

    // Salva os IDs no AsyncStorage
    await AsyncStorage.setItem(
      `NOTIFICATION_IDS_${task.id}`,
      JSON.stringify(notificationIds)
    );
    await AsyncStorage.setItem(
      `REMINDER_IDS_${task.id}`,
      JSON.stringify(reminderIds)
    );
    updateTaskNotificationId(task.id, notificationIds[0], reminderIds[0]); // salva a primeira só
    return;
  }

  // 🔁 REPETIÇÃO SEMANAL POR 12 SEMANAS
  if (repetition === "weekly") {
    const firstDay = new Date();
    firstDay.setDate(parsedDate.getDate());
    firstDay.setHours(scheduledHour);
    firstDay.setMinutes(scheduledMinute);
    firstDay.setSeconds(0);
    firstDay.setMilliseconds(0);

    const SEMANAS = 12;
    const notificationIds = [];
    const reminderIds = [];

    for (let i = 0; i < SEMANAS; i++) {
      const weekDay = new Date(firstDay);
      weekDay.setDate(firstDay.getDate() + i * 7);

      if (i === 0 && weekDay <= now) continue;

      // Notificação principal
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: `${task.text}:`,
          body: notification1 || "",
        },
        trigger: {
          type: "date",
          date: weekDay,
        },
      });
      notificationIds.push(id);

      // Lembrete 2 minutos depois
      const reminderTime = new Date(weekDay.getTime() + 2 * 60 * 1000);
      const reminderId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Lembrete:",
          body: notification2 || `Você ainda não completou "${task.text}"`,
        },
        trigger: {
          type: "date",
          date: reminderTime,
        },
      });
      reminderIds.push(reminderId);

      console.log(
        `📅 ${i + 1} - Notificação para ${weekDay.toLocaleString()} ✅`
      );
    }

    await AsyncStorage.setItem(
      `NOTIFICATION_IDS_${task.id}`,
      JSON.stringify(notificationIds)
    );
    await AsyncStorage.setItem(
      `REMINDER_IDS_${task.id}`,
      JSON.stringify(reminderIds)
    );
    updateTaskNotificationId(task.id, notificationIds[0], reminderIds[0]);
    return;
  }

  // 🔁 NOTIFICAÇÃO ÚNICA
  if (repetition === "none") {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${task.text}:`,
        body: notification1 || "",
      },
      trigger: { type: "date", date: parsedDate },
    });

    const reminderTime = new Date(parsedDate.getTime() + 2 * 60 * 1000);
    const reminderId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Lembrete:",
        body: notification2 || `Você ainda não completou "${task.text}"`,
      },
      trigger: { type: "date", date: reminderTime },
    });

    await AsyncStorage.setItem(
      `NOTIFICATION_IDS_${task.id}`,
      JSON.stringify([notificationId])
    );
    await AsyncStorage.setItem(
      `REMINDER_IDS_${task.id}`,
      JSON.stringify([reminderId])
    );
    updateTaskNotificationId(task.id, notificationId, reminderId);
  }
}
