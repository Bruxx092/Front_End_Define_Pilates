import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
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
import MinhasAulas from "./pages/Aluno/MinhasAulas";
import MinhaEvolucao from "./pages/Aluno/MinhaEvolucao/minhaevolucao";
import HistoricoAtestados from "./pages/Aluno/MinhaEvolucao/HistoricoAtestados";
import HistoricoAulasPage from "./pages/Aluno/MinhaEvolucao/HistoricoAulas";
import FotosPage from "./pages/Aluno/MinhaEvolucao/Fotos";
import DashboardEstudante from "./pages/Aluno/DashboardEstudante";
import AgendaEstudio from "./pages/Admin/AgendaEstudio";
import { SidebarProvider } from "./context/SidebarContext";

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

        <Route
          path="/aluno/*"
          element={
            <SidebarProvider>
              <Outlet />
            </SidebarProvider>
          }
        >
          <Route path="planos" element={<Meus_Planos />} />
          <Route path="faturas" element={<Faturas />} />
          <Route path="minha-evolucao" element={<MinhaEvolucao />} />
          <Route path="historico-atestados" element={<HistoricoAtestados />} />
          <Route path="historico-aulas" element={<HistoricoAulasPage />} />
          <Route path="fotos" element={<FotosPage />} />
          <Route path="minhas-aulas" element={<MinhasAulas />} />
          <Route path="dashboard" element={<DashboardEstudante />} />
        </Route>

        <Route
          path="/admin/*"
          element={
            <SidebarProvider>
              <Outlet />
            </SidebarProvider>
          }
        >
          <Route path="agenda-estudio" element={<AgendaEstudio />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRoutes;
