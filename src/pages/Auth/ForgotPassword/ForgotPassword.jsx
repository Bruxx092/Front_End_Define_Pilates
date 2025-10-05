import Logo_Sem_Contorno from '../../../assets/Logo_Sem_Contorno.svg';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica de envio do email para o backend
        // Se o envio for bem-sucedido:
        navigate('/code');
    };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-shadow-green-200'>
        <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md w-96">


            <img src={Logo_Sem_Contorno} alt="Logo da Empresa" className="w-55" />

            <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">ESQUECI A SENHA</h2>

            <form onSubmit={handleSubmit}>

            <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                <div className="text-gray-500 mr-2"/>
                <input 
                type="email"
                placeholder="Digite o Email Cadastrado"
                className="flex-grow outline-none border-none bg-transparent text-gray-700 text-center"
                />
            </div>

            <br />

            <button className="w-full py-2 bg-shadow-green-500 text-white font-bold rounded-md hover:bg-shadow-green-600 transition-colors duration-300">
                ENVIAR
            </button>

            </form>

        </div>
    </div>
  );
};

export default ForgotPassword;