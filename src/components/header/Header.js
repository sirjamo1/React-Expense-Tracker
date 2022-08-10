import React from 'react'
import userIcon from "../icons/userIcon.png";
import { useAuth } from "../../Auth";
import "./Header.css"
function Header(props) {
 const { user } = useAuth();
  return (
      <div className="dashboard-header">
          <h1>{props.headerTitle}</h1>
          <h4>
              <img src={userIcon} alt="user icon" className="user-icon" />
              {user.displayName}
          </h4>
      </div>
  );
}

export default Header