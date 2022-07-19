import React, { useEffect, useState } from "react";
import "./Signin.css";
import dollarInBirdCage from "../images/dollarInBirdCage.png";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../../firebase-config";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    deleteDoc,
    onSnapshot,
    query,
    setDoc,
    where,
    orderBy,
    // serverTimestamp
} from "firebase/firestore";
import { db } from "../../firebase-config";
export const Signin = () => {
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
    }, []);
    
    const handleSignin = async () => {
        try {
            const user = await signInWithEmailAndPassword(
                auth,
                loginEmail,
                loginPassword
            );
                sessionStorage.setItem(
                    "Auth Token",
                    auth.currentUser.accessToken
                );
                sessionStorage.setItem("uid", auth.currentUser.uid);
                sessionStorage.setItem("email", auth.currentUser.email);
                const allUsers = []
                const userUid = auth.currentUser.uid
                const q = query(collection(db, "users"))
                const querSnapshot = await getDocs(q);
                querSnapshot.forEach((doc) => {
                 allUsers.push(doc.id, doc.data())
                }) 
                for (let i = 0; i < allUsers.length; i++) {
                    if (allUsers[i].uid === userUid) {
                        sessionStorage.setItem("firstName", allUsers[i].firstName);
                        sessionStorage.setItem(
                            "lastName",
                            allUsers[i].lastName
                        );
                
                }}
            navigate("/dashboard");
           
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="main--container">
            <div className="signin--container">
                <h1>Sign in</h1>
                <label>
                    Email<span className="asterisk">*</span>
                    <span className="instructions">
                        (Must be a valid e-mail address)
                    </span>
                </label>
                <input
                    onChange={(event) => {
                        setLoginEmail(event.target.value);
                    }}
                    type="email"
                    placeholder="Email"
                    required
                ></input>
                <label>
                    Password<span className="asterisk">*</span>
                    <span className="instructions">
                        (Minimum eight characters, at least one letter and one
                        number)
                    </span>
                </label>
                <input
                    onChange={(event) => {
                        setLoginPassword(event.target.value);
                    }}
                    type="password"
                    placeholder="password"
                    pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                    required
                ></input>
                <button
                    onClick={handleSignin}
                    className="submit-btn"
                    type="submit"
                >
                    Sign in
                </button>

                <h4>
                    Don't have an account?<Link to="/signup"> Create one</Link>
                </h4>
            </div>
            <img src={dollarInBirdCage} alt="dollar bill in a bird cage" />
        </div>
    );
};
