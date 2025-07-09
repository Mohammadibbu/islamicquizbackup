// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlQkja7rqbSfM3ywOCsm_nW6iYb4rmCjo",
  authDomain: "kealvi-badhil.firebaseapp.com",
  databaseURL: "https://kealvi-badhil-default-rtdb.firebaseio.com",
  projectId: "kealvi-badhil",
  storageBucket: "kealvi-badhil.firebasestorage.app",
  messagingSenderId: "838791733071",
  appId: "1:838791733071:web:d3e91194e14c6385cd2f3a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
