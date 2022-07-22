import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";
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

//James Firebase below
// const firebaseConfig = {
//     apiKey: "AIzaSyDR90b1grij9mZjZkX_W1eEzk70pX-T1Ww",
//     authDomain: "react-expense-tracker-1a3d7.firebaseapp.com",
//     projectId: "react-expense-tracker-1a3d7",
//     storageBucket: "react-expense-tracker-1a3d7.appspot.com",
//     messagingSenderId: "307878146582",
//     appId: "1:307878146582:web:c88dcc8ed679d196577b37",
//     measurementId: "G-RZZS4N2DLM",
// };
