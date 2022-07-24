import { React, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../../Auth";

export const Navbar = () => {
    const { user } = useAuth();
    // const [user, setUser] = useState(null);
    const auth = getAuth();
    // useEffect(() => {
    //     onAuthStateChanged(auth, (user) => {
    //         setUser(user);
    //     });
    // }, [user, auth]);
    const navigate = useNavigate();
    const handleLogout = () => {
        signOut(auth);
        sessionStorage.removeItem("Auth Token");
        sessionStorage.removeItem("uid");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("displayName");
        navigate("/");
    };
    console.log(user);
    //Note: If user is not logged in navbar is empty
    return user ? (
        <nav className="primary--nav">
            <NavLink className="links" to="/dashboard">
                Dashboard
            </NavLink>
            <NavLink className="links" to="/expenses">
                Expenses
            </NavLink>
            <NavLink className="links" to="/settings">
                Settings
            </NavLink>
            <NavLink className="links" to="/">
                <div onClick={handleLogout}>Log out</div>
            </NavLink>
        </nav>
    ) : (
        <nav></nav>
    );
};
