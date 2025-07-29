import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { registerForPushNotificationsAsync } from "../ExpoNotifications/ConfigNotifications";
import { useEffect } from "react";
import { loadUserDataFromFirestore } from "../firebase/firestore/restoreAndRescheduleAll";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function RootLayout() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}
