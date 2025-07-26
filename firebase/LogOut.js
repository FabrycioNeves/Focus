// utils/logoutUser.js
import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { router } from "expo-router";

export async function logoutUser() {
  try {
    await signOut(auth);
    console.log("✅ Usuário deslogado com sucesso.");
    router.push("auth/login");
  } catch (error) {
    console.error("❌ Erro ao fazer logout:", error);
  }
}
