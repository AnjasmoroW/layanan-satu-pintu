// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB7AQoYgJ04cbpjnqLpromLheU-KSkJbe8",
  authDomain: "lsp-balaibahasamalut.firebaseapp.com",
  projectId: "lsp-balaibahasamalut",
  storageBucket: "lsp-balaibahasamalut.appspot.com", // <– diperbaiki sedikit
  messagingSenderId: "1077263577527",
  appId: "1:1077263577527:web:4a38d894e779f3927b7832",
  measurementId: "G-M507EJX6E2"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { db, storage };
