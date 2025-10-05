import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import SignIn from "./pages/Auth/SignIn";
import Login from "./pages/Auth/Login";
import MinhaEvolucao from "./pages/Auth/Alunos/MinhaEvolucao";
import HistoricoAtestados from "./pages/Auth/Alunos/HistoricoAtestados";
import HistoricoAulas from "./pages/Auth/Alunos/HistoricoAulas";
import Fotos from "./pages/Auth/Alunos/Fotos"; 

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />

        <Route path="/signin" element={<SignIn />} />
        <Route path="/login" element={<Login />} />

        <Route path="/minha-evolucao" element={<MinhaEvolucao />} />
        <Route path="/historico-atestados" element={<HistoricoAtestados />} />
        <Route path="/historico-aulas" element={<HistoricoAulas />} />
        <Route path="/fotos" element={<Fotos />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
