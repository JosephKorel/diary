import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBKgRU-JfqvAJgq8qwmQYvNJgitu6mmsmY",
  authDomain: "self-tracker-57397.firebaseapp.com",
  projectId: "self-tracker-57397",
  storageBucket: "self-tracker-57397.appspot.com",
  messagingSenderId: "579583812944",
  appId: "1:579583812944:web:6325a08a1bc923c52f7855",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
