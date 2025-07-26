import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { registerForPushNotificationsAsync } from "../ExpoNotifications/ConfigNotifications";
import { useEffect } from "react";
import { loadUserDataFromFirestore } from "../firebase/firestore/restoreAndRescheduleAll";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { salvarTudo } from "../firebase/firestore/saveAllZustandData";

export default function RootLayout() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.uid) {
        (async () => {
          try {
            await loadUserDataFromFirestore(user.uid);

            console.log("✅ Dados carregados no RootLayout.");
          } catch (err) {
            console.error("❌ Erro no RootLayout:", err.message || err);
          }
        })();
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}
