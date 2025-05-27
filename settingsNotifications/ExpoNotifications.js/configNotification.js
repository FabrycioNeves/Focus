import { useEffect } from "react";
import { AppState } from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNotificationStore } from "../GlobalSatesNoti/DateStore";
import { useTaskGlobalStore } from "../GlobalSatesNoti/TaskStore";
import { useWriteonStore } from "../GlobalSatesNoti/NotificationStore";
import { Alert } from "react-native";

// Handler padrão
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

//  Solicita permissão
export async function registerForPushNotificationsAsync() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permissão negada", "Permissão para notificações foi negada!");
  }
}

// Agendar notificações
export async function scheduleNotification() {
  const { taskGlobal } = useTaskGlobalStore.getState();
  const { finalDateTime } = useNotificationStore.getState();
  const { NotiWrite } = useWriteonStore.getState();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: taskGlobal ? `${taskGlobal}:` : "Padrão", //ajusar para pegar os estados das tasks diretamete do async stourage
      body: NotiWrite || "Você tem uma tarefa pendente.",
    },
    trigger: {
      type: "date",
      date: finalDateTime,
    },
  });

  const reminderTime = new Date(finalDateTime.getTime() + 2 * 60 * 1000); // 2 minutos depois(para testes,depois ajustar para 30 minutos)

  const reminderId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Lembrete:",
      body:
        NotiWrite ||
        `Você ainda não completou sua tarefa "${taskGlobal || "pendente"}"`,
    },
    trigger: { type: "date", date: reminderTime },
  });

  await AsyncStorage.setItem("REMINDER_ID", reminderId);
}
