import React, { useState } from "react";
import UserCard from '../../components/common/UserCard';
import {FaUserTie, FaUserNurse, FaUserLarge} from 'react-icons/fa6';
import Logo_Sem_Contorno from '../../assets/Logo_Sem_Contorno.svg';

const Login = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-shadow-green-200'>
      <img src={Logo_Sem_Contorno} alt="Logo da Empresa" className="w-55" />
      <br />
      <br />

      <div className='text-center mb-10'>
        <h1 className='text-2xl font-bold text-gray-800 mb-2'>
          COMO VOCÊ GOSTARIA DE REALIZAR LOGIN?
        </h1>
      </div>

      <div className='flex space-x-8'>
        <UserCard title="COLABORADOR" icon={FaUserTie} description="Administrador/Recepcionista"></UserCard>
        <UserCard title="INSTRUTOR" icon={FaUserNurse} description="Avaliador Físico/Instrutor de Pilates"></UserCard>
        <UserCard title="ALUNO" icon={FaUserLarge} description="Pilates/Yoga"></UserCard>
      </div>
    </div>
  );
};

export default Login;
