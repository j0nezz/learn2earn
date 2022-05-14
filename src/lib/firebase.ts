import {initializeApp} from '@firebase/app';
import {indexedDBLocalPersistence, initializeAuth} from '@firebase/auth';
import {getFirestore} from '@firebase/firestore';
import {getFunctions} from '@firebase/functions';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

initializeAuth(app, {
  persistence: indexedDBLocalPersistence
});

export const db = getFirestore();

export const functions = getFunctions(app);

/*
const EMULATORS_STARTED = 'EMULATORS_STARTED';
function startEmulators() {
  // @ts-ignore
  if (!global[EMULATORS_STARTED]) {
    // @ts-ignore
    global[EMULATORS_STARTED] = true;
    connectFunctionsEmulator(functions, 'localhost', 5001);
    //  connectFirestoreEmulator(db, 'localhost', 8080);
  }
}

if (process.env.NODE_ENV === 'development') {
  startEmulators();
}
*/
