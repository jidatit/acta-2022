import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
const firebaseConfig = {
  apiKey: "AIzaSyAQvUL8qH8YtAqV8X0Na-gyr7g-_tltSWM",
  authDomain: "acta-2022.firebaseapp.com",
  projectId: "acta-2022",
  storageBucket: "acta-2022.appspot.com",
  messagingSenderId: "882597338979",
  appId: "1:882597338979:web:ebb8ec654270877303bd56",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);
