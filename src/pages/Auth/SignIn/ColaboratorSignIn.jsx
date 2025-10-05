import React, { useState, useEffect } from "react";
import { User, Mail, Lock, Search, FileBadge } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo_Sem_Contorno from '../../../assets/Logo_Sem_Contorno.svg';

const ColaboratorSignIn = () => {
    const [cadastroSucesso, setCadastroSucesso] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(cadastroSucesso) {
            const timer = setTimeout(() => {
                navigate('/login');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [cadastroSucesso, navigate]);

    const handlesubmit = (e) => {
        e.preventDefault();
        //aqui vai a lógica do backend
        setCadastroSucesso(true);
    };

    if(cadastroSucesso) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-shadow-green-200">
                <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md w-96">
                    <div className="flex items-center justify-center p-8 bg-shadow-green-500 rounded-md">
                        <h2 className="text-xl font-bold text-white text-center">
                            NOVO USUÁRIO CADASTRADO COM SUCESSO!
                        </h2>
                    </div>
                </div>
            </div>
        )
    }

 return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-shadow-green-200 p-4">

        <form onSubmit={handlesubmit} className="w-full max-w-md">

        <div className="flex flex-col items-center p-4 sm:p-8 bg-white rounded-lg shadow-md w-full"> 
            <img src={Logo_Sem_Contorno} alt="Logo da Empresa" className="w-40 mb-4" />

            <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">CADASTRO DE COLABORADOR</h2>

            <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                <User className="text-gray-500 mr-2"/>
                <input 
                type="text"
                placeholder="Nome Completo"
                className="flex-grow outline-none border-none bg-transparent text-gray-700"
                />
            </div>

            <div className="flex flex-col sm:flex-row w-full gap-4 mb-4">
                <div className="flex items-center flex-1 p-2 border border-gray-300 rounded-md">
                    <Mail className="text-gray-500 mr-2"/>
                    <input 
                        type="email" 
                        placeholder="Email"
                        className="flex-grow outline-none border-none bg-transparent text-gray-700 w-full"
                    />
                </div>
                <div className="flex items-center flex-1 p-2 border border-gray-300 rounded-md">
                    <Lock className="text-gray-500 mr-2"/>
                    <input 
                        type="password"
                        placeholder="Senha" 
                        className="flex-grow outline-none border-none bg-transparent text-gray-700 w-full"
                    />
                </div>
            </div>

            <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                <Search className="text-gray-500 mr-2"/>
                <input 
                    type="text"
                    placeholder="Tipo de Cargo"
                    className="flex-grow outline-none border-none bg-transparent text-gray-700"
                />
            </div>

            <div className="flex items-center w-full p-2 mb-6 border border-gray-300 rounded-md">
                <FileBadge className="text-gray-500 mr-2"/>
                <input 
                    type="text"
                    placeholder="Número de Registro"
                    className="flex-grow outline-none border-none bg-transparent text-gray-700"
                />
            </div>

            <button type="submit" className="w-full py-3 bg-shadow-green-500 text-white font-bold rounded-md hover:bg-shadow-green-600 transition-colors duration-300">
                SALVAR
            </button>
        </div>
        </form>
    </div>
  );
};

export default ColaboratorSignIn;