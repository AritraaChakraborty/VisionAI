import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDv7nQ-36Ctvy4Mf3Xu3b-eNUNMCIk4vhE",
  authDomain: "visionpro-5f0f5.firebaseapp.com",
  projectId: "visionpro-5f0f5",
  storageBucket: "visionpro-5f0f5.firebasestorage.app",
  messagingSenderId: "988795186025",
  appId: "1:988795186025:web:398f8ff425f1f77e686bf8",
  measurementId: "G-PE37LWX3G0",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Analytics is browser-only; lazy-load to avoid SSR crashes.
export const initAnalytics = async () => {
  if (typeof window === "undefined") return null;
  const { getAnalytics, isSupported } = await import("firebase/analytics");
  if (await isSupported()) return getAnalytics(app);
  return null;
};

export const auth = getAuth(app);
export default app;
