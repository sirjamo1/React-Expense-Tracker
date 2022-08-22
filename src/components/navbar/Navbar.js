import { React, useState } from "react";
import { NavLink } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logoutIcon from "../icons/logoutIcon.png";
import transAppLogoTransparent from "../images/transAppLogoTransparent.png"
import transAppLogoTransparentNoText from "../images/transAppLogoTransparentNoText.png";
import "./Navbar.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
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
const [rotateIcon, setRotateIcon]= useState(false)
const [hideNav, setHideNav] = useState(true)
const mobile = useMediaQuery({ query: `(max-width: 400px)` });

console.log({mobile})
console.log({rotateIcon})
console.log({hideNav})

    // const mobileNav = (
        // <Popup
        //     closeOnDocumentClick
        //     show={true}
        //     className="popup-main"
        //     // onOpen={(event) => {
        //     //     setRotateIcon(true);
        //     // }}
        //     // onClose={setRotateIcon(false)}
        //     trigger={
        //         <img
        //             src={transAppLogoTransparentNoText}
        //             alt="trans app icon"
        //             className={rotateIcon ? "mobile-nav-btn rotated" : "mobile-nav-btn"}
                  
        //         />
        //     }
        //     position="bottom left"
        // >
        //     {(close) => (
                // <nav className="mobile-primary--nav">
                //         <NavLink className="links" to="/dashboard">
                //             Dashboard
                //         </NavLink>
                //     <NavLink className="links" to="/transactions">
                //         Transactions
                //     </NavLink>
                //     <NavLink className="links" to="/settings">
                //         Settings
                //     </NavLink>
                //     <div className="links logout" onClick={handleLogout}>
                //         <img
                //             src={logoutIcon}
                //             alt="logout icon"
                //             className="logout-icon"
                //         />
                //         Log out
                //     </div>
                // </nav>
        //     )}
        // </Popup>
    // );
    const navbar = (
        <nav className="mobile-primary--nav">
            <NavLink
                className="links"
                to="/dashboard"
                onClick={() => {
                    setRotateIcon(!rotateIcon);
                    setHideNav(!hideNav);
                }}
            >
                Dashboard
            </NavLink>
            <NavLink
                className="links"
                to="/transactions"
                onClick={() => {
                    setRotateIcon(!rotateIcon);
                    setHideNav(!hideNav);
                }}
            >
                Transactions
            </NavLink>
            <NavLink
                className="links"
                to="/settings"
                onClick={() => {
                    setRotateIcon(!rotateIcon);
                    setHideNav(!hideNav);
                }}
            >
                Settings
            </NavLink>
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
    return !mobile ? (
        <nav
            className="primary--nav"
        >
            <NavLink className="links" to="/dashboard">
                Dashboard
            </NavLink>
            <NavLink className="links" to="/transactions">
                Transactions
            </NavLink>
            <NavLink className="links" to="/settings">
                Settings
            </NavLink>
            <img src={transAppLogoTransparent} className="nav-logo" />
            <div className="links logout" onClick={handleLogout}>
                <img
                    src={logoutIcon}
                    alt="logout icon"
                    className="logout-icon"
                />
                Log out
            </div>
        </nav>
    ) : (
        <>
            <img
                src={transAppLogoTransparentNoText}
                alt="trans app icon"
                className={
                    rotateIcon ? "mobile-nav-btn rotated" : "mobile-nav-btn"
                }
                onClick={() => {
                    setRotateIcon(!rotateIcon);
                    setHideNav(!hideNav);
                }}
            />
            {!hideNav ? navbar : <></>}
        </>
    );
};
