import { initializeApp } from "firebase/app";

const apiKey = import.meta.env.VITE_apiKey
const authDomain = import.meta.env.VITE_authDomain
const projectId = import.meta.env.VITE_projectId
const storageBucket = import.meta.env.VITE_storageBucket
const messagingSenderId = import.meta.env.VITE_messagingSenderId
const appId = import.meta.env.VITE_appId
const measurementId = import.meta.env.VITE_measurementId

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId
};

// Initialize Firebase
const firebaseAppConfig = initializeApp(firebaseConfig);
export default firebaseAppConfig
