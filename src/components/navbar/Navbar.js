import { React, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export const Navbar = () => {
    const [user, setUser] = useState(null);
    const auth = getAuth();
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setUser(user);
            
        });
    }, [user]);
    const navigate = useNavigate();
    const handleLogout = () => {
        signOut(auth);
        navigate("/");
        sessionStorage.removeItem("Auth Token");
        sessionStorage.removeItem("uid");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("firstName");
        sessionStorage.removeItem("lastName");
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
