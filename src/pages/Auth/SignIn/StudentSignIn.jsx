//Página de cadastro de alunos

import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, PersonStanding, IdCard, Search} from 'lucide-react';
import Logo_Sem_Contorno from '../../../assets/Logo_Sem_Contorno.svg';
import DateInput from "../../../components/forms/DateInput";

const StudentSignIn = () => {
    
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
            <div className="flex flex-col items-center justify-center min-h-screen bg-bismark-800">
                <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md w-96">
                    <div className="flex items-center justify-center p-8 bg-blumine-900 rounded-md">
                        <h2 className="text-xl font-bold text-white text-center">
                            NOVO USUÁRIO CADASTRADO COM SUCESSO!
                        </h2>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-bismark-800 p-4">
        <form onSubmit={handlesubmit} className="w-full max-w-md">
            <div className="flex flex-col items-center p-4 sm:p-8 bg-white rounded-lg shadow-md w-full max-w-2xl">
                <img src={Logo_Sem_Contorno} alt="Logo da Empresa" className="w-40 mb-4" />

                <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">CADASTRO DE ALUNO</h2>

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
                    <Phone className="text-gray-500 mr-2"/>
                    <input 
                        type="tel"
                        placeholder="Contato"
                        className="flex-grow outline-none border-none bg-transparent text-gray-700"
                    />
                </div>

                <DateInput placeholder="Data de Nascimento"/> 

                <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                    <IdCard className="text-gray-500 mr-2"/>
                    <input 
                        type="tel"
                        placeholder="CPF"
                        className="flex-grow outline-none border-none bg-transparent text-gray-700"
                    />
                </div>
                
                <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                    <PersonStanding className="text-gray-500 mr-2"/>
                    <input 
                        type="text"
                        placeholder="Tipo de Condição Física"
                        className="flex-grow outline-none border-none bg-transparent text-gray-700"
                    />
                </div> 

                <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                    <Search className="text-gray-500 mr-2"/>
                    <input 
                        type="text"
                        placeholder="Tipo de Orientação"
                        className="flex-grow outline-none border-none bg-transparent text-gray-700"
                    />
                </div> 
                <button className="w-full py-3 bg-blumine-900 text-white font-bold rounded-md hover:bg-blumine-950 transition-colors duration-300">
                    SALVAR
                </button>
            </div>
            </form>
        </div>
    );
};

export default StudentSignIn;