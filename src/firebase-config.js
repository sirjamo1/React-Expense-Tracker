import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth, updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useAuth } from "../src/Auth"
//************ NOTE:*********************
//need to put in your own firebase below*/
const firebaseConfig = {
    apiKey: "AIzaSyDR90b1grij9mZjZkX_W1eEzk70pX-T1Ww",
    authDomain: "react-expense-tracker-1a3d7.firebaseapp.com",
    projectId: "react-expense-tracker-1a3d7",
    storageBucket: "react-expense-tracker-1a3d7.appspot.com",
    messagingSenderId: "307878146582",
    appId: "1:307878146582:web:c88dcc8ed679d196577b37",
    measurementId: "G-RZZS4N2DLM",
};

//************ NOTE:*********************
//need to put in your own firebase above*/
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
const storage = getStorage();

//James Firebase below
// const firebaseConfig = {
    // apiKey: "AIzaSyDR90b1grij9mZjZkX_W1eEzk70pX-T1Ww",
    // authDomain: "react-expense-tracker-1a3d7.firebaseapp.com",
    // projectId: "react-expense-tracker-1a3d7",
    // storageBucket: "react-expense-tracker-1a3d7.appspot.com",
    // messagingSenderId: "307878146582",
    // appId: "1:307878146582:web:c88dcc8ed679d196577b37",
    // measurementId: "G-RZZS4N2DLM",
// };
//STORAGE

export async function upload(file, user, setLoading) {
    const fileRef = ref(storage, `${user.uid}.png`);
    console.log({user})
    setLoading(true);

    const snapshot = await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);

    updateProfile(user, { photoURL });

    setLoading(false);
    alert("Uploaded file!");
}