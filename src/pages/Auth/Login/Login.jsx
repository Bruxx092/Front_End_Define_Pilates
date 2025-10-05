import React from 'react';
import logo from '../../../assets/Logo_Sem_Contorno.svg';
import UserCard from '../../../components/common/UserCard';
import { Users, User, Handshake } from 'lucide-react';

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-shadow-green-200">
      <img src={logo} alt="Logo da Empresa" className="w-24 h-24 mb-6" />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        COMO VOCÊ GOSTARIA DE FAZER LOGIN?
      </h1>
      <div className="flex space-x-8">
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