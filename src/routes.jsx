import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignIn from "./pages/Auth/SignIn";
import Login from "./pages/Auth/Login";
import ColaboratorSignIn from "./pages/Auth/ColaboratorSignIn";
import InstructorSignIn from "./pages/Auth/InstructorSignIn";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/login" element={<Login />} />
        <Route path="/colaborator-signin" element={<ColaboratorSignIn />} />
        <Route path="/instructor-signin" element={<InstructorSignIn/>} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
