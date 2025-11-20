import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import React, { useState, useEffect } from 'react';
import { useSidebar } from "@/context/SidebarContext";
import { AlertTriangle } from 'lucide-react';

const MOCK_PLAN_ALERTS = [
  { id: 1, type: 'plan', text: 'Roberta quer renovar para plano x' },
  { id: 2, type: 'plan', text: 'Márcio quer renovar para plano x' },
];

const MOCK_REPLACEMENT_ALERTS = [
  { id: 1, type: 'replacement', text: 'Pablo quer repor aula no dia 21/07' },
  { id: 2, type: 'replacement', text: 'Felipe quer repor aula no dia 25/07' },
];

// --- Componente Reutilizável para cada Alerta ---
const AlertItem = ({ alert, onShowConfirm }) => {
    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
            <p className="text-gray-800 text-lg">{alert.text}</p>
            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                <button 
                    onClick={() => onShowConfirm('reject', alert)}
                    className="py-1 px-4 rounded-full font-medium text-sm bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                >
                    Recusar
                </button>
                <button 
                    onClick={() => onShowConfirm('accept', alert)}
                    className="py-1 px-4 rounded-full font-medium text-sm bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                >
                    Aceitar
                </button>
            </div>
        </div>
    );
};

// --- Componente do Modal de Confirmação ---
const ConfirmationModal = ({ modalState, onCancel, onConfirm }) => {
    if (!modalState) return null;

    const isAccept = modalState.action === 'accept';
    const title = isAccept ? 'Aceitar Alerta' : 'Recusar Alerta';
    const message = `Tem certeza que deseja ${isAccept ? 'aceitar' : 'recusar'} este alerta?`;
    const buttonClass = isAccept
        ? "bg-green-600 hover:bg-green-700"
        : "bg-red-600 hover:bg-red-700";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex items-center mb-4">
                    <div className={`p-2 rounded-full mr-3 ${isAccept ? 'bg-green-100' : 'bg-red-100'}`}>
                        <AlertTriangle size={24} className={isAccept ? 'text-green-600' : 'text-red-600'} />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                </div>
                
                <p className="text-gray-700 mb-2">{message}</p>
                <p className="text-gray-800 font-medium bg-gray-100 p-3 rounded-md mb-6">
                    "{modalState.alert.text}"
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="py-2 px-4 rounded-md font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`py-2 px-4 rounded-md font-medium text-white transition-colors ${buttonClass}`}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Componente Principal da Página ---
export default function Alertas() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isMobile, sidebarWidth } = useSidebar();
    
    // Estados para os dados
    const [planAlerts, setPlanAlerts] = useState([]);
    const [replacementAlerts, setReplacementAlerts] = useState([]);
    
    // Estado de carregamento
    const [isLoading, setIsLoading] = useState(true);

    // Estado para o modal
    const [modalState, setModalState] = useState(null); // { action: 'accept' | 'reject', alert: {...} }

    // --- PREPARAÇÃO PARA O BACKEND (FETCHING) ---
    useEffect(() => {
        const fetchAlerts = () => {
            setIsLoading(true);
            
            // AQUI TERÁ A LÓGICA DE CHAMADA DOS DADOS DO BACK-END
            setTimeout(() => {
                setPlanAlerts(MOCK_PLAN_ALERTS);
                setReplacementAlerts(MOCK_REPLACEMENT_ALERTS);
                setIsLoading(false);
            }, 1000); 
        };

        fetchAlerts();
    }, []);

    const handleAcceptPlan = (alertId) => {
        console.log(`(API STUB) Aceitando alerta de plano ${alertId}`);
        // No futuro:
        // try {
        //   await api.post('/alertas/plano/aceitar', { id: alertId });
        //   setPlanAlerts(alerts => alerts.filter(a => a.id !== alertId));
        // } catch (error) { ... }
        setPlanAlerts(alerts => alerts.filter(a => a.id !== alertId));
    };

    const handleRejectPlan = (alertId) => {
        console.log(`(API STUB) Recusando alerta de plano ${alertId}`);
        // No futuro:
        // await api.post('/alertas/plano/recusar', { id: alertId });
        setPlanAlerts(alerts => alerts.filter(a => a.id !== alertId));
    };

    // Stubs de API para Ações de Reposição
    const handleAcceptReplacement = (alertId) => {
        console.log(`(API STUB) Aceitando alerta de reposição ${alertId}`);
        // No futuro:
        // await api.post('/alertas/reposicao/aceitar', { id: alertId });
        setReplacementAlerts(alerts => alerts.filter(a => a.id !== alertId));
    };

    const handleRejectReplacement = (alertId) => {
        console.log(`(API STUB) Recusando alerta de reposição ${alertId}`);
        // No futuro:
        // await api.post('/alertas/reposicao/recusar', { id: alertId });
        setReplacementAlerts(alerts => alerts.filter(a => a.id !== alertId));
    };
    
    // --- LÓGICA DO MODAL ---
    
    // 1. Mostra o modal
    const handleShowConfirm = (action, alert) => {
        setModalState({ action, alert });
    };

    // 2. Fecha o modal
    const handleCancel = () => {
        setModalState(null);
    };

    // 3. Executa a ação e fecha o modal
    const handleConfirm = () => {
        if (!modalState) return;
        
        const { action, alert } = modalState;
        
        // Chama a função de API correta
        if (alert.type === 'plan') {
            if (action === 'accept') handleAcceptPlan(alert.id);
            if (action === 'reject') handleRejectPlan(alert.id);
        } else if (alert.type === 'replacement') {
            if (action === 'accept') handleAcceptReplacement(alert.id);
            if (action === 'reject') handleRejectReplacement(alert.id);
        }
        
        setModalState(null);
    };
    
    const renderAlertList = (alerts) => {
        if (alerts.length > 0) {
            return alerts.map((alert) => (
                <AlertItem 
                    key={alert.id}
                    alert={alert}
                    onShowConfirm={handleShowConfirm}
                />
            ));
        }
        return <p className="text-gray-500 py-4">Nenhum alerta no momento.</p>;
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-inter">
            <SidebarUnificada
                menuItems={sidebarConfigs.administrador.menuItems}
                userInfo={sidebarConfigs.administrador.userInfo}
                isOpen={menuOpen}
                onOpenChange={setMenuOpen}
            />

            <div
                className="flex flex-col flex-1 transition-all duration-300 min-w-0"
                style={{
                    marginLeft: !isMobile ? `${sidebarWidth}px` : "0",
                    width: !isMobile ? `calc(100% - ${sidebarWidth}px)` : "100%",
                }}
            >
                <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8">
                    
                        <div className="mb-6 text-center">
                            <h2 className="font-semibold text-gray-900 text-2xl sm:text-3xl lg:text-4xl">
                                Alertas e Avisos
                            </h2>
                        </div>

                    {isLoading ? (
                        <p className="text-gray-600 text-lg">Carregando alertas...</p>
                    ) : (
                        <>
                            <div className="bg-white rounded-lg shadow-lg flex flex-col p-4 sm:p-6 lg:p-8 w-full max-w-full lg:max-w-7xl mx-auto">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    Alertas de Mudança de Plano
                                </h2>
                                <div className="flex flex-col">
                                    {renderAlertList(planAlerts)}
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-lg flex flex-col p-4 sm:p-6 lg:p-8 w-full max-w-full lg:max-w-7xl mx-auto mt-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    Alertas de Reposição de Aula
                                </h2>
                                <div className="flex flex-col">
                                    {renderAlertList(replacementAlerts)}
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
            
            <ConfirmationModal 
                modalState={modalState}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
            />
        </div>
    );
}