import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase.config";

const firebaseAuthenntication = () => {
    initializeApp(firebaseConfig);
}

export default firebaseAuthenntication;