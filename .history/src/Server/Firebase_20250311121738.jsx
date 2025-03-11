// Server/Firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push, serverTimestamp, update, get, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDhLuMymmJPkmMQKvYX8Ma94VAG-uf1kOk",
  authDomain: "test-463d2.firebaseapp.com",
  projectId: "test-463d2",
  storageBucket: "test-463d2.firebasestorage.app",
  messagingSenderId: "793933331185",
  appId: "1:793933331185:web:304e16633345f88fc7c750"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue, push, serverTimestamp, update, get, remove };