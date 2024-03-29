import "./App.css";
import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components/navbar/Navbar.js";
import { Signin } from "./components/signin/Signin";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AuthProvider } from "./Auth";
import { Signup } from "./components/signup/Signup.js";
import { Transactions } from "./components/transactions/Transactions.js";
import { Settings } from "./components/settings/Settings.js";
import { NoMatch } from "./NoMatch";
import { ForgotPassword } from "./components/ForgotPassword/ForgotPassword";
import RequireAuth from "./components/RequireAuth";
const LazyDashboard = React.lazy(() =>
  import("./components/dashboard/Dashboard.js")
);

function App() {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    setUser(user);
  });

  return (
    <AuthProvider>
      <main>
        {user && <Navbar />}

        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <React.Suspense fallback="Loading...">
                <RequireAuth>
                  <LazyDashboard />
                </RequireAuth>
              </React.Suspense>
            }
          />
          <Route
            path="/transactions"
            element={
              <RequireAuth>
                <Transactions />
              </RequireAuth>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireAuth>
                <Settings />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </main>
    </AuthProvider>
  );
}

export default App;
