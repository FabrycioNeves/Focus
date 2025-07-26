import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
export async function saveUserDataToFirestore(userId, stateStores) {
  const data = {
    uid: userId,
    userId,
    email: stateStores.email || "",
    createdAt: stateStores.createdAt || new Date(),

    tasks: stateStores.tasks || [],

    repetition: stateStores.repetition || {},
    notification1: stateStores.notification1 || {},
    notification2: stateStores.notification2 || {},
    finalDateTime: stateStores.finalDateTime || null,
  };

  try {
    await setDoc(doc(db, "users", userId), data, { merge: true }); // <-- aqui
    console.log("✅ Dados do usuário salvos no Firestore (com merge).");
  } catch (error) {
    console.error("❌ Erro ao salvar dados no Firestore:", error);
  }
}
