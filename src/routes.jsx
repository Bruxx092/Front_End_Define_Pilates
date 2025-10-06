import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignIn from "./pages/Auth/SignIn";
import Login from "./pages/Auth/Login";
import Meus_Planos from "./pages/Meus_Planos";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/login" element={<Login />} />
        <Route path="/aluno/planos" element={<Meus_Planos />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
