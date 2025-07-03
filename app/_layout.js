import { Stack, Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { auth } from "../firebase/firebaseConfig";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { onAuthStateChanged } from "firebase/auth";

export default function RootLayout() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user ?? null);
      setCarregando(false);
      console.log(user);
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      {usuario ? <Redirect href="" /> : <Redirect href="/auth/login" />}
    </GestureHandlerRootView>
  );
}
