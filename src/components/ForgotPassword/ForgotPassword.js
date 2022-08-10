import "./ForgotPassword.css";
import React, { useRef, useState } from "react";
import dollarInBirdCage from "../images/dollarInBirdCage.png";
import { Link } from "react-router-dom";
import { useAuth } from "../../Auth";

export const ForgotPassword = () => {
  const emailRef = useRef();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { resetPassword } = useAuth();

  async function handleReset(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      await resetPassword(emailRef.current.value);
      setMessage("Check your inbox for further instructions");
    } catch {
      setError("Failed to reset");
    }
  }

  return (
    <div className="main--container">
      <div className="signin--container">
        <h1>Password Reset</h1>
        {error && <h3>{error}</h3>}
        {message && <h3>{message}</h3>}
        <label>
          Email<span className="asterisk"> *</span>
          <span className="instructions"></span>
        </label>
        <input
          ref={emailRef}
          id="email"
          type="email"
          required
        ></input>
        <button onClick={handleReset} className="reset-btn" type="submit">
          Reset
        </button>

        <div className="w-100 text-center mt-3">
          <Link to="/">Back to Signin</Link>
        </div>

        <h4>
          Don't have an account? <Link to="/signup"> Create One</Link>
        </h4>
      </div>
      <img src={dollarInBirdCage} alt="dollar bill in a bird cage" />
    </div>
  );
};
