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
        // -> Adiciona padding para evitar que o conteúdo toque nas bordas
        <div className='flex flex-col items-center justify-center min-h-screen bg-shadow-green-200 p-4'>
            {/* -> Classes de largura e padding responsivas */}
            <div className="flex flex-col items-center p-6 sm:p-8 bg-white rounded-lg shadow-md w-full max-w-md">

                {/* -> Ajusta o tamanho da logo e adiciona margem inferior */}
                <img src={Logo_Sem_Contorno} alt="Logo da Empresa" className="w-40 mb-4" />

                {/* -> Ajusta o tamanho da fonte para telas pequenas */}
                <h2 className="text-lg sm:text-xl font-bold mb-6 text-gray-800 text-center">ESQUECI A SENHA</h2>

                {/* -> Adiciona w-full para garantir que o formulário ocupe o espaço do card */}
                <form onSubmit={handleSubmit} className="w-full">

                    {/* -> Adiciona margem inferior para espaçamento (substituindo o <br />) */}
                    <div className="flex items-center w-full p-3 mb-6 border border-gray-300 rounded-md">
                        {/* Removido o div vazio, pois não era necessário */}
                        <input 
                            type="email"
                            placeholder="Digite o Email Cadastrado"
                            className="flex-grow outline-none border-none bg-transparent text-gray-700 text-center"
                            required // Boa prática adicionar validação básica
                        />
                    </div>

                    {/* -> Aumenta o padding vertical para um melhor alvo de toque */}
                    <button type="submit" className="w-full py-3 bg-shadow-green-500 text-white font-bold rounded-md hover:bg-shadow-green-600 transition-colors duration-300">
                        ENVIAR
                    </button>

                </form>

            </div>
        </div>
    );
};

export default ForgotPassword;