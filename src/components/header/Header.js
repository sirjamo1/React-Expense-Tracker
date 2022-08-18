import React, { useEffect, useState } from "react";
import userIcon from "../icons/userIcon.png";
import transAppLogoTransparentNoText from "../images/transAppLogoTransparentNoText.png" 
import { useAuth } from "../../Auth";
import "./Header.css";

function Header(props) {
    const { user } = useAuth();
    const [titleStyles, setTitleStyles] = useState("title-list");
    const [letterStyles, setLetterStyles] = useState("title-list-letter");
    const [userNameStyles, setUserNameStyles] = useState("user-name")

    const getPageTitle = () => {
        const pageTitle = [];
        let orgPageTitle = props.headerTitle;
        for (let i = 0; i < orgPageTitle.length; i++) {
            pageTitle.push(orgPageTitle[i]);
        }
        return pageTitle;
    };
    useEffect(() => {
        setTimeout(() => {
            setTitleStyles("title-list moved");
            setLetterStyles("title-list-letter letter-moved");
            setUserNameStyles("user-name name-moved");
        }, 200);
    }, []);
    const pageTitleListed = getPageTitle().map((letter) => (
        <li className={letterStyles}>{letter}</li>
    ));
     const handleHeaderIcon = () => {
        if (user.photoURL == "https://example.com/jane-q-user/profile.jpg" ) {
            return transAppLogoTransparentNoText;
        }
        else {
            return user.photoURL
        }
    }
    return (
        <div className="dashboard-header">
            <ul className={titleStyles}>{pageTitleListed}</ul>
            <div className={userNameStyles}>
                <img
                    src={
                        handleHeaderIcon()
                    }
                    alt="user icon"
                    className="user-icon"
                />
                <h4> {user.displayName}</h4>
            </div>
        </div>
    );
}

export default Header;
