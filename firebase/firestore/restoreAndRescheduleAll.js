import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useTaskStore } from "../../GlobalStates/TaskStore";
import { useRepetitionStore } from "../../GlobalStates/RepetionsStore";
import { useNotificationStore } from "../../GlobalStates/NotificationsStore";
import { useDateStore } from "../../GlobalStates/DateStore";
import { scheduleNotification } from "../../ExpoNotifications/ConfigNotifications";
export async function loadUserDataFromFirestore(userId) {
  try {
    const docSnap = await getDoc(doc(db, "users", userId));
    if (!docSnap.exists()) {
      console.log("Nenhum dado encontrado no Firestore para este usuário.");
      return;
    }

    const data = docSnap.data();

    const localTasks = useTaskStore.getState().tasks;

    if (
      (!localTasks || localTasks.length === 0) &&
      data.tasks &&
      data.tasks.length > 0
    ) {
      console.log("🔄 Carregando tarefas do Firestore (Zustand estava vazio)");

      const normalizedTasks = data.tasks.map((task) => {
        if (task.finalDateTime?.seconds) {
          task.finalDateTime = new Date(task.finalDateTime.seconds * 1000);
        } else if (typeof task.finalDateTime === "string") {
          task.finalDateTime = new Date(task.finalDateTime);
        }
        return task;
      });

      useTaskStore.setState({ tasks: normalizedTasks });

      // Agenda notificações para as tasks importadas
      for (const task of normalizedTasks) {
        if (!task.completed) {
          useDateStore.setState({ finalDateTime: task.finalDateTime });
          await scheduleNotification(task);
        }
      }
    } else {
      console.log(
        "✅ Mantendo tarefas locais (não sobrescrevendo com Firestore)"
      );
    }

    // Atualiza outros estados globais que não dependem de tasks
    useRepetitionStore.setState({ repetition: data.repetition || {} });
    useNotificationStore.setState({
      notification1: data.notification1 || "",
      notification2: data.notification2 || "",
    });
    useDateStore.setState({
      finalDateTime: data.finalDateTime
        ? new Date(data.finalDateTime.seconds * 1000)
        : null,
    });

    console.log("✅ Zustand sincronizado e notificações agendadas.");
  } catch (error) {
    console.error("❌ Erro ao carregar dados do Firestore:", error);
  }
}
