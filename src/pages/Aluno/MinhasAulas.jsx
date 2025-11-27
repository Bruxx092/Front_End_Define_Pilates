import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import React, { useState, useEffect } from 'react';
import { useSidebar } from "@/context/SidebarContext";
import { ChevronDown, AlertCircle, LogOut, Calendar, Clock, FileText } from 'lucide-react';

const BASE_URL = 'http://localhost:8000';

// --- FUNÇÃO FETCH SEGURA PARA ALUNO ---
async function safeFetchAluno(endpoint, options = {}) {
    const token = localStorage.getItem('accessToken');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        if (response.status === 401 || response.status === 403) {
            throw new Error("AUTH_ERROR");
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || JSON.stringify(errorData) || `Erro HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error; 
    }
}

// --- COMPONENTES UI ---

const MonthYearSelector = ({ month, year, onMonthChange, onYearChange }) => {
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    return (
        <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-2">
                <Calendar className="text-[#67AF97]" size={20} />
                <span className="font-medium text-gray-700">Filtrar por:</span>
            </div>
            <div className="relative inline-block w-40">
                <select 
                    value={month} 
                    onChange={(e) => onMonthChange(parseInt(e.target.value))} 
                    className="appearance-none bg-gray-50 border border-gray-300 rounded-md py-2 pl-3 pr-8 text-base font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#67AF97] text-gray-700 cursor-pointer"
                >
                    {monthNames.map((name, index) => (
                        <option key={index} value={index}>{name}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
            </div>
            <div className="relative inline-block w-32">
                <select 
                    value={year} 
                    onChange={(e) => onYearChange(parseInt(e.target.value))} 
                    className="appearance-none bg-gray-50 border border-gray-300 rounded-md py-2 pl-3 pr-8 text-base font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#67AF97] text-gray-700 cursor-pointer"
                >
                    {Array.from({ length: 5 }, (_, i) => 2024 + i).map((y) => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
            </div>
        </div>
    );
};

const ClassCard = ({ id, sqlId, modality, date, time, fullDate, onReschedule }) => {
    return (
        <article className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col justify-between h-48 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#67AF97]"></div>
            
            <div className="flex flex-col items-center flex-grow justify-center">
                <h3 className="font-bold text-gray-800 text-xl mb-3 text-center line-clamp-2">
                    {modality}
                </h3>
                
                <div className="flex gap-6 text-center mb-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Data</span>
                        <span className="text-lg font-medium text-[#67AF97]">{date}</span>
                    </div>
                    <div className="w-px bg-gray-200"></div>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Horário</span>
                        <span className="text-lg font-medium text-gray-800">{time}</span>
                    </div>
                </div>
                {/* Debug visual opcional: ID SQL */}
                {/* <p className="text-xs text-gray-400">ID: {sqlId}</p> */}
            </div>

            <button
                onClick={() => onReschedule({ id, sqlId, title: modality, date, fullDate })}
                className="w-full py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-md hover:bg-[#67af97] hover:text-white transition-colors"
            >
                Solicitar Reagendamento
            </button>
        </article>
    );
};

// --- POPUP DE REAGENDAMENTO ---
function RescheduleRequestPopup({ isOpen, onClose, classData, onSubmitRequest, isLoading }) {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [reason, setReason] = useState('');

    const availableTimes = ['07:00', '08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

    useEffect(() => {
        if (isOpen && classData) {
            setSelectedDate('');
            setSelectedTime('');
            setReason('');
        }
    }, [isOpen, classData]);

    const handleSubmit = () => {
        if (selectedDate && selectedTime && reason.trim()) {
            onSubmitRequest({
                classId: classData.sqlId, // Envia o ID SQL para a FK
                newDate: selectedDate,
                newTime: selectedTime,
                reason: reason
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
                <div className="px-6 py-4 bg-[#67AF97] text-white flex justify-between items-center">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Clock size={20} /> Solicitar Reagendamento
                    </h3>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                        <LogOut size={18} className="rotate-180" /> 
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-500 uppercase font-bold">Aula Atual</p>
                        <p className="font-semibold text-gray-800">{classData?.title}</p>
                        <p className="text-sm text-gray-600">Dia {classData?.date}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nova Data Desejada</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67AF97] focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Novo Horário</label>
                        <select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67AF97] focus:border-transparent bg-white"
                        >
                            <option value="">Selecione...</option>
                            {availableTimes.map(time => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Ex: Consulta médica..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67AF97] resize-none"
                        />
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedDate || !selectedTime || !reason.trim() || isLoading}
                        className="px-4 py-2 bg-[#67AF97] text-white rounded-lg hover:bg-[#5a9c87] font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading ? 'Enviando...' : 'Enviar Solicitação'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- TABELA DE SOLICITAÇÕES ---
function RescheduleRequestsTable({ requests, isLoading }) {
    if (isLoading) {
        return (
            <div className="mt-10 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#67AF97] mx-auto mb-3"></div>
                    <p className="text-gray-500">Carregando solicitações...</p>
                </div>
            </div>
        );
    }

    // Não mostra nada se não houver requests
    if (!requests || requests.length === 0) {
        return null; 
    }

    const getStatusStyle = (status) => {
        if (!status) return 'bg-gray-100 text-gray-700';
        switch (status.toLowerCase()) {
            case 'em espera':
            case 'pendente':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'atendida':
            case 'aprovada':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'recusada':
            case 'rejeitada':
                return 'bg-red-100 text-red-700 border-red-200';
            default: 
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '--';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        } catch {
            return dateString;
        }
    };

    return (
        <div className="mt-10 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
                <FileText size={20} className="text-gray-500" />
                <h3 className="font-semibold text-gray-800">Histórico de Solicitações</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Aula ID</th>
                            <th className="px-6 py-3">Data Solicitada</th>
                            <th className="px-6 py-3">Motivo</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request.id_solicitacao || request.id || Math.random()} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {request.fk_id_aula_referencia || 'N/A'}
                                </td>
                                <td className="px-6 py-4">{formatDate(request.data_sugerida)}</td>
                                <td className="px-6 py-4 max-w-xs" title={request.menssagem}>
                                    <div className="truncate">{request.menssagem || '--'}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(request.status_solicitacao || request.status)}`}>
                                        {request.status_solicitacao ? request.status_solicitacao.toUpperCase() : 'PENDENTE'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// --- PÁGINA PRINCIPAL ---
export default function MinhasAulas() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isMobile, sidebarWidth } = useSidebar();
    
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    
    const [classes, setClasses] = useState([]); 
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState(false);

    const [reschedulePopup, setReschedulePopup] = useState({ isOpen: false, classData: null });
    const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
    const [rescheduleRequests, setRescheduleRequests] = useState([]);
    const [isLoadingRequests, setIsLoadingRequests] = useState(false);

    useEffect(() => {
        fetchMyClasses();
    }, [currentMonth, currentYear]);

    const fetchMyClasses = async () => {
        setIsLoading(true);
        setAuthError(false);
        try {
            const startDate = new Date(currentYear, currentMonth, 1);
            const endDate = new Date(currentYear, currentMonth + 1, 0);

            const startStr = startDate.toISOString().split('T')[0];
            const endStr = endDate.toISOString().split('T')[0];

            const endpoint = `/agenda/minhas_aulas?start_date=${startStr}&end_date=${endStr}`;
            const data = await safeFetchAluno(endpoint);
            
            if (data && Array.isArray(data)) {
                const formattedClasses = data.map(cls => {
                    const rawDate = cls.dataAgendaAula || cls.data_aula;
                    const dateObj = new Date(rawDate);
                    const isValidDate = dateObj instanceof Date && !isNaN(dateObj.getTime());
                    
                    const day = isValidDate ? String(dateObj.getDate()).padStart(2, '0') : '--';
                    const month = isValidDate ? String(dateObj.getMonth() + 1).padStart(2, '0') : '--';
                    const formattedDate = `${day}/${month}`;
                    const hours = isValidDate ? String(dateObj.getHours()).padStart(2, '0') : '--';
                    const minutes = isValidDate ? String(dateObj.getMinutes()).padStart(2, '0') : '--';
                    const timeStr = `${hours}:${minutes}`;

                    // IDENTIFICAÇÃO CORRETA DO ID SQL
                    // O backend Mongo geralmente retorna 'AulaID' (inteiro) ou 'fk_id_aula'
                    // Se vier só _id (Mongo), não serve para FK do SQL.
                    const sqlId = cls.AulaID || cls.fk_id_aula || cls.id; 

                    return {
                        id: cls._id || cls.id, // ID único do card (Mongo ID preferencialmente para key)
                        sqlId: parseInt(sqlId, 10), // ID SQL para operações de banco relacional
                        modality: cls.disciplina || cls.titulo_aula || 'Aula de Pilates',
                        date: formattedDate,
                        time: timeStr,
                        fullDate: isValidDate ? dateObj : new Date()
                    };
                });
                
                formattedClasses.sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());
                setClasses(formattedClasses);
            } else {
                setClasses([]);
            }
        } catch (error) {
            console.error("Erro ao buscar minhas aulas:", error);
            if (error.message === "AUTH_ERROR") setAuthError(true);
            else setClasses([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenReschedule = (classData) => {
        setReschedulePopup({ isOpen: true, classData });
    };

    const handleCloseReschedule = () => {
        setReschedulePopup({ isOpen: false, classData: null });
    };

    const handleSubmitReschedule = async ({ classId, newDate, newTime, reason }) => {
        setIsSubmittingRequest(true);
        try {
            // VALIDACAO RIGOROSA DO ID
            const intClassId = parseInt(classId, 10);
            
            if (!intClassId || isNaN(intClassId)) {
                throw new Error("ID da aula inválido ou não encontrado. A aula pode não estar sincronizada corretamente.");
            }

            const dataSugeridaISO = new Date(`${newDate}T${newTime}:00`).toISOString();

            const payload = {
                tipo_de_solicitacao: "aula",
                acao_solicitacao_aula: "REAGENDAMENTO",
                fk_id_aula_referencia: intClassId,
                data_sugerida: dataSugeridaISO,
                menssagem: reason || "Sem motivo"
            };

            console.log("Enviando Payload Corrigido:", payload);

            const response = await safeFetchAluno('/solicitacao/createSolcicitacao', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            alert("Solicitação enviada com sucesso!");
            
            setRescheduleRequests(prev => [{
                id: Date.now(),
                fk_id_aula_referencia: intClassId,
                data_sugerida: dataSugeridaISO,
                menssagem: reason,
                status_solicitacao: "em espera",
                ...response 
            }, ...prev]);

            handleCloseReschedule();

        } catch (error) {
            console.error("Erro ao criar solicitação:", error);
            alert(`Erro ao enviar solicitação: ${error.message}`);
        } finally {
            setIsSubmittingRequest(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    if (authError) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 font-inter p-4">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full border border-red-100">
                    <div className="flex justify-center mb-4 text-red-500">
                        <AlertCircle size={48} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Sessão Expirada</h2>
                    <p className="text-gray-600 mb-6 text-sm">
                        Sua sessão não é mais válida. Por favor, faça login novamente.
                    </p>
                    <button onClick={handleLogout} className="w-full bg-[#67AF97] hover:bg-[#559e85] text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2">
                        <LogOut size={18} /> Ir para Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50 font-inter">
            <SidebarUnificada
                menuItems={sidebarConfigs.aluno.menuItems}
                userInfo={sidebarConfigs.aluno.userInfo}
                isOpen={menuOpen}
                onOpenChange={setMenuOpen}
            />

            <div className="flex flex-col flex-1 transition-all duration-300 min-w-0" style={{ marginLeft: !isMobile ? `${sidebarWidth}px` : "0", width: !isMobile ? `calc(100% - ${sidebarWidth}px)` : "100%" }}>
                <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 pt-20 sm:pt-6">
                    <div className="w-full max-w-7xl mx-auto">
                        
                        <div className="mb-8 border-b pb-4 flex justify-between items-end">
                            <div>
                                <h2 className="font-bold text-gray-900 text-2xl sm:text-3xl">Minhas Aulas</h2>
                                <p className="text-gray-500 mt-1 text-sm sm:text-base">Gerencie seus horários e solicitações</p>
                            </div>
                        </div>

                        <MonthYearSelector 
                            month={currentMonth} 
                            year={currentYear} 
                            onMonthChange={setCurrentMonth} 
                            onYearChange={setCurrentYear} 
                        />

                        {isLoading ? (
                            <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#67AF97] mx-auto mb-3"></div>
                                <p className="text-gray-500">Carregando sua agenda...</p>
                            </div>
                        ) : (
                            <>
                                {classes.length === 0 ? (
                                    <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center">
                                        <Calendar className="text-gray-300 mb-3" size={48} />
                                        <p className="text-gray-500 font-medium">Nenhuma aula encontrada para este mês.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                        {classes.map((item) => (
                                            <ClassCard
                                                key={item.id}
                                                id={item.id}
                                                sqlId={item.sqlId} // Passando ID correto
                                                modality={item.modality}
                                                date={item.date}
                                                time={item.time}
                                                fullDate={item.fullDate}
                                                onReschedule={handleOpenReschedule}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        <RescheduleRequestsTable 
                            requests={rescheduleRequests} 
                            isLoading={isLoadingRequests}
                        />
                    </div>
                </main>
            </div>

            <RescheduleRequestPopup 
                isOpen={reschedulePopup.isOpen}
                onClose={handleCloseReschedule}
                classData={reschedulePopup.classData}
                onSubmitRequest={handleSubmitReschedule}
                isLoading={isSubmittingRequest}
            />
        </div>
    );
}