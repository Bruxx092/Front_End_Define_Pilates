import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import SignIn from "./pages/Auth/SignIn/SignIn";
import Login from "./pages/Auth/Login/Login";
import ColaboratorSignIn from "./pages/Auth/SignIn/ColaboratorSignIn";
import InstructorSignIn from "./pages/Auth/SignIn/InstructorSignIn";
import StudentSignIn from "./pages/Auth/SignIn/StudentSignIn";
import LoginForm from "./pages/Auth/Login/LoginForm";
import ForgotPassword from "./pages/Auth/ForgotPassword/ForgotPassword";
import Code from "./pages/Auth/ForgotPassword/Code";
import NewPassword from "./pages/Auth/ForgotPassword/NewPassword";
import Meus_Planos from "./pages/Aluno/Meus_Planos";
import Faturas from "./pages/Aluno/Faturas";
import MinhaEvolucao from "./pages/MinhaEvolucao/minhaevolucao";
import HistoricoAtestados from "./pages/MinhaEvolucao/HistoricoAtestados"; 
import HistoricoAulasPage from "./pages/MinhaEvolucao/HistoricoAulas"; 
import FotosPage from "./pages/MinhaEvolucao/Fotos"; // <-- import do Fotos.jsx

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/login" element={<Login />} />
        <Route path="/colaborator-signin" element={<ColaboratorSignIn />} />
        <Route path="/instructor-signin" element={<InstructorSignIn />} />
        <Route path="/student-signin" element={<StudentSignIn />} />
        <Route path="/login-form" element={<LoginForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/code" element={<Code />} />
        <Route path="/new-password" element={<NewPassword />} />
        <Route path="/aluno/planos" element={<Meus_Planos />} />
        <Route path="/aluno/faturas" element={<Faturas />} />
        <Route path="/aluno/minha-evolucao" element={<MinhaEvolucao />} />
        <Route path="/aluno/historico-atestados" element={<HistoricoAtestados />} />
        <Route path="/aluno/historico-aulas" element={<HistoricoAulasPage />} />
        <Route path="/aluno/fotos" element={<FotosPage />} /> 
      </Routes>
    </Router>
  );
}

export default AppRoutes;
