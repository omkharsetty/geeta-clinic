import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Same Firebase project as the Geeta Endocrine Care mobile app —
// web and app share the same accounts and patient data.
const firebaseConfig = {
  projectId: 'gen-lang-client-0377383828',
  appId: '1:32396184937:web:0d311d22d83e65551fc1f8',
  apiKey: 'AIzaSyBDlbIqkOPqkpdfvbMNdUb_mtBwRd0EhFs',
  authDomain: 'gen-lang-client-0377383828.firebaseapp.com',
  storageBucket: 'gen-lang-client-0377383828.firebasestorage.app',
  messagingSenderId: '32396184937',
};

// The app uses a named Firestore database, not the default one.
const FIRESTORE_DATABASE_ID = 'ai-studio-a9f03f5b-7e78-4695-ba4d-fa65058d4f71';

const app = getApps()[0] ?? initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, FIRESTORE_DATABASE_ID);
