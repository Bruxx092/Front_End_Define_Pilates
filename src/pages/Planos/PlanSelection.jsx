import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SquareCheckBig, Loader2, ArrowLeft } from 'lucide-react';
import api from '@/services/api';

const PlanSelection = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const estudanteId = location.state?.estudanteId;

    const [planos, setPlanos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [selectedPlano, setSelectedPlano] = useState(null);

    useEffect(() => {
        if (!estudanteId) {
            setMessage({ text: 'ID do estudante não fornecido. Redirecionando...', type: 'error' });
            // setTimeout(() => navigate('/caminho/para/cadastro'), 2000);
            return;
        }
        
        const fetchPlanos = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setMessage({ text: 'Usuário não autenticado.', type: 'error' });
                setIsLoading(false);
                return;
            }

            try {
                const response = await api.get('/planos/geral', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(response.data)
                setPlanos(response.data);
            } catch (error) {
                const errorMessage = error.response?.data?.detail || "Erro ao buscar planos.";
                setMessage({ text: errorMessage, type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlanos();
    }, [estudanteId, navigate]);

    const handleAdesao = async () => {
        if (!selectedPlano || !estudanteId) {
            setMessage({ text: 'Selecione um plano antes de prosseguir.', type: 'error' });
            return;
        }

        setIsSubmitting(true);
        setMessage(null);
        const token = localStorage.getItem('accessToken');

        const payload = {
            fk_id_estudante: estudanteId,
            fk_id_plano_Geral: {
            fk_id_plano: selectedPlano.tipo === 'padrao' ? selectedPlano.id : null,
            fk_id_plano_personalizado: selectedPlano.tipo === 'personalizado' ? selectedPlano.id : null,
            }
        };
        // console.log(payload.fk_id_estudante)
        // console.log(payload.fk_id_plano_Geral)
        // console.log(payload.fk_id_plano)

        // let conut=0
        // for (let values in payload){
        //     conut = conut+1;
        //     console.log(values.data[conut])
        // }
    // console.log("Payload FINAL de Adesão:", payload);

        try {
            const response = await api.post('/planos/adesao', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response)

            setMessage({ text: `Adesão ao plano "${selectedPlano.nome}" realizada com sucesso!`, type: 'success' });
            setTimeout(() => navigate('/admin/matricular-aulas', { state: { estudanteId: estudanteId } }), 2000);
        } catch (error) {
            const errorMessage = error.response?.data?.detail || "Erro ao aderir ao plano.";
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
                <p className="text-white">Carregando planos...</p>
            </div>
        );
    }
    
    if (!estudanteId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-bismark-800">
                <p className="text-white">Carregando dados do estudante...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-bismark-800 p-4">
            <div className="w-full max-w-2xl p-4 sm:p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                    SELEÇÃO DE PLANO 📝
                </h2>
                <p className="text-center text-gray-600 mb-6">
                    Estudante ID: **{estudanteId}** | Selecione um plano para finalizar o cadastro.
                </p>
                
                {renderMessage()}
                
                {planos.length === 0 ? (
                    <p className="text-center text-red-500">Nenhum plano disponível para seleção.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        {planos.map((plano) => (

                            <div
                                key={plano.id_plano || plano.id_plano_personalizado}
                                onClick={() => setSelectedPlano({ 
                                    id: plano.id_plano || plano.id_plano_personalizado, 
                                    nome: plano.nome,
                                    tipo: plano.id_plano ? 'padrao' : 'personalizado' 
                                })}
                                className={`p-4 border rounded-lg cursor-pointer transition-shadow duration-300 ${
                                    (selectedPlano?.id === plano.id_plano || selectedPlano?.id === plano.id_plano_personalizado)
                                        ? 'border-blumine-900 ring-2 ring-blumine-900 shadow-lg'
                                        : 'border-gray-300 hover:shadow-md'
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    {/* <h3 className="font-semibold text-lg text-gray-800">{plano.nome}</h3> */}
                                    <h3 className="font-semibold text-lg text-gray-800">{plano.descricao_plano}</h3>

                                    {(selectedPlano?.id === plano.id_plano || selectedPlano?.id === plano.id_plano_personalizado) && (
                                        <SquareCheckBig className="w-5 h-5 text-blumine-900" />
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    {/* {plano.id_plano ? 'Plano Padrão' : 'Plano Personalizado'} */}
                                    {plano.tipo_plano || (plano.id_plano ? 'Plano Padrão' : 'Plano Personalizado')}
                                </p>
                                <p className="text-xl font-bold text-blumine-900 mt-2">
                                    {/* {plano.valor_plano ? `R$ ${parseFloat(plano.valor).toFixed(2)}` : 'N/A'} */}
                                    {plano.valor_plano ? `R$ ${parseFloat(plano.valor_plano).toFixed(2)}` : 'N/A'}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
                
                <button 
                    onClick={handleAdesao}
                    className="w-full py-3 bg-blumine-900 text-white font-bold rounded-md hover:bg-blumine-950 transition-colors duration-300 disabled:opacity-75 flex items-center justify-center"
                    disabled={isSubmitting || isLoading || !selectedPlano || planos.length === 0}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin w-5 h-5 mr-2" />
                            FINALIZANDO ADESÃO...
                        </>
                    ) : 'FINALIZAR CADASTRO E ADERIR AO PLANO'}
                </button>

                <button 
                    onClick={() => navigate('/aluno/dashboard')}
                    className="w-full py-2 mt-4 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-300 flex items-center justify-center"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar para o Dashboard
                </button>
            </div>
        </div>
    );
};

export default PlanSelection;