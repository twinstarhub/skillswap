import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyC_aluQrw5ku8qP7ebG5MQhP2Ng2CLKdv0",
  authDomain: "skillswap-c4225.firebaseapp.com",
  databaseURL: "https://skillswap-c4225-default-rtdb.firebaseio.com",
  projectId: "skillswap-c4225",
  storageBucket: "skillswap-c4225.appspot.com",
  messagingSenderId: "785660429705",
  appId: "1:785660429705:web:22f4c1594d228751068d58",
  measurementId: "G-00SJY9S4B9",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
export { db, auth, storage };
