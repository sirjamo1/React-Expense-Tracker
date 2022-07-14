import { React, useState } from "react";
import "./Signup.css";
import { useNavigate, useLocation } from "react-router-dom";
import dollarInBirdCage from "../images/dollarInBirdCage.png";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";
import { Link } from "react-router-dom";
import { auth } from "../../firebase-config";
export function Signup() {
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    //const redirectPath = location.state?.path || "/";
    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });
    const handleRegister = async () => {
        try {
            const user = await createUserWithEmailAndPassword(
                auth,
                registerEmail,
                registerPassword
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
            <div className="signup--container">
                <h1>Sign up</h1>
                <label>
                    Email<span className="asterisk">*</span>
                    <span className="instructions">
                        (Must be a valid e-mail address)
                    </span>
                </label>
                <input
                    onChange={(event) => {
                        setRegisterEmail(event.target.value);
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
                        setRegisterPassword(event.target.value);
                    }}
                    type="password"
                    placeholder="password"
                    pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                    required
                ></input>

                <button
                    onClick={handleRegister}
                    className="signup--submit"
                    type="submit"
                >
                    Sign Up
                </button>
                <h4>
                    <Link to="/"> Back to sign in page</Link>
                </h4>
            </div>
            <img src={dollarInBirdCage} alt="dollar bill in a bird cage" />
        </div>
    );
}
