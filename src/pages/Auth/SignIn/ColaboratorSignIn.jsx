//Página de cadastro de colaboradores

import React, { useState, useEffect } from "react";
import { User, Mail, Lock, Search, FileBadge, ChevronDown, Phone, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo_Sem_Contorno from '../../../assets/Logo_Sem_Contorno.svg';

const ColaboratorSignIn = () => {
    const [documentType, setDocumentType] = useState('Administrador'); //função para selecionar se é adm ou recepcionista  
    const [studioType, setStudioType] = useState('SaoMiguel'); //função para selecionar o estudio  
    const [cadastroSucesso, setCadastroSucesso] = useState(false); //estado para mostrar a mensagem de sucesso

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

 return ( //a partir daqui é o formulário de cadastro
    <div className="flex flex-col items-center justify-center min-h-screen bg-bismark-800 p-4">

        <form onSubmit={handlesubmit} className="w-full max-w-md">

        <div className="flex flex-col items-center p-4 sm:p-8 bg-white rounded-lg shadow-md w-full"> 
            <img src={Logo_Sem_Contorno} alt="Logo da Empresa" className="w-40 mb-4" />

            <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">CADASTRO DE COLABORADOR</h2>

            <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                <User className="text-gray-500 mr-2"/>
                <input 
                type="text" //aqui é onde fica o tipo de dado de cada input
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

            <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                <div className="flex items-center text-gray-500 relative flex-shrink-0">
                    <Search className="w-5 h-5 mr-2" />
                    <select
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                        className="bg-transparent border-none outline-none appearance-none pr-6"
                    >
                        <option value="Administrador">Administrador</option>
                        <option value="Recepcionista">Recepcionista</option>
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
            </div>

            <div className="flex items-center w-full p-2 mb-6 border border-gray-300 rounded-md">
                <FileBadge className="text-gray-500 mr-2"/>
                <input 
                    type="text"
                    placeholder="Número de Registro"
                    className="flex-grow outline-none border-none bg-transparent text-gray-700"
                />
            </div>

            <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                <div className="flex items-center text-gray-500 relative flex-shrink-0">
                    <Building className="w-5 h-5 mr-2" />
                    <select
                        value={studioType}
                        onChange={(e) => setStudioType(e.target.value)}
                        className="bg-transparent border-none outline-none appearance-none pr-6"
                    >
                        <option value="SaoMiguel">Unidade São Miguel Paulista</option>
                        <option value="Itaquera">Unidade Itaquera</option>
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
            </div>

            <button type="submit" className="w-full py-3 bg-blumine-900 text-white font-bold rounded-md hover:bg-blumine-950 transition-colors duration-300">
                SALVAR
            </button>
        </div>
        </form>
    </div>
  );
};

export default ColaboratorSignIn;