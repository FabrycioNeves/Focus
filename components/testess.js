import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export async function testeFirestore(userId) {
  try {
    await setDoc(doc(db, "users", userId), {
      test: "funcionando",
      timestamp: new Date(),
    });
    console.log("✅ Teste: Dados enviados com sucesso!");
  } catch (error) {
    console.error("❌ Teste: Erro ao enviar dados:", error);
  }
}
