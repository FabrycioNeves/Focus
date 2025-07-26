import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useTaskStore } from "../../GlobalStates/TaskStore";

import { useRepetitionStore } from "../../GlobalStates/RepetionsStore";
import { useNotificationStore } from "../../GlobalStates/NotificationsStore";
import { useDateStore } from "../../GlobalStates/DateStore";

export async function loadUserDataFromFirestore(userId) {
  try {
    const docSnap = await getDoc(doc(db, "users", userId));
    if (!docSnap.exists()) {
      console.log("Nenhum dado encontrado no Firestore para este usuário.");
      return;
    }

    const data = docSnap.data();

    // Atualiza o Zustand com os dados do Firestore
    if (data.tasks && data.tasks.length > 0) {
      useTaskStore.setState({ tasks: data.tasks });
    } else {
      console.log("Nenhuma tarefa salva no Firestore para carregar");
      // opcional: não atualizar o estado para não apagar dados locais
    }

    useRepetitionStore.setState({ repetition: data.repetition || {} });
    useNotificationStore.setState({
      notification1: data.notification1 || {},
      notification2: data.notification2 || {},
    });
    useDateStore.setState({ finalDateTime: data.finalDateTime || null });

    console.log("✅ Zustand atualizado com dados do Firestore.");
  } catch (error) {
    console.error("❌ Erro ao carregar dados do Firestore:", error);
  }
}
