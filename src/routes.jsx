import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import SignIn from "./pages/Auth/SignIn";
import Login from "./pages/Auth/Login";
import MinhaEvolucao from "./pages/Auth/MinhaEvolucao.jsx";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/login" element={<Login />} />
        <Route path="/minha-evolucao" element={<MinhaEvolucao />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
