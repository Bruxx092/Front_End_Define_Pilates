import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { Loader2, ArrowLeft, CheckCircle, ListTodo } from 'lucide-react';

const ClassEnrollment = () => {
    const location = useLocation();
    const navigate = useNavigate(); ///melhor que ficar definindo pelo href XDXDXDDXD
    
    const estudanteId = location.state?.estudanteId;

    const [aulasTitulos, setAulasTitulos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [selectedTituloAula, setSelectedTituloAula] = useState('');
    const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);

    useEffect(() => {
        if (!estudanteId) {
            setMessage({ text: 'ID do estudante não fornecido. Redirecionando...', type: 'error' });
            setTimeout(() => navigate('/admin/dashboard'), 2000); 
            return;
        }
        
        const fetchAulas = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setMessage({ text: 'Usuário não autenticado.', type: 'error' });
                setIsLoading(false);
                return;
            }

            try {
                const response = await api.get('/aulas/', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const titulosUnicos = [...new Set(response.data.map(aula => aula.titulo_aula))];
                setAulasTitulos(titulosUnicos);
                
                if (titulosUnicos.length > 0) {
                    setSelectedTituloAula(titulosUnicos[0]);
                }

            } catch (error) {
                const errorMessage = error.response?.data?.detail || "Erro ao buscar aulas.";
                setMessage({ text: errorMessage, type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchAulas();
    }, [estudanteId, navigate]);

    // Função de Matrícula em Série
    const handleEnrollSeries = async () => {
        if (!selectedTituloAula || !estudanteId) {
            setMessage({ text: 'Selecione o tipo de aula antes de prosseguir.', type: 'error' });
            return;
        }

        setIsSubmitting(true);
        setMessage(null);
        const token = localStorage.getItem('accessToken');

        const payload = {
            EstudanteID: estudanteId,
            TituloAula: selectedTituloAula,
            TipoAula: "normal" // Assumindo 'normal' como padrão
        };

        try {
            // Rota: /aulas/matricular/series (POST)
            await api.post('/aulas/matricular/series', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setEnrollmentSuccess(true);
            setMessage({ text: `Estudante matriculado em todas as aulas futuras de "${selectedTituloAula}"!`, type: 'success' });
            
            setTimeout(() => navigate('/admin/estudantes'), 2000); 

        } catch (error) {
            const errorMessage = error.response?.data?.detail || "Erro ao matricular na série de aulas.";
            setMessage({ text: errorMessage, type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const renderMessage = () => {
        if (!message) return null;
        const messageClasses = message.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-500 text-white';
        return (
            <div className={`w-full p-3 my-4 rounded-md text-center ${messageClasses}`}>
                {message.text}
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-bismark-800">
                <Loader2 className="animate-spin text-white w-8 h-8 mr-2" />
                <p className="text-white">Carregando títulos de aulas...</p>
            </div>
        );
    }
    
    if (!estudanteId) {
        return <div className="text-center p-8">Erro: ID do estudante não encontrado.</div>;
    }

    if (enrollmentSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-bismark-800">
                <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md w-96">
                    <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 text-center">
                        Matrícula Concluída!
                    </h2>
                    <p className="text-center text-gray-600 mt-2">{message?.text}</p>
                    <button 
                        onClick={() => navigate('/admin/estudantes')}
                        className="mt-6 py-2 px-4 bg-blumine-900 text-white font-bold rounded-md hover:bg-blumine-950 transition-colors"
                    >
                        Ir para Estudantes
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-bismark-800 p-4">
            <div className="w-full max-w-lg p-4 sm:p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                    MATRÍCULA EM AULAS 📚
                </h2>
                <p className="text-center text-gray-600 mb-6">
                    Estudante ID: **{estudanteId}** | Escolha a série de aulas para matricular.
                </p>
                
                {renderMessage()}
                
                {aulasTitulos.length === 0 ? (
                    <p className="text-center text-red-500">Nenhum título de aula agendada encontrado.</p>
                ) : (
                    <div className="flex flex-col gap-4 mb-6">
                        <label className="text-gray-700 font-semibold flex items-center mb-2">
                            <ListTodo className="w-5 h-5 mr-2" />
                            Título da Série de Aula:
                        </label>
                        <select
                            name="TituloAula"
                            value={selectedTituloAula}
                            onChange={(e) => setSelectedTituloAula(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-700 outline-none focus:ring-2 focus:ring-blumine-900"
                            disabled={isSubmitting}
                        >
                            {aulasTitulos.map(titulo => (
                                <option key={titulo} value={titulo}>{titulo}</option>
                            ))}
                        </select>
                    </div>
                )}
                
                <button 
                    onClick={handleEnrollSeries}
                    className="w-full py-3 bg-blumine-900 text-white font-bold rounded-md hover:bg-blumine-950 transition-colors duration-300 disabled:opacity-75 flex items-center justify-center"
                    disabled={isSubmitting || isLoading || aulasTitulos.length === 0 || !selectedTituloAula}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin w-5 h-5 mr-2" />
                            MATRICULANDO...
                        </>
                    ) : `MATRICULAR EM AULAS DE ${selectedTituloAula.toUpperCase()}`}
                </button>

                <button 
                    onClick={() => navigate('/admin/estudantes')}
                    className="w-full py-2 mt-4 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-300 flex items-center justify-center"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar para a Lista de Estudantes
                </button>
            </div>
        </div>
    );
};

export default ClassEnrollment;