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
import GoogleButton from "react-google-button";
import { useAuth } from "../../Auth";

export function Signup() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const usersRef = collection(db, "users");
  const { googleSignIn } = useAuth();

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
      });
      sessionStorage.setItem("Auth Token", auth.currentUser.accessToken);
      sessionStorage.setItem("uid", auth.currentUser.uid);
      sessionStorage.setItem("email", auth.currentUser.email);
      navigate("/dashboard");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate("/dashboard");
    } catch (erorr) {
      setError(error.message);
    }
  };

  return (
    <div className="main--container">
      <div className="signup--container">
        <h1>Sign up</h1>
        <label>
          Email<span className="asterisk">*</span>
          <span className="instructions">(Must be a valid e-mail address)</span>
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
            (Minimum eight characters, at least one letter and one number)
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
        <GoogleButton
          className="google-btn"
          type="dark"
          label="Sign Up with Google"
          onClick={handleGoogleSignIn}
        />
        <h4>
          <Link to="/"> Back to sign in page</Link>
        </h4>
      </div>
      <img src={dollarInBirdCage} alt="dollar bill in a bird cage" />
    </div>
  );
}
