import Logo_Sem_Contorno from '../../../assets/Logo_Sem_Contorno.svg';
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; 
import api from '../../../services/api';

const NewPassword = () => {
    const [senhaCadastrada, setSenhaCadastrada] = useState(false);
    const navigate = useNavigate();
    
    const [searchParams] = useSearchParams();
    
    // Estados para o formulário
    const [token, setToken] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // Pega o token da URL assim que a página carregar
    useEffect(() => {
        const urlToken = searchParams.get('token');
        if (urlToken) {
            setToken(urlToken);
        } else {
            setMessage({ type: 'error', text: 'Token inválido ou ausente. Por favor, solicite um novo link.' });
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'As senhas não conferem.' });
            return;
        }
        if (!token) {
            setMessage({ type: 'error', text: 'Erro: Token não encontrado.' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            await api.post('/auth/reset-password', {
                token: token,
                new_password: newPassword 
            });
            
            setSenhaCadastrada(true);

        } catch (error) {
            const errorMsg = error.response?.data?.detail || "Erro ao redefinir a senha. O token pode estar expirado.";
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setIsLoading(false);
        }
    };

    const renderMessage = () => {
        if (!message) return null;
        const messageClasses = message.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-500 text-white';
        return (
            <div className={`w-full p-3 mb-4 rounded-md text-center ${messageClasses}`}>
                {message.text}
            </div>
        );
    };

    if (senhaCadastrada) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-bismark-800 p-4">
                <img src={Logo_Sem_Contorno} alt="Logo da Empresa" className="w-40 mb-4" />
                <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md w-96">
                    <div className="flex items-center justify-center p-8 bg-blumine-900 rounded-md">
                        <h2 className="text-xl font-bold text-white text-center">
                            NOVA SENHA CADASTRADA COM SUCESSO!
                        </h2>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-bismark-800 p-4'>
            <div className="flex flex-col items-center p-6 sm:p-8 bg-white rounded-lg shadow-md w-full max-w-md">
                <img src={Logo_Sem_Contorno} alt="Logo da Empresa" className="w-40 mb-4" />

                <h2 className="text-xl font-bold mb-6 text-gray-800">REDEFINIR SENHA</h2>
                
                {renderMessage()}

                <form onSubmit={handleSubmit} className="w-full">
                    <div className="flex items-center w-full p-3 mb-4 border border-gray-300 rounded-md">
                        <input 
                            type="password"
                            placeholder="Digite a Nova Senha"
                            className="flex-grow outline-none border-none bg-transparent text-gray-700 text-center"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            disabled={isLoading || !token}
                        />
                    </div>

                    <div className="flex items-center w-full p-3 mb-6 border border-gray-300 rounded-md">
                        <input 
                            type="password"
                            placeholder="Confirme a Nova Senha"
                            className="flex-grow outline-none border-none bg-transparent text-gray-700 text-center"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={isLoading || !token}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full py-3 bg-blumine-900 text-white font-bold rounded-md hover:bg-blumine-950 transition-colors duration-300 disabled:opacity-75"
                        disabled={isLoading || !token}
                    >
                        {isLoading ? 'SALVANDO...' : 'SALVAR NOVA SENHA'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewPassword;
