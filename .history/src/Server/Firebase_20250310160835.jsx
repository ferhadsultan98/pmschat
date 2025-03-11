// Server/Firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push, serverTimestamp } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhLuMymmJPkmMQKvYX8Ma94VAG-uf1kOk",
  authDomain: "test-463d2.firebaseapp.com",
  projectId: "test-463d2",
  storageBucket: "test-463d2.firebasestorage.app",
  messagingSenderId: "793933331185",
  appId: "1:793933331185:web:304e16633345f88fc7c750"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

// Export the necessary Firebase utilities
export { database, ref, onValue, push, serverTimestamp };