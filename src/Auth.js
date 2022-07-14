import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useState, createContext, useContext } from "react";

const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        setUser(user);
    });
    return (
        <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
    );
};
export const useAuth = () => {
    return useContext(AuthContext);
};
