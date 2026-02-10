import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let isInitialized = false;

// Only initialize if credentials are provided
if (process.env.FIREBASE_PROJECT_ID && 
    process.env.FIREBASE_PRIVATE_KEY && 
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY.includes('BEGIN PRIVATE KEY')) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
      })
    });
    isInitialized = true;
    console.log('✅ Firebase Admin initialized');
  } catch (error: any) {
    console.error('⚠️ Firebase Admin initialization failed:', error.message);
    console.log('Server will run without Firebase Admin features');
  }
} else {
  console.log('⚠️ Firebase Admin credentials not configured');
  console.log('Server running in limited mode - please add Firebase Admin credentials');
  console.log('Get credentials from: https://console.firebase.google.com/project/studiowl-3b22d/settings/serviceaccounts/adminsdk');
}

export const db = isInitialized ? admin.firestore() : null as any;
export const auth = isInitialized ? admin.auth() : null as any;

export default admin;
