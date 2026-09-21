import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, remove, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCAVKjEobZDwWhxGSpg9GH0ONuuvz6N-a4",
  authDomain: "auramist-fragrances.firebaseapp.com",
  databaseURL: "https://auramist-fragrances-default-rtdb.firebaseio.com",
  projectId: "auramist-fragrances",
  storageBucket: "auramist-fragrances.firebasestorage.app",
  messagingSenderId: "992170825502",
  appId: "1:992170825502:web:0b708783b12eb43f781b0f"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

export { ref, set, onValue, remove, update };
