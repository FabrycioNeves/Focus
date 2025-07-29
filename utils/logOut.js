import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export async function doLogout(router) {
  try {
    await signOut(auth);
    console.log("✅ Usuário deslogado com sucesso.");
    router.push("auth/login");
  } catch (error) {
    console.error("❌ Erro ao fazer logout:", error);
  }
}
