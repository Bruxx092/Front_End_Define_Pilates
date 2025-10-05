import React, { useState } from "react";
import { User, Mail, Lock, Phone, PersonStanding, IdCard, Search} from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo_Sem_Contorno from '../../../assets/Logo_Sem_Contorno.svg';
import DateInput from "../../../components/forms/DateInput";

const StudentSignIn = () => {

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-shadow-green-200'>
            <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md w-960">
                <img src={Logo_Sem_Contorno} alt="Logo da Empresa" className="w-55" />

                <h2 className="text-xl font-bold mb-6 text-gray-800">CADASTRO DE ALUNO</h2>

                <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                    <User className="text-gray-500 mr-2"/>
                    <input 
                    type="text"
                    placeholder="Nome Completo"
                    className="flex-grow outline-none border-none bg-transparent text-gray-700"
                    />
                </div>

                <div className="flex w-full space-x-4 mb-4">
                    <div className="flex items-center flex-1 p-2 border border-gray-300 rounded-md">
                        <Mail className="text-gray-500 mr-2"/>
                        <input 
                            type="email" 
                            placeholder="Email"
                            className="flex-grow outline-none border-none bg-transparent text-gray-700"
                        />
                    </div>
                    <div className="flex items-center flex-1 p-2 border border-gray-300 rounded-md">
                        <Lock className="text-gray-500 mr-2"/>
                        <input 
                            type="password"
                            placeholder="Senha" 
                            className="flex-grow outline-none border-none bg-transparent text-gray-700"
                        />
                    </div>
                </div>

                <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                    <Phone className="text-gray-500 mr-2"/>
                    <input 
                        type="number"
                        placeholder="Contato"
                        className="flex-grow outline-none border-none bg-transparent text-gray-700"
                    />
                </div>

                <DateInput placeholder="Data de Nascimento"/>       

                <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                    <IdCard className="text-gray-500 mr-2"/>
                    <input 
                        type="number"
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

                <button className="w-full py-2 bg-shadow-green-500 text-white font-bold rounded-md hover:bg-shadow-green-600 transition-colors duration-300">
                    SALVAR
                </button>
            </div>
        </div>
  );
};

export default StudentSignIn;