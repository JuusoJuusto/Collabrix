import { initializeApp, getApps } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { initializeFirestore, CACHE_SIZE_UNLIMITED, enableIndexedDbPersistence } from 'firebase/firestore';
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

// Initialize Firestore with unlimited cache for faster loading
export const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
});

// Enable offline persistence for instant loading
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab.');
  } else if (err.code === 'unimplemented') {
    console.warn('Browser does not support offline persistence');
  }
});

export const storage = getStorage(app);

export default app;
