import { React } from "react";
import { NavLink } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logoutIcon from "../icons/logoutIcon.png";
import transAppLogoTransparent from "../images/transAppLogoTransparent.png"
import "./Navbar.css";
export const Navbar = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        await signOut(auth);
        sessionStorage.removeItem("Auth Token");
        sessionStorage.removeItem("uid");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("displayName");
        navigate("/");
    };
    return (
        <nav className="primary--nav">
            <NavLink className="links" to="/dashboard">
                Dashboard
            </NavLink>
            <NavLink className="links" to="/transactions">
                Transactions
            </NavLink>
            <NavLink className="links" to="/settings">
                Settings
            </NavLink>
            <img src={transAppLogoTransparent}
            className="nav-logo"/>
            <div className="links logout" onClick={handleLogout}>
                <img
                    src={logoutIcon}
                    alt="logout icon"
                    className="logout-icon"
                />
                Log out
            </div>
        </nav>
    );
};
