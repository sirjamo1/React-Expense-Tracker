import React, { useEffect, useState } from "react";
import userIcon from "../icons/userIcon.png";
import { useAuth } from "../../Auth";
import "./Header.css";
function Header(props) {
    const { user } = useAuth();
    const [titleStyles, setTitleStyles] = useState("title-list");
    const [letterStyles, setLetterStyles] = useState("title-list-letter");

    const getPageTitle = () => {
        const pageTitle = [];
        let orgPageTitle = props.headerTitle;
        console.log(orgPageTitle);
        for (let i = 0; i < orgPageTitle.length; i++) {
            pageTitle.push(orgPageTitle[i]);
        }
        return pageTitle;
    };
    useEffect(() => {
        setTimeout(() => {
            setTitleStyles("title-list moved");
            setLetterStyles("title-list-letter letter-moved");
            console.log("moved");
        }, 800);
    }, []);
    const pageTitleListed = getPageTitle().map((letter) => (
        <li className={letterStyles}>{letter}</li>
    ));
    return (
        <div className="dashboard-header">
            <ul className={titleStyles}>{pageTitleListed}</ul>
            <h4>
                <img src={userIcon} alt="user icon" className="user-icon" />
                {user.displayName}
            </h4>
        </div>
    );
}

export default Header;
