import React, { useState } from "react";
import { User, Mail, Lock, Phone, IdCard, GraduationCap, ChevronDown} from 'lucide-react';
import Logo_Sem_Contorno from '../../../assets/Logo_Sem_Contorno.svg';
import DateInput from "../../../components/forms/DateInput";

const InstructorSignIn = () => {
    const [documentType, setDocumentType] = useState('CREF');

    return (
        // -> Adicionado padding geral para telas pequenas
        <div className='flex flex-col items-center justify-center min-h-screen bg-shadow-green-200 p-4'>
            {/* -> Classes de largura e padding responsivas */}
            <div className="flex flex-col items-center p-4 sm:p-8 bg-white rounded-lg shadow-md w-full max-w-2xl">
                {/* -> Ajustado tamanho da logo */}
                <img src={Logo_Sem_Contorno} alt="Logo da Empresa" className="w-40 mb-4" />

                <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">CADASTRO DE INSTRUTOR</h2>

                <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                    <User className="text-gray-500 mr-2"/>
                    <input 
                    type="text"
                    placeholder="Nome Completo"
                    className="flex-grow outline-none border-none bg-transparent text-gray-700"
                    />
                </div>

                {/* -> Classes de flex e espaçamento responsivas */}
                <div className="flex flex-col sm:flex-row w-full gap-4 mb-4">
                    <div className="flex items-center flex-1 p-2 border border-gray-300 rounded-md">
                        <Mail className="text-gray-500 mr-2"/>
                        <input 
                            type="email" 
                            placeholder="Email"
                            // -> Garante que o input preencha o container
                            className="flex-grow outline-none border-none bg-transparent text-gray-700 w-full"
                        />
                    </div>
                    <div className="flex items-center flex-1 p-2 border border-gray-300 rounded-md">
                        <Lock className="text-gray-500 mr-2"/>
                        <input 
                            type="password"
                            placeholder="Senha" 
                            // -> Garante que o input preencha o container
                            className="flex-grow outline-none border-none bg-transparent text-gray-700 w-full"
                        />
                    </div>
                </div>

                <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                    <Phone className="text-gray-500 mr-2"/>
                    <input 
                        type="text"
                        placeholder="Contato"
                        className="flex-grow outline-none border-none bg-transparent text-gray-700"
                    />
                </div>

                <DateInput placeholder="Data de Nascimento"/>            

                <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                    <div className="flex items-center text-gray-500 relative flex-shrink-0"> {/* Adicionado flex-shrink-0 */}
                        <IdCard className="w-5 h-5 mr-2" />
                        <select
                            value={documentType}
                            onChange={(e) => setDocumentType(e.target.value)}
                            className="bg-transparent border-none outline-none appearance-none pr-6" // Aumentado padding para não sobrepor a seta
                        >
                            <option value="CREF">CREF</option>
                            <option value="CREFITO">CREFITO</option>
                        </select>
                        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                    <input 
                        type="number"
                        placeholder="Número do Registro"
                        className="flex-grow outline-none border-none bg-transparent text-gray-700 ml-2" // Adicionado ml-2 para separar
                    />
                </div>

                <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                    <GraduationCap className="text-gray-500 mr-2"/>
                    <input 
                        type="text"
                        placeholder="Formação"
                        className="flex-grow outline-none border-none bg-transparent text-gray-700"
                    />
                </div>          

                <DateInput placeholder="Data de Contratação"/>

                <button className="w-full py-3 bg-shadow-green-500 text-white font-bold rounded-md hover:bg-shadow-green-600 transition-colors duration-300 mt-2">
                    SALVAR
                </button>
            </div>
        </div>
    );
};

export default InstructorSignIn;