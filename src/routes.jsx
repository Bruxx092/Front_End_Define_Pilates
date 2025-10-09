import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignIn from "./pages/Auth/SignIn";
import Login from "./pages/Auth/Login";
import MonthlyClasses from "./pages/Auth/MonthlyClasses";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/login" element={<Login />} />
        <Route path="/classes" element={<MonthlyClasses />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
