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
import Meus_Planos from "./pages/Meus_Planos";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/login" element={<Login />} />
        <Route path="/colaborator-signin" element={<ColaboratorSignIn />} />
        <Route path="/instructor-signin" element={<InstructorSignIn/>} />
        <Route path="/student-signin" element={<StudentSignIn/>} />
        <Route path="/login-form" element={<LoginForm/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/code" element={<Code/>} />
        <Route path="/new-password" element={<NewPassword/>} />
        <Route path="/aluno/planos" element={<Meus_Planos />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
