import React from "react";
import { User, Mail, Lock, Phone, PersonStanding, IdCard, Search} from 'lucide-react';
import Logo_Sem_Contorno from '../../../assets/Logo_Sem_Contorno.svg';
import DateInput from "../../../components/forms/DateInput";

const StudentSignIn = () => {
    return (
        // -> Adiciona padding para evitar que o form cole nas bordas em telas pequenas
        <div className='flex flex-col items-center justify-center min-h-screen bg-shadow-green-200 p-4'>
            {/* -> Classes de largura e padding responsivas para o card do formulário */}
            <div className="flex flex-col items-center p-4 sm:p-8 bg-white rounded-lg shadow-md w-full max-w-2xl">
                {/* -> Ajusta o tamanho da logo para um visual mais limpo */}
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

                {/* -> Container responsivo para Email e Senha */}
                <div className="flex flex-col sm:flex-row w-full gap-4 mb-4">
                    <div className="flex items-center flex-1 p-2 border border-gray-300 rounded-md">
                        <Mail className="text-gray-500 mr-2"/>
                        <input 
                            type="email" 
                            placeholder="Email"
                            // -> Garante que o input ocupe todo o espaço do seu container
                            className="flex-grow outline-none border-none bg-transparent text-gray-700 w-full"
                        />
                    </div>
                    <div className="flex items-center flex-1 p-2 border border-gray-300 rounded-md">
                        <Lock className="text-gray-500 mr-2"/>
                        <input 
                            type="password"
                            placeholder="Senha" 
                            // -> Garante que o input ocupe todo o espaço do seu container
                            className="flex-grow outline-none border-none bg-transparent text-gray-700 w-full"
                        />
                    </div>
                </div>

                <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                    <Phone className="text-gray-500 mr-2"/>
                    <input 
                        type="tel" // Alterado para 'tel' para melhor usabilidade mobile
                        placeholder="Contato"
                        className="flex-grow outline-none border-none bg-transparent text-gray-700"
                    />
                </div>

                <DateInput placeholder="Data de Nascimento"/> 

                <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                    <IdCard className="text-gray-500 mr-2"/>
                    <input 
                        type="tel" // Alterado para 'tel' para melhor usabilidade mobile
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

                {/* -> Aumenta o padding vertical para um melhor alvo de toque */}
                <button className="w-full py-3 bg-shadow-green-500 text-white font-bold rounded-md hover:bg-shadow-green-600 transition-colors duration-300">
                    SALVAR
                </button>
            </div>
        </div>
    );
};

export default StudentSignIn;