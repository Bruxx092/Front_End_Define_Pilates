import Logo_Sem_Contorno from '../../../assets/Logo_Sem_Contorno.svg';
import { useNavigate } from 'react-router-dom';

const Code = () => {
    const navigate = useNavigate();
    
        const handleSubmit = (e) => {
            e.preventDefault();
            // Lógica de envio do código
            navigate('/new-password');
        };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-bismark-800 p-4'>
        <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md w-960">
            <img src={Logo_Sem_Contorno} alt="Logo da Empresa" className="w-55" />

            <h2 className="text-xl font-bold mb-6 text-gray-800">ESQUECI A SENHA</h2>
            
            <form onSubmit={handleSubmit}>

            <div className="flex items-center w-full p-2 mb-4 border border-gray-300 rounded-md">
                <div className="text-gray-500 mr-2"/>
                <input 
                type="text"
                placeholder="Digite o Código Enviado"
                className="flex-grow outline-none border-none bg-transparent text-gray-700 text-center"
                />
            </div>

            <br />

            <button className="w-full py-2 bg-blumine-900 text-white font-bold rounded-md hover:bg-blumine-950 transition-colors duration-300">
                ENVIAR
            </button>

            </form>
        </div>
    </div>
  );
};

export default Code;