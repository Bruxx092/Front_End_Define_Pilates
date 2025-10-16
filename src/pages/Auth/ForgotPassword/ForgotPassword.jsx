import Logo_Sem_Contorno from '../../../assets/Logo_Sem_Contorno.svg';
import React from 'react';
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
        <div className='flex flex-col items-center justify-center min-h-screen bg-bismark-800 p-4'>
            <div className="flex flex-col items-center p-6 sm:p-8 bg-white rounded-lg shadow-md w-full max-w-md">

                <img src={Logo_Sem_Contorno} alt="Logo da Empresa" className="w-40 mb-4" />

                <h2 className="text-lg sm:text-xl font-bold mb-6 text-gray-800 text-center">ESQUECI A SENHA</h2>

                <form onSubmit={handleSubmit} className="w-full">

                    <div className="flex items-center w-full p-3 mb-6 border border-gray-300 rounded-md">
                        <input 
                            type="email"
                            placeholder="Digite o Email Cadastrado"
                            className="flex-grow outline-none border-none bg-transparent text-gray-700 text-center"
                            required
                        />
                    </div>

                    <button type="submit" className="w-full py-3 bg-blumine-900 text-white font-bold rounded-md hover:bg-blumine-950 transition-colors duration-300">
                        ENVIAR
                    </button>

                </form>

            </div>
        </div>
    );
};

export default ForgotPassword;