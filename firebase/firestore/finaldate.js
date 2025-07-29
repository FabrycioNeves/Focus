import { scheduleNotification } from "../../ExpoNotifications/ConfigNotifications";

export async function scheduleNotificationFromFirestore(task) {
  if (!task || !task.finalDateTime) {
    console.warn("❌ Tarefa ou data não encontrada");
    return;
  }

  let parsedDate;

  // 🔧 Converte Firestore Timestamp para Date
  if (
    typeof task.finalDateTime === "object" &&
    "seconds" in task.finalDateTime
  ) {
    parsedDate = new Date(task.finalDateTime.seconds * 1000);
  } else {
    parsedDate = new Date(task.finalDateTime); // string ou Date
  }

  if (isNaN(parsedDate.getTime())) {
    console.warn("❌ Data inválida");
    return;
  }

  // ✅ Chama seu agendamento normal com a data corrigida
  await scheduleNotification({ ...task, finalDateTime: parsedDate });
}
