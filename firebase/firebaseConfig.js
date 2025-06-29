// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8hPOQVnJFCbr6jsSBcEr0YEYSQpCNQJQ",
  authDomain: "focu-ae41b.firebaseapp.com",
  projectId: "focu-ae41b",
  storageBucket: "focu-ae41b.appsot.com",
  messagingSenderId: "241933107860",
  appId: "1:241933107860:web:69f6cc64549f05365aea81",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };
