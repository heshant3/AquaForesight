// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAaBGe8b1lzwDcQ7IkxcKvJ6VSA3V5T9es",
  authDomain: "aquaforesight-da63c.firebaseapp.com",
  databaseURL: "https://aquaforesight-da63c-default-rtdb.firebaseio.com",
  projectId: "aquaforesight-da63c",
  storageBucket: "aquaforesight-da63c.appspot.com",
  messagingSenderId: "606881674106",
  appId: "1:606881674106:web:1125b2533bce0b0e691cc3",
  measurementId: "G-ZJMMR4Z287",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
