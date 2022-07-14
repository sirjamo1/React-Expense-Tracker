import React, { useEffect, useState } from "react";
import "./Signin.css";
import dollarInBirdCage from "../images/dollarInBirdCage.png";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../../firebase-config";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
export const Signin = () => {
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    useEffect (() => {
    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });
}, [])
    const handleSignin = async () => {
        try {
            const user = await signInWithEmailAndPassword(
                auth,
                loginEmail,
                loginPassword
            );
            sessionStorage.setItem("Auth Token", auth.currentUser.accessToken);
            sessionStorage.setItem("uid", auth.currentUser.uid);
            sessionStorage.setItem("email", auth.currentUser.email);
            navigate("/dashboard");
        } catch (error) {
            console.log(error.message);
        }
    };
    return (
        <div className="main--container">
            <div className="signin--container">
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
