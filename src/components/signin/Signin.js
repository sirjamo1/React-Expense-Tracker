import React, { useEffect, useState } from "react";
import "./Signin.css";
import dollarInBirdCage from "../images/dollarInBirdCage.png";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../../firebase-config";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import GoogleButton from "react-google-button";
import transAppLogoTransparent from "../images/transAppLogoTransparent.png";
import { useAuth, user } from "../../Auth";

export const Signin = () => {
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [user, setUser] = useState({});
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { googleSignIn } = useAuth();

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
            sessionStorage.setItem("Auth Token", auth.currentUser.accessToken);
            sessionStorage.setItem("uid", auth.currentUser.uid);
            sessionStorage.setItem("email", auth.currentUser.email);
            navigate("/dashboard");
        } catch (error) {
            console.log(error.message);
            alert(error.message)
        }
    };

    const handleGoogleSignIn = async (e) => {
        e.preventDefault();
        try {
            await googleSignIn();
            sessionStorage.setItem("Auth Token", auth.currentUser.accessToken);
            sessionStorage.setItem("uid", auth.currentUser.uid);
            sessionStorage.setItem("email", auth.currentUser.email);
            navigate("/dashboard");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="signin-main--container">
            <div className="signin--container">
                <h1>Sign in</h1>
                <form className="signin-form">
                    <label>Email</label>
                    <input
                        onChange={(event) => {
                            setLoginEmail(event.target.value);
                        }}
                        type="email"
                        placeholder="Email"
                        required
                    ></input>
                    <label>Password</label>
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
                        onClick={(e) => {
                            e.preventDefault();
                            handleSignin();
                        }}
                        className="signin-submit-btn"
                        type="submit"
                    >
                        Sign in
                    </button>
                </form>
                <div className="google-links">
                    <GoogleButton
                        className="google-btn"
                        type="dark"
                        onClick={handleGoogleSignIn}
                    />
                    <div>
                        <Link to="/forgotPassword">Forgot Password?</Link>
                    </div>
                    <h4>
                        Don't have an account?{" "}
                        <Link to="/signup"> Create one</Link>
                    </h4>
                </div>

                <img
                    src={transAppLogoTransparent}
                    alt="trans app logo"
                    className="signin-logo"
                />
            </div>
            <img
                className="bird-cage-img"
                src={dollarInBirdCage}
                alt="dollar bill in a bird cage"
            />
        </div>
    );
};
