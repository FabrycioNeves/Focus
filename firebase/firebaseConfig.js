import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB8hPOQVnJFCbr6jsSBcEr0YEYSQpCNQJQ",
  authDomain: "focu-ae41b.firebaseapp.com",
  projectId: "focu-ae41b",
  storageBucket: "focu-ae41b.appspot.com", // corrigido 'appsot.com' para 'appspot.com'
  messagingSenderId: "241933107860",
  appId: "1:241933107860:web:69f6cc64549f05365aea81",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };
