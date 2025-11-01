import Logo_Sem_Contorno from '../../../assets/Logo_Sem_Contorno.svg';
import React, { useState } from 'react';
import api from '../../../services/api'; 

const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            await api.post('/auth/reset-password', {
                email: email 
            });
            
            setMessage({ type: 'success', text: 'Se este email estiver cadastrado, um link de recuperação foi enviado.' });

        } catch (error) {
            setMessage({ type: 'success', text: 'Se este email estiver cadastrado, um link de recuperação foi enviado.' });
        } finally {
            setIsLoading(false);
        }
    };

    const renderMessage = () => {
        if (!message) return null;
        const messageClasses = message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-600 text-white';
        return (
            <div className={`w-full p-3 mb-4 rounded-md text-center ${messageClasses}`}>
                {message.text}
            </div>
        );
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-bismark-800 p-4'>
            <div className="flex flex-col items-center p-6 sm:p-8 bg-white rounded-lg shadow-md w-full max-w-md">

                <img src={Logo_Sem_Contorno} alt="Logo da Empresa" className="w-40 mb-4" />
                <h2 className="text-lg sm:text-xl font-bold mb-6 text-gray-800 text-center">ESQUECI A SENHA</h2>
                
                {renderMessage()}

                <form onSubmit={handleSubmit} className="w-full">
                    <div className="flex items-center w-full p-3 mb-6 border border-gray-300 rounded-md">
                        <input 
                            type="email"
                            placeholder="Digite o Email Cadastrado"
                            className="flex-grow outline-none border-none bg-transparent text-gray-700 text-center"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full py-3 bg-blumine-900 text-white font-bold rounded-md hover:bg-blumine-950 transition-colors duration-300 disabled:opacity-75"
                        disabled={isLoading}
                    >
                        {isLoading ? 'ENVIANDO...' : 'ENVIAR'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;