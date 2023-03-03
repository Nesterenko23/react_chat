import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDBXwL35vBBXcwXPMz1gviLA_CLiXvb9Sw",
  authDomain: "react-chat-application-6a577.firebaseapp.com",
  projectId: "react-chat-application-6a577",
  storageBucket: "react-chat-application-6a577.appspot.com",
  messagingSenderId: "30940941815",
  appId: "1:30940941815:web:2b80f51dad8d4dd94eb2f2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();