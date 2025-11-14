//Página de escolha do tipo de usuário para cadastro

import logo from '../../../assets/Logo_Sem_Contorno.svg';
import UserCard from '../../../components/common/UserCard';
import { Users, User, Handshake } from 'lucide-react';

// Componente principal da página de SignIn
const SignIn = () => {
  return ( //Aqui ele retorna os cards pra selecionar qual quer usar
    <div className="flex flex-col items-center justify-center min-h-screen bg-bismark-800 p-4">
      <img src={logo} alt="Logo da Empresa" className="w-50 h-50 mb-6" />

      <div className="w-full text-center mb-6">

      <h1 className="text-2xl font-bold text-gray-800">
        COMO VOCÊ GOSTARIA DE CADASTRAR-SE?
      </h1>
      </div>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
        <UserCard
          title="COLABORADOR"
          description="Administrador/Recepcionista"
          icon={Handshake}
          to="/colaborator-signin" 
        />
        <UserCard
          title="INSTRUTOR"
          description="Avaliador Físico/Instrutor de Pilates"
          icon={User}
          to="/instructor-signin" 
        />
        <UserCard
          title="ALUNO"
          description="Pilates/Yoga"
          icon={Users}
          to="/student-signin" 
        />
      </div>
    </div>
  );
};

export default SignIn;