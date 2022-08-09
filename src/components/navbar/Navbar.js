import { React } from "react";
import { NavLink } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logoutIcon from "../icons/logoutIcon.png";
import "./Navbar.css";
//import { useAuth } from "../../Auth";

export const Navbar = () => {
    //const { user } = useAuth();
    // const [user, setUser] = useState(null);
    const auth = getAuth();
    // useEffect(() => {
    //     onAuthStateChanged(auth, (user) => {
    //         setUser(user);
    //     });
    // }, [user, auth]);
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
            <NavLink className="links" to="/expenses">
                Expenses
            </NavLink>
            <NavLink className="links" to="/settings">
                Settings
            </NavLink>
            {/* <NavLink className="links" to="/transactions">
              Transactions
          </NavLink> */}
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
