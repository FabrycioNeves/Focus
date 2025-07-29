import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { useTaskStore } from "../../GlobalStates/TaskStore";
import { useRepetitionStore } from "../../GlobalStates/RepetionsStore";
import { useNotificationStore } from "../../GlobalStates/NotificationsStore";
import { useDateStore } from "../../GlobalStates/DateStore";

export async function salvarTudo(userId) {
  try {
    const tasks = useTaskStore.getState().tasks;
    const repetition = useRepetitionStore.getState().repetition;
    const notification1 = useNotificationStore.getState().notification1;
    const notification2 = useNotificationStore.getState().notification2;
    const finalDateTime = useDateStore.getState().finalDateTime;
    const email = auth.currentUser?.email || "";
    const createdAt = new Date();

    console.log("🧪 Salvando backup no Firestore. Tasks atuais:", tasks);

    // Salva todos os dados como backup (substitui tasks de verdade)
    await setDoc(doc(db, "users", userId), {
      uid: userId,
      userId,
      email,
      createdAt,
      tasks: [...(tasks || [])],
      repetition: repetition || {},
      notification1: notification1 || {},
      notification2: notification2 || {},
      finalDateTime: finalDateTime || null,
    });

    console.log("✅ Backup salvo no Firestore com sucesso.");
  } catch (err) {
    console.error("❌ Erro dentro de salvarTudo:", err);
    throw err;
  }
}
