import React from 'react';
import logo from '../../../assets/Logo_Sem_Contorno.svg';
import UserCard from '../../../components/common/UserCard';
import { Users, User, Handshake } from 'lucide-react';

const Login = () => {
  return (
    // -> Adicionado padding para telas pequenas
    <div className="flex flex-col items-center justify-center min-h-screen bg-shadow-green-200 p-4">
      <img src={logo} alt="Logo da Empresa" className="w-24 h-24 mb-6" />
      {/* -> Título com texto responsivo, centralizado e com padding horizontal */}
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-8 text-center px-4">
        COMO VOCÊ GOSTARIA DE FAZER LOGIN?
      </h1>
      {/* -> Container dos cartões com layout e espaçamento responsivos */}
      <div className="flex flex-col sm:flex-row gap-8">
        <UserCard
          title="COLABORADOR"
          description="Administrador/Recepcionista"
          icon={Handshake}
          to="/login-form" 
        />
        <UserCard
          title="INSTRUTOR"
          description="Avaliador Físico/Instrutor de Pilates"
          icon={User}
          to="/login-form" 
        />
        <UserCard
          title="ALUNO"
          description="Pilates/Yoga"
          icon={Users}
          to="/login-form" 
        />
      </div>
    </div>
  );
};

export default Login;