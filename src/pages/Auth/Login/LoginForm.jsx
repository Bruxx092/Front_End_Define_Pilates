import React, { useState } from "react";
import {Mail, Lock} from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo_Sem_Contorno from '../../../assets/Logo_Sem_Contorno.svg';

const LoginForm = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-bismark-800 p-4'>
        <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md w-960">
            <img src={Logo_Sem_Contorno} alt="Logo da Empresa" className="w-55" />

            <h2 className="text-xl font-bold mb-6 text-gray-800">LOGIN</h2>

            <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                <Mail className="text-gray-500 mr-2"/>
                <input 
                type="email"
                placeholder="Email"
                className="flex-grow outline-none border-none bg-transparent text-gray-700"
                />
            </div>

            <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                <Lock className="text-gray-500 mr-2"/>
                <input 
                    type="password"
                    placeholder="Senha"
                    className="flex-grow outline-none border-none bg-transparent text-gray-700"
                />
            </div>

            <Link to={'/forgot-password'} className='text font-mono text-center text-gray-500 mt-1 hover:text-dove-gray-950'>ESQUECI A SENHA</Link>


            <br />

            <button className="w-full py-2 bg-blumine-900 text-white font-bold rounded-md hover:bg-blumine-950 transition-colors duration-300">
                ENTRAR
            </button>
        </div>
    </div>
  );
};

export default LoginForm;