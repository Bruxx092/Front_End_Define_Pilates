import React, { useState } from "react";
import {Mail, Lock} from 'lucide-react';
import Logo_Sem_Contorno from '../../../assets/Logo_Sem_Contorno.svg';
import { Link, useNavigate } from 'react-router-dom'; 
import api from '../../../services/api'; 
import { jwtDecode } from "jwt-decode"; // <--- IMPORTANTE: Importe isso

const LoginForm = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const renderMessage = () => {
        if (!message) return null;

        const messageClasses = message.type === 'error' 
            ? 'bg-red-600 text-white' 
            : 'bg-green-500 text-white';

        return (
            <div className={`w-full p-3 my-4 rounded-md text-center ${messageClasses}`}>
                {message.text}
            </div>
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const response = await api.post('/auth/login', {
                email: email,
                password: password 
            });

            // 1. Pega APENAS o token, pois o back não mandou o resto
            const { access_token } = response.data;
            
            // 2. Salva o token
            localStorage.setItem('accessToken', access_token);
            
            // 3. Decodifica o token para ler o que tem dentro (o Payload)
            // O token é como uma caixa trancada, o jwtDecode é a chave
            try {
                const decodedToken = jwtDecode(access_token);
                console.log("Conteúdo do Token:", decodedToken); // Olhe no console (F12) o que aparece aqui!

                // 4. Tenta achar o campo de acesso dentro do token
                // Geralmente vem como 'lv_acesso', 'role', 'sub', ou 'nivel_acesso'
                // Ajuste 'lv_acesso' se o nome no console for diferente
                const userRole = decodedToken.lv_acesso || decodedToken.role || "aluno"; 

                localStorage.setItem('userRole', userRole);

                setMessage({ text: 'Login bem-sucedido! Redirecionando...', type: 'sucesso' });
                
                setTimeout(() => {
                    // Lógica de Redirecionamento
                    switch(userRole.toLowerCase()) {
                        case 'admin':
                        case 'colaborador':
                        case 'recepcionista':
                        case 'supremo': // Caso tenha esse nível no banco
                            navigate('/admin/dashboard'); 
                            break;
                        case 'instrutor':
                        case 'professor':
                            navigate('/instrutor/dashboard'); 
                            break;
                        case 'aluno':
                        default:
                            navigate('/aluno/dashboard');
                            break;
                    }
                }, 1000);

            } catch (decodeError) {
                console.error("Erro ao decodificar token:", decodeError);
                // Se falhar, manda pro aluno por segurança
                navigate('/aluno/dashboard');
            }
            
        } catch (error) {
            console.error("Erro no login:", error);
            const errorMessage = error.response?.data?.detail || "Falha na autenticação.";
            setMessage({ text: errorMessage, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <form className='flex flex-col items-center justify-center min-h-screen bg-bismark-800 p-4'
    onSubmit={handleSubmit}
    >
        <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md w-full max-w-md">
            <img src={Logo_Sem_Contorno} alt="Logo da Empresa" className="w-40 mb-4" />
            {renderMessage()}
            <h2 className="text-xl font-bold mb-6 text-gray-800">LOGIN</h2>

            <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                <Mail className="text-gray-500 mr-2"/>
                <input 
                        type="email"
                        placeholder="Email"
                        className="flex-grow outline-none border-none bg-transparent text-gray-700"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                />
            </div>

            <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                <Lock className="text-gray-500 mr-2"/>
                <input 
                        type="password"
                        placeholder="Senha"
                        className="flex-grow outline-none border-none bg-transparent text-gray-700"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                />
            </div>

            <Link to={'/forgot-password'} className='text font-mono text-center text-gray-500 mt-1 hover:text-dove-gray-950'>ESQUECI A SENHA</Link> 

            <br />

            <button className="w-full py-3 bg-blumine-900 text-white font-bold rounded-md hover:bg-blumine-950 transition-colors duration-300"
            type="submit"
            disabled={isLoading}
            >
                {isLoading ? 'AGUARDE...' : 'ENTRAR'}
            </button>
        </div>
    </form>
  );
};

export default LoginForm;