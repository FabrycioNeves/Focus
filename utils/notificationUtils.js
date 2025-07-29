import AsyncStorage from "@react-native-async-storage/async-storage";

export async function wasNotificationScheduled(taskId) {
  const result = await AsyncStorage.getItem(`NOTIFICATION_IDS_${taskId}`);
  return !!result;
}
