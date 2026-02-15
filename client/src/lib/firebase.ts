import { initializeApp, getApps } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDb4aSjXkg0YtrSAGASmfqPvwThyR0X_G8',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'studiowl-3b22d.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'studiowl-3b22d',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'studiowl-3b22d.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '140077048339',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:140077048339:web:ce620a654c7130df3f55e6'
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
export const auth = getAuth(app);

// Configure auth persistence for better compatibility
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.warn('Failed to set persistence:', error);
});

export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
