import { useTaskStore } from "../../GlobalStates/TaskStore";

import { useRepetitionStore } from "../../GlobalStates/RepetionsStore";
import { useNotificationStore } from "../../GlobalStates/NotificationsStore";
import { useDateStore } from "../../GlobalStates/DateStore";
import { auth } from "../firebaseConfig";
import { saveUserDataToFirestore } from "./firestoreSync";

// ... outros imports
export async function salvarTudo(userId) {
  try {
    const tasks = useTaskStore.getState().tasks;
    const repetition = useRepetitionStore.getState().repetition;
    const notification1 = useNotificationStore.getState().notification1;
    const notification2 = useNotificationStore.getState().notification2;
    const finalDateTime = useDateStore.getState().finalDateTime;
    const email = auth.currentUser?.email || "";
    const createdAt = new Date();
    console.log("🧪 Tasks que serão salvas:", tasks);

    await saveUserDataToFirestore(userId, {
      tasks,
      repetition,
      notification1,
      notification2,
      finalDateTime,
      email,
      createdAt,
    });

    console.log("✅ salvarTudo executado com sucesso.");
  } catch (err) {
    console.error("❌ Erro dentro de salvarTudo:", err);
    throw err; // repassa o erro para o try/catch externo
  }
}
