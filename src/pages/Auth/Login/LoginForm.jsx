
import React, { useState } from "react";
import {Mail, Lock, AlertTriangle, CheckCircle, Loader} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo_Sem_Contorno from '../../../assets/Logo_Sem_Contorno.svg';
import axios from "axios";


const BASE_URL= 'http://localhost:8000/v1'
const LOGIN_ENDPOINT = `${BASE_URL}/users/login`

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout:5000

});

api.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem('accessToken')
        if (token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error)
    }
)
api.interceptors.response.use(
    (response)=>response,
    (error)=>{
        if(error.response && (error.response.status === 401 || error.response.status===403)){
            console.error('Sessão expirada ou não autorizada. \n\n\nLogout');

            localStorage.removeItem('accessToken');
            localStorage.removeItem('useData')
        
            //retorna para pagina principal:
            window.location.href ='/login';
            return Promise.reject(error)
        }
        return Promise.reject(error)
    }
);



const LoginForm = () => {
    const navigate = useNavigate()
    // para guardar o estado das string email e senha:
    //começa com nada
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    //degine o estado da login e a messagem (seja de erro ou sucesso)
    const [isLoading, setIsLoading] = useState(true)
    const [message, setMessage]=useState(null)

    const renderMessage = ()=>{
        if(!message) return null
        return (
            <div 
                style={{ 
                    padding: '10px', 
                    margin: '10px 0', 
                    borderRadius: '4px', 
                    color: 'white', 
                    backgroundColor: message.type === 'error' ? '#dc3545' : '#28a745' 
                }}
            >
                {message.text}
            </div>
        )
    }


    const handleSubmit = async (e)=>{
        e.preventDefault();
        setMessage(null);
        setIsLoading(true);

        try{
            //requisisão para o endPoitn de login /v1/users/login
            const response = await axios.post(LOGIN_ENDPOINT,{
                email, 
                senha
            });

            //O axios consegue fazer o tratamento de erros e coloca na resposta XD
            const data = response.data;
            const accessToken = data.access_token;

            //pega dados para preencher da rota
            const userData = data.user_data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('userData', JSON.stringify(userData));

            setMessage({
                text:`login SUCESSO. ${userData.name_user || userData.email_user}`,
                type: 'sucesso'

            });
            setTimeout(()=>{
                navigate('/dashboard')
            },1000);

            
        }catch(error){
            console.error('erro de login: ', error)

            let errorMessage = 'erro de conexão. Verifique o BackEnd'
            if(error.response){
                errorMessage = error.response.data.details || `Erro ${error.response.status}: Falha de autenticação`;
            }else if (error.request){
                errorMessage = 'nenhuma reposta recebida do servidor'
            }
            setMessage({text: errorMessage, type: 'error'});
        }finally{
            setIsLoading(false);
        }
    }
  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
            <h2>Acesso ao Sistema</h2>
            {renderMessage()}
    <div className='flex flex-col items-center justify-center min-h-screen bg-bismark-800 p-4'>
        <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md w-960">
            <img src={Logo_Sem_Contorno} alt="Logo da Empresa" className="w-55" />

            <h2 className="text-xl font-bold mb-6 text-gray-800">LOGIN</h2>

            <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                <Mail className="text-gray-500 mr-2"/>
                <input 
                type="email"
                placeholder="Email"
                className="flex-grow outline-none border-none bg-transparent text-gray-700"
                onChange={(e)=>setEmail(e.target.value)}
                required
                // disabled={isLoading}
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}                />
            </div>

            <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                <Lock className="text-gray-500 mr-2"/>
                <input 
                    type="password"
                    placeholder="Senha"
                    className="flex-grow outline-none border-none bg-transparent text-gray-700"
                    onChange={(e)=>(setSenha(e.target.value))}
                    required
                    // disabled={isLoading}
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>

            <Link to={'/forgot-password'} className='text font-mono text-center text-gray-500 mt-1 hover:text-dove-gray-950'>ESQUECI A SENHA</Link> 

            <br />

            <button className="w-full py-2 bg-blumine-900 text-white font-bold rounded-md hover:bg-blumine-950 transition-colors duration-300"
            type="submit"
            // disabled={isLoading}            
            >
                {/* {isLoading? 'aguarde': 'entrar'} */}
            </button>
        </div>
    </div>
    </form>
  );
};

export default LoginForm;