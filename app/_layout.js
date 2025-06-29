import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { auth, onAuthStateChanged } from "../firebase/firebaseConfig"; // ajuste conforme modular
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {usuario ? (
        <Stack
          screenOptions={{ headerShown: false }}
          initialRouteName="index"
        />
      ) : (
        <Stack
          screenOptions={{ headerShown: false }}
          initialRouteName="auth/login"
        />
      )}
    </GestureHandlerRootView>
  );
}
