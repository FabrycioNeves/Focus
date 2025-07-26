// app/logout.jsx

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";

export default function LogoutScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("✅ Usuário deslogado com sucesso.");
      router.push("auth/login");
    } catch (error) {
      console.error("❌ Erro ao fazer logout:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem vindo!</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#4B4DED",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
