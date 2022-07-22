import "./App.css";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components/navbar/Navbar.js";
import { Signin } from "./components/signin/Signin";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AuthProvider } from "./Auth";
import { Signup } from "./components/signup/Signup.js";
import { Dashboard } from "./components/dashboard/Dashboard.js";
import { Expenses } from "./components/expenses/Expenses.js";
import { Transactions } from "./components/transactions/Transactions.js";
import { Settings } from "./components/settings/Settings.js";
import { NoMatch } from "./NoMatch";
import { ForgotPassword } from "./components/ForgotPassword/ForgotPassword";
function App() {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    setUser(user);
  });
  //See Navbar.js for details about hiding nav
  //If user == null the only page able to be viewed is Signin.js and Signup.js
  return (
    <AuthProvider>
      <main>
        <Navbar />

        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="signup" element={<Signup />} />
          <Route path="dashboard" element={user ? <Dashboard /> : <Signin />} />
          <Route path="expenses" element={user ? <Expenses /> : <Signin />} />
          <Route
            path="transactions"
            element={user ? <Transactions /> : <Signin />}
          />
          <Route path="settings" element={user ? <Settings /> : <Signin />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </main>
    </AuthProvider>
  );
}

export default App;
