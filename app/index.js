import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import Taskmanager from "./TaskManager";
import { loadUserDataFromFirestore } from "../firebase/firestore/restoreAndRescheduleAll";

export default function Index() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  useEffect(() => {
    if (auth.currentUser) {
      loadUserDataFromFirestore(auth.currentUser.uid);
      console.log("foi");
    }
  }, []);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user ?? null);
      setCarregando(false);
    });

    return unsubscribe;
  }, []);

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!usuario || !usuario.emailVerified) {
    return <Redirect href="/auth/login" />;
  }

  return <Taskmanager />;
}
