// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Receipt,
  Download,
  ArrowRight,
  Loader,
  MapPin,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import Sidebar from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

// --- Componentes de Estilo ---

const InfoCard = ({ icon: Icon, label, value, subtext, color, loading, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100 transition-all h-full ${onClick ? 'cursor-pointer hover:shadow-md hover:border-gray-200' : ''}`}
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm text-gray-500 mb-1 font-medium uppercase tracking-wide">{label}</p>
        {loading ? (
          <Loader className="h-6 w-6 animate-spin text-gray-400 mt-2" />
        ) : (
          <div>
            <p className="text-lg sm:text-xl font-bold text-gray-900 truncate" title={typeof value === 'string' ? value : ''}>
              {value}
            </p>
            {subtext && (
              <p className="text-sm text-gray-500 mt-1 truncate">
                {subtext}
              </p>
            )}
          </div>
        )}
      </div>
      <div
        className="p-3 rounded-lg flex-shrink-0"
        style={{ backgroundColor: `${color || "#313A4E"}15` }}
      >
        <Icon size={24} style={{ color: color || "#313A4E" }} />
      </div>
    </div>
  </div>
);

const DashboardEstudante = () => {
  const navigate = useNavigate();
  const { sidebarWidth = 300, isMobile = false } = useSidebar();
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [activeTab, setActiveTab] = useState("agenda");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- NOVO: Estado e Busca de Dados do Usuário para a Sidebar ---
  const defaultUserInfo = sidebarConfigs.aluno.userInfo; 
  const [userInfo, setUserInfo] = useState(defaultUserInfo);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get("/users/me");
        // Mapeia os campos do backend para os campos esperados pela Sidebar
        setUserInfo({
          name: response.data.name_user || response.data.nome, 
          email: response.data.email_user || response.data.email,
        });
      } catch (error) {
        console.error("Falha ao carregar dados do usuário para a Sidebar:", error);
      }
    };
    fetchUserInfo();
  }, []);
  // --- FIM: Estado e Busca de Dados do Usuário para a Sidebar ---


  // Estados de Dados do Dashboard
  const [loading, setLoading] = useState(true);
  // Alterei userData para ser inicializado com os dados da userInfo para evitar discrepâncias
  const [userData, setUserData] = useState({ id: null, name: defaultUserInfo.name, email: defaultUserInfo.email });
  const [schedule, setSchedule] = useState([]);
  const [nextClass, setNextClass] = useState(null);
  const [activePlan, setActivePlan] = useState(null);
  const [latestInvoice, setLatestInvoice] = useState(null);

  const contentStyle = {
    marginLeft: isMobile ? 0 : sidebarWidth,
    width: isMobile ? "100%" : `calc(100% - ${sidebarWidth}px)`,
    paddingBottom: "2rem",
  };

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []);

  // Carregar agenda quando a semana mudar
  useEffect(() => {
    if (userData?.id) {
      loadSchedule(userData.id);
    }
  }, [selectedWeek, userData?.id]); // Adicionei userData.id como dependência

  const loadInitialData = async () => {
    try {
      setLoading(true);
      // 1. Pegar dados do usuário logado (usando o mesmo endpoint)
      const userRes = await api.get("/users/me");
      const user = userRes.data;
      
      // Atualiza o estado do dashboard (usado para IDs e Nome no Header)
      setUserData({
        id: user.id_user,
        name: user.name_user,
        email: user.email_user
      });

      if (user.id_user) {
        // 2. Carregar Plano Ativo
        try {
            const plansRes = await api.get(`/adesao/estudante/${user.id_user}/historico`);
            const plans = plansRes.data || [];
            
            const current = plans.find(p => p.status_adesao === "ATIVO") || plans[plans.length - 1];
            
            if (current) {
                const today = new Date();
                const due = new Date(current.data_fim || today);
                const diffTime = due - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

                setActivePlan({
                    name: current.nome_plano || "Plano Vigente",
                    price: `R$ ${current.valor_total || '0,00'}`,
                    status: current.status_adesao?.toLowerCase() || "inativo",
                    dueDate: new Date(current.data_fim).toLocaleDateString('pt-BR'),
                    daysUntilDue: diffDays > 0 ? diffDays : 0,
                    id: current.id
                });
            }
        } catch (err) {
            console.warn("Info: Nenhum histórico de plano encontrado.");
        }

        // 3. Carregar Faturas (Pagamentos)
        try {
            const paymentsRes = await api.get(`/pagamentos/?id_estudante=${user.id_user}`);
            const payments = paymentsRes.data || [];
            if (payments.length > 0) {
                // Ordena por data de vencimento para pegar a última
                const sortedPayments = payments.sort((a, b) => new Date(a.data_vencimento) - new Date(b.data_vencimento));
                const lastPayment = sortedPayments[sortedPayments.length - 1];
                
                setLatestInvoice({
                    month: new Date(lastPayment.data_vencimento).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
                    amount: `R$ ${lastPayment.valor || '0,00'}`,
                    status: lastPayment.status === 'PAGO' ? 'paid' : (lastPayment.status === 'ATRASADO' ? 'overdue' : 'pending'),
                    dueDate: new Date(lastPayment.data_vencimento).toLocaleDateString('pt-BR'),
                    issueDate: lastPayment.data_pagamento ? new Date(lastPayment.data_pagamento).toLocaleDateString('pt-BR') : '---',
                    id: lastPayment.id
                });
            }
        } catch (err) {
            console.warn("Info: Nenhum pagamento encontrado.");
        }
      }

    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSchedule = async (studentId) => {
    try {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() + (selectedWeek * 7) - today.getDay()); // Domingo
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Sábado

        const startStr = startOfWeek.toISOString().split('T')[0];
        const endStr = endOfWeek.toISOString().split('T')[0];

        // Busca aulas no intervalo
        const res = await api.get(`/agenda/minhas_aulas?start_date=${startStr}&end_date=${endStr}`);
        const aulas = res.data || [];

        const formattedSchedule = aulas.map(aula => {
            // O backend retorna 'data_aula' como datetime ISO (ex: 2023-10-27T14:00:00)
            // Se o campo vier como 'dataAgendaAula' (alias), usamos ele.
            const rawDate = aula.data_aula || aula.dataAgendaAula;
            const dateObj = new Date(rawDate);
            
            const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
            
            return {
                day: days[dateObj.getDay()],
                date: dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                fullDate: dateObj, // Objeto Date para ordenação
                time: dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                type: aula.titulo_aula || aula.disciplina || "Aula",
                instructor: "Instrutor(a)", // O endpoint atual não retorna nome do professor, apenas ID
            };
        });

        // Ordenar por data/hora
        formattedSchedule.sort((a, b) => a.fullDate - b.fullDate);
        setSchedule(formattedSchedule);

        // Definir próxima aula (apenas se estivermos na semana atual ou futura)
        if (selectedWeek >= 0) {
            const now = new Date();
            const next = formattedSchedule.find(a => a.fullDate >= now);
            
            if (next) {
                const isToday = next.fullDate.toDateString() === now.toDateString();
                setNextClass({
                    day: isToday ? "Hoje" : next.day,
                    time: next.time,
                    type: next.type,
                    instructor: next.instructor
                });
            } else {
                setNextClass(null);
            }
        }

    } catch (error) {
        console.error("Erro ao buscar agenda:", error);
    }
  };

  const handleTabChange = (tabId) => {
    if (tabId === "planos") {
        navigate("/aluno/planos");
    } else {
        setActiveTab(tabId);
    }
  };

  const invoiceStatusConfig = {
    paid: { label: "Pago", className: "bg-green-100 text-green-700 border-green-200", icon: <CheckCircle size={16}/> },
    pending: { label: "Em aberto", className: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: <AlertCircle size={16}/> },
    overdue: { label: "Vencido", className: "bg-red-100 text-red-700 border-red-200", icon: <AlertCircle size={16}/> },
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        menuItems={sidebarConfigs.aluno.menuItems}
        userInfo={userInfo} // <--- CORRIGIDO: Agora usa o estado dinâmico
        isOpen={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />
      <div className="flex-1 transition-all duration-500 flex flex-col" style={contentStyle}>
        
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-5 mt-16 md:mt-0">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {loading ? "Carregando..." : `Olá, ${userData?.name?.split(' ')[0] || 'Estudante'}!`}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Bem-vindo ao seu painel.</p>
                </div>
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                        {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                </div>
            </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <InfoCard 
                    icon={Clock}
                    label="Próxima Aula"
                    value={nextClass ? `${nextClass.day} às ${nextClass.time}` : "Nenhuma aula futura"}
                    subtext={nextClass ? `${nextClass.type}` : "Verifique sua agenda"}
                    color="#2B668B"
                    loading={loading}
                />
                <InfoCard 
                    icon={CreditCard}
                    label="Meu Plano"
                    value={activePlan ? activePlan.name : "Sem plano ativo"}
                    subtext={activePlan ? `Vence em ${activePlan.daysUntilDue} dias` : "Clique para detalhes"}
                    color="#67AF97"
                    loading={loading}
                    onClick={() => navigate("/aluno/planos")}
                />
                <InfoCard 
                    icon={Receipt}
                    label="Última Fatura"
                    value={latestInvoice ? latestInvoice.amount : "---"}
                    subtext={latestInvoice ? `Vencimento: ${latestInvoice.dueDate}` : "Nenhuma fatura recente"}
                    color="#F59E0B"
                    loading={loading}
                    onClick={() => navigate("/aluno/faturas")}
                />
            </div>

            {/* Abas de Navegação */}
            <div className="mb-6 border-b border-gray-200">
                <div className="flex gap-6 overflow-x-auto pb-1 scrollbar-hide">
                    {[
                        { id: "agenda", label: "Minha Agenda", icon: CalendarIcon },
                        { id: "planos", label: "Detalhes do Plano", icon: CreditCard },
                        { id: "faturas", label: "Financeiro", icon: Receipt },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`flex items-center gap-2 pb-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                                    isActive && tab.id !== 'planos' // 'planos' não fica ativo pois navega
                                    ? "border-blue-600 text-blue-600" 
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Conteúdo das Abas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 min-h-[400px]">
                {activeTab === "agenda" && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Agenda Semanal</h2>
                            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                <button
                                    onClick={() => setSelectedWeek(selectedWeek - 1)}
                                    className="p-1 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <span className="text-sm font-medium text-gray-700 min-w-[100px] text-center">
                                    {selectedWeek === 0 ? "Semana Atual" : selectedWeek > 0 ? `+${selectedWeek} Semana(s)` : `${selectedWeek} Semana(s)`}
                                </span>
                                <button
                                    onClick={() => setSelectedWeek(selectedWeek + 1)}
                                    className="p-1 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-10"><Loader className="animate-spin text-gray-400" /></div>
                        ) : schedule.length > 0 ? (
                            <div className="space-y-3">
                                {schedule.map((item, index) => (
                                    <div key={index} className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors group">
                                        <div className="flex flex-col items-center justify-center w-14 h-14 bg-blue-50 text-blue-700 rounded-lg mr-4 group-hover:bg-blue-100 transition-colors">
                                            <span className="text-xs font-semibold uppercase">{item.day}</span>
                                            <span className="text-lg font-bold">{item.date.split('/')[0]}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900">{item.type}</h3>
                                            <p className="text-sm text-gray-500">{item.instructor}</p>
                                        </div>
                                        <div className="text-right text-sm text-gray-600">
                                            <div className="flex items-center justify-end gap-1 mb-1">
                                                <Clock size={14} />
                                                {item.time}
                                            </div>
                                            <div className="flex items-center justify-end gap-1 text-xs text-gray-400">
                                                {item.studio}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                <CalendarIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                <p>Nenhuma aula encontrada para esta semana.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "faturas" && (
                    <div className="max-w-2xl mx-auto">
                        {latestInvoice ? (
                            <div className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-900">Fatura Recente</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${invoiceStatusConfig[latestInvoice.status]?.className}`}>
                                        {invoiceStatusConfig[latestInvoice.status]?.icon}
                                        {invoiceStatusConfig[latestInvoice.status]?.label}
                                    </span>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-end mb-6">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Referência</p>
                                            <p className="text-lg font-bold text-gray-900">{latestInvoice.month}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500 mb-1">Valor Total</p>
                                            <p className="text-2xl font-bold text-gray-900">{latestInvoice.amount}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500">Data de Emissão</p>
                                            <p className="font-medium text-gray-900">{latestInvoice.issueDate}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500">Vencimento</p>
                                            <p className="font-medium text-gray-900">{latestInvoice.dueDate}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                            <Receipt size={18} />
                                            Pagar Agora
                                        </button>
                                        <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors" title="Baixar PDF">
                                            <Download size={20} />
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-center">
                                    <button 
                                        onClick={() => navigate("/aluno/faturas")}
                                        className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 w-full"
                                    >
                                        Ver histórico completo <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                <p>Nenhuma fatura pendente ou recente encontrada.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEstudante;