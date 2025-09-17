// Firebase initialization for Baby Souk
// Exports: db (Realtime Database), storage (Firebase Storage), auth (Firebase Auth)

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported as analyticsIsSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGbNUaTZG8evHkYpEO5ehl9ni4QOlEtiM",
  authDomain: "babysouk-583f9.firebaseapp.com",
  databaseURL: "https://babysouk-583f9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "babysouk-583f9",
  storageBucket: "babysouk-583f9.firebasestorage.app",
  messagingSenderId: "1080501163895",
  appId: "1:1080501163895:web:799df2025ee46ba2f03372",
  measurementId: "G-7B57MYZD8E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const db = getDatabase(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Initialize Analytics in supported environments (browser only) and only in production
try {
  if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
    analyticsIsSupported().then((supported) => {
      if (supported) {
        getAnalytics(app);
      }
    });
  }
} catch (_) {
  // no-op: analytics is optional
}

export default app;
