import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import React, { useState, useEffect } from 'react';
import { useSidebar } from "@/context/SidebarContext";
import { AlertTriangle, Bell } from 'lucide-react';
import { alertasService } from '@/services/alertasServices';

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

export default function Alertas() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isMobile, sidebarWidth } = useSidebar();
    
    const [planAlerts, setPlanAlerts] = useState([]);
    const [replacementAlerts, setReplacementAlerts] = useState([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [modalState, setModalState] = useState(null); 

    useEffect(() => {
        const fetchAlerts = async () => {
            setIsLoading(true);
            try {
                const data = await alertasService.getAlerts();
                setPlanAlerts(data.planAlerts);
                setReplacementAlerts(data.replacementAlerts);
            } catch (error) {
                console.error("Erro ao carregar alertas:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAlerts();
    }, []);

    const handleAction = async (action, alert) => {
        if (alert.type === 'plano') {
            setPlanAlerts(prev => prev.filter(a => a.id !== alert.id));
        } else {
            setReplacementAlerts(prev => prev.filter(a => a.id !== alert.id));
        }

        try {
            if (action === 'accept') {
                await alertasService.acceptAlert(alert.id, alert.type);
            } else {
                await alertasService.rejectAlert(alert.id, alert.type);
            }
        } catch (error) {
            console.error(`Erro ao ${action} alerta:`, error);
            window.location.reload();
        }
    };
    
    const handleShowConfirm = (action, alert) => {
        setModalState({ action, alert });
    };

    const handleCancel = () => {
        setModalState(null);
    };

    const handleConfirm = () => {
        if (!modalState) return;
        const { action, alert } = modalState;
        
        handleAction(action, alert);
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
                    
                    <div className="flex items-center gap-3 mb-6">
                        <Bell className="text-gray-900" size={32} />
                        <h1 className="font-semibold text-gray-900 text-2xl sm:text-3xl lg:text-4xl">
                            Alertas e Avisos
                        </h1>
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