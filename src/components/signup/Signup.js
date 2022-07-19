import { React, useState } from "react";
import "./Signup.css";
import { useNavigate, useLocation } from "react-router-dom";
import dollarInBirdCage from "../images/dollarInBirdCage.png";
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
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";
import { db } from "../../firebase-config";
import { Link } from "react-router-dom";
import { auth } from "../../firebase-config";
export function Signup() {
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerFirstName, setRegisterFirstName] = useState("");
    const [registerLastName, setRegisterLastName] = useState("");
    const [registerDOB, setRegisterDOB] = useState("")
    const [registerMobile, setRegisterMobile] = useState(0);
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const usersRef = collection(db, "users");
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
            await addDoc(usersRef, {
                email: auth.currentUser.email,
                uid: auth.currentUser.uid,
                firstName: registerFirstName,
                lastName: registerLastName,
                DOB: registerDOB,
                mobile: registerMobile,
            });
            sessionStorage.setItem("Auth Token", auth.currentUser.accessToken);
            sessionStorage.setItem("uid", auth.currentUser.uid);
            sessionStorage.setItem("email", auth.currentUser.email);
            sessionStorage.setItem("firstName", registerFirstName);
            sessionStorage.setItem("lastName", registerLastName);
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
                    First Name<span className="asterisk">*</span>
                    <span className="instructions"></span>
                </label>
                <input
                    onChange={(event) => {
                        setRegisterFirstName(event.target.value);
                    }}
                    type="text"
                    placeholder="First name"
                    required
                ></input>
                <label>
                    Last Name<span className="asterisk">*</span>
                    <span className="instructions"></span>
                </label>
                <input
                    onChange={(event) => {
                        setRegisterLastName(event.target.value);
                    }}
                    type="text"
                    placeholder="Last name"
                    required
                ></input>
                <label>
                    Mobile<span className="asterisk">*</span>
                    <span className="instructions"></span>
                </label>
                <input
                    onChange={(event) => {
                        setRegisterMobile(event.target.value);
                    }}
                    type="text"
                    placeholder="Mobile"
                    required
                ></input>
                <label>
                    Date of Birth<span className="asterisk">*</span>
                    <span className="instructions"></span>
                </label>
                <input
                    onChange={(event) => {
                        setRegisterDOB(event.target.value);
                    }}
                    className="popup-date"
                    type="date"
                    placeholder="Title"
                ></input>
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
