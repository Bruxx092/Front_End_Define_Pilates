// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Briefcase,
  Calendar,
  DollarSign,
  Bell,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
  Clock,
  Edit2,
  ChevronRight,
  Loader,
} from "lucide-react";
import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import { useSidebar } from "@/context/SidebarContext";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

// --- Subcomponents ---

const StatCard = ({
  icon: Icon,
  label,
  value,
  trend,
  trendPositive,
  color,
  loading,
}) => (
  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-xs sm:text-sm text-gray-600 mb-1">{label}</p>
        {loading ? (
          <Loader className="h-6 w-6 animate-spin text-gray-400" />
        ) : (
          <>
            <p
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: color || "#313A4E" }}
            >
              {value}
            </p>
            {trend !== undefined && trend !== null && (
              <div className="flex items-center gap-1 mt-2">
                {trendPositive ? (
                  <TrendingUp size={16} className="text-green-600" />
                ) : (
                  <TrendingDown size={16} className="text-red-600" />
                )}
                <span
                  className={trendPositive ? "text-green-600" : "text-red-600"}
                >
                  {trend}% vs período anterior
                </span>
              </div>
            )}
          </>
        )}
      </div>
      <div
        className="p-2 sm:p-3 rounded-lg flex-shrink-0"
        style={{ backgroundColor: `${color || "#313A4E"}20` }}
      >
        <Icon size={24} style={{ color: color || "#313A4E" }} />
      </div>
    </div>
  </div>
);

const AlertCard = ({ alert, type, onAccept, onReject, isLoading }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
    <div className="flex items-start gap-3 flex-1 min-w-0">
      {type === "plan" ? (
        <AlertTriangle
          size={20}
          className="text-orange-500 flex-shrink-0 mt-1"
        />
      ) : (
        <Clock size={20} className="text-blue-500 flex-shrink-0 mt-1" />
      )}
      <div className="flex flex-col">
        <p className="text-gray-800 text-sm sm:text-base break-words font-medium">
          {alert.title || "Solicitação"}
        </p>
        <p className="text-gray-500 text-xs sm:text-sm break-words">
          {alert.text || alert.description}
        </p>
        <p className="text-gray-400 text-xs mt-1">
            {alert.studentName}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
      <button
        onClick={() => onReject?.(alert.id)}
        disabled={isLoading}
        className="py-1 px-3 rounded-full font-medium text-xs sm:text-sm bg-red-100 text-red-700 hover:bg-red-200 transition-colors whitespace-nowrap disabled:opacity-50"
      >
        Recusar
      </button>
      <button
        onClick={() => onAccept?.(alert.id)}
        disabled={isLoading}
        className="py-1 px-3 rounded-full font-medium text-xs sm:text-sm bg-green-100 text-green-700 hover:bg-green-200 transition-colors whitespace-nowrap disabled:opacity-50"
      >
        Aceitar
      </button>
    </div>
  </div>
);

const StudentListItem = ({ student, onView }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "ativo":
        return "#17E383";
      case "inativo":
        return "#AFAFAF";
      case "pendente":
      case "pagamento em atraso":
        return "#FF4848";
      default:
        return "#313A4E";
    }
  };

  return (
    <div 
      onClick={() => onView?.(student)}
      className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
          {student.nome || student.name}
        </p>
        <div className="flex items-center gap-4 mt-1 text-xs sm:text-sm text-gray-600">
          <span>{student.email}</span>
          <span
            style={{ color: getStatusColor(student.status || "Ativo") }}
            className="font-medium"
          >
            {student.status || "Ativo"}
          </span>
        </div>
      </div>
      {/* Ícone de olho removido, clique na div inteira agora aciona o onView */}
    </div>
  );
};

// --- Main Component ---

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const { isMobile, sidebarWidth } = useSidebar();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeAlertTab, setActiveAlertTab] = useState("planos");
  const [alertProcessing, setAlertProcessing] = useState(null);

// 1. Defina o valor inicial de segurança baseado em sidebarConfigs
const defaultUserInfo = sidebarConfigs.administrador.userInfo; 
const [userInfo, setUserInfo] = useState(defaultUserInfo);

// 2. Busque os dados reais na API
useEffect(() => {
  const fetchUserData = async () => {
    try {
      const response = await api.get("/users/me");
      // ATUALIZA o estado com os dados do backend
      setUserInfo({
        name: response.data.name_user || response.data.nome, // Campo do backend
        email: response.data.email_user || response.data.email, // Campo do backend
      });
    } catch (error) {
      // Se falhar, ele usa o valor inicial estático (defaultUserInfo)
      console.error("Falha ao carregar dados do usuário:", error);
    }
  };

  fetchUserData();
}, []); // CORREÇÃO: Não esqueça o array de dependências vazio!

  // States for data
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    estudantesAtivos: 0,
    totalColaboradores: 0,
    aulasHoje: 0,
    tendenciaEstudantes: 0,
  });
  const [studentsList, setStudentsList] = useState([]);
  const [collaboratorsList, setCollaboratorsList] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [alertsList, setAlertsList] = useState([]);
  
  // Financial data states (Mocked/Calculated since backend lacks direct endpoint)
  const [financialInfo, setFinancialInfo] = useState({
    ganhosMes: 0,
    gastosMes: 0,
    saldoMes: 0,
    tendenciaGanhos: 0,
    monthlyData: [],
    plansDistribution: [],
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];

      // Parallel data fetching for performance
      const [studentsRes, collaboratorsRes, classesRes, solicitacoesRes] = await Promise.allSettled([
        api.get("/alunos/"),
        api.get("/colaboradore/"),
        api.get(`/agenda/cronograma?start_date=${today}&end_date=${today}`),
        api.get("/solicitacao/"),
      ]);

      // --- Process Students ---
      let students = [];
      let activeStudentsCount = 0;
      let planCounts = {};

      if (studentsRes.status === "fulfilled") {
        students = studentsRes.value.data || [];
        // Calculate actives
        activeStudentsCount = students.length; // Assuming all returned are "active" or filter by status if available
        
        // Calculate Plan Distribution (Safe fallback)
        students.forEach(s => {
            const planName = s.plano_nome || "Sem Plano"; // Verify field name in your response
            planCounts[planName] = (planCounts[planName] || 0) + 1;
        });
        setStudentsList(students);
      }

      // --- Process Collaborators ---
      let collaboratorsCount = 0;
      if (collaboratorsRes.status === "fulfilled") {
        const collaborators = collaboratorsRes.value.data || [];
        setCollaboratorsList(collaborators);
        collaboratorsCount = collaborators.length;
      }

      // --- Process Classes ---
      let classesTodayCount = 0;
      if (classesRes.status === "fulfilled") {
        const classes = classesRes.value.data || [];
        setClassesList(classes.map(c => ({
            id: c.id,
            title: c.tipo_aula || "Aula",
            teacher: c.instrutor_nome || "Instrutor",
            studio: "Estúdio Principal", // Default fallback
            date: `${c.data} - ${c.horario_inicio}`
        })));
        classesTodayCount = classes.length;
      }

      // --- Process Alerts (Solicitacoes) ---
      let processedAlerts = [];
      if (solicitacoesRes.status === "fulfilled") {
        const solicitacoes = solicitacoesRes.value.data || [];
        // Filter only PENDING requests
        processedAlerts = solicitacoes
          .filter(s => s.status === "PENDENTE")
          .map(s => {
            // Map Backend Enum to Frontend Types
            // Assuming types: 'REPOSICAO', 'ADESAO_PLANO', etc.
            let type = "other";
            if (s.tipo_solicitacao === "REPOSICAO" || s.tipo_solicitacao === "REPOSICAO_AULA") type = "replacement";
            if (s.tipo_solicitacao === "ADESAO_PLANO" || s.tipo_solicitacao === "MUDANCA_PLANO") type = "plan";
            
            return {
                id: s.id,
                type: type,
                title: s.tipo_solicitacao?.replace('_', ' '),
                text: s.descricao || "Solicitação pendente",
                studentName: s.nome_aluno || "Aluno",
                description: s.descricao
            };
          });
        setAlertsList(processedAlerts);
      }

      // --- Prepare Dashboard State ---
      setDashboardData({
        estudantesAtivos: activeStudentsCount,
        totalColaboradores: collaboratorsCount,
        aulasHoje: classesTodayCount,
        tendenciaEstudantes: 0, // Requires historical data not available in endpoints
      });

      // --- Process Financials (Mocked / Derived) ---
      // Since we can't fetch all payments without ID, we format data safely to avoid crash
      const plansChartData = Object.keys(planCounts).map((key, index) => ({
        name: key,
        value: planCounts[key],
        color: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][index % 4]
      }));

      setFinancialInfo({
        ganhosMes: 0, // Backend limitation: cannot fetch total income easily
        gastosMes: 0,
        saldoMes: 0,
        tendenciaGanhos: 0,
        monthlyData: [
            { month: 'Jan', ganhos: 0, gastos: 0 },
            { month: 'Fev', ganhos: 0, gastos: 0 },
            // Placeholder data to keep chart rendered but empty
        ],
        plansDistribution: plansChartData.length > 0 ? plansChartData : [{ name: 'Sem dados', value: 1, color: '#e5e7eb' }],
      });

    } catch (error) {
      console.error("Erro crítico ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolution = async (alertId, status) => {
    setAlertProcessing(alertId);
    try {
      // Calls the endpoint: PUT /solicitacao/{id}/resolucao
      await api.put(`/solicitacao/${alertId}/resolucao`, null, {
        params: { status_solicitacao: status } // Query param as per router definition
      });
      
      // Refresh alerts list locally to avoid full reload
      setAlertsList(prev => prev.filter(a => a.id !== alertId));

    } catch (error) {
      console.error(`Erro ao resolver alerta ${status}:`, error);
      alert("Erro ao processar solicitação. Tente novamente.");
    } finally {
      setAlertProcessing(null);
    }
  };

  const handleAcceptAlert = (alertId) => handleResolution(alertId, "ACEITO"); // Check backend Enum exact string
  const handleRejectAlert = (alertId) => handleResolution(alertId, "RECUSADO");

  const handleStudentClick = (student) => {
    navigate(`/admin/estudantes/${student.id}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 pt-0">
      <SidebarUnificada
        menuItems={sidebarConfigs.administrador.menuItems}
        userInfo={userInfo}
        isOpen={menuOpen}
        onOpenChange={setMenuOpen}
      />

      <div
        className="flex flex-col flex-1 transition-all duration-300 min-w-0 w-full"
        style={{
          marginLeft: !isMobile ? `${sidebarWidth}px` : "0",
          width: !isMobile ? `calc(100% - ${sidebarWidth}px)` : "100%",
        }}
      >
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto mt-16 md:mt-0">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-8">
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Indicadores Gerais
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon={Users}
                  label="Estudantes Ativos"
                  value={dashboardData.estudantesAtivos}
                  trend={dashboardData.tendenciaEstudantes}
                  trendPositive={dashboardData.tendenciaEstudantes >= 0}
                  color="#2B668B"
                  loading={loading}
                />
                <StatCard
                  icon={Briefcase}
                  label="Colaboradores"
                  value={dashboardData.totalColaboradores}
                  color="#67AF97"
                  loading={loading}
                />
                <StatCard
                  icon={Calendar}
                  label="Aulas Hoje"
                  value={dashboardData.aulasHoje}
                  color="#F59E0B"
                  loading={loading}
                />
                <StatCard
                  icon={Bell}
                  label="Alertas Pendentes"
                  value={alertsList.length}
                  color="#EF4444"
                  loading={loading}
                />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Resumo Financeiro
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                  icon={TrendingUp}
                  label="Ganhos (Este Mês)"
                  value={`R$ ${financialInfo.ganhosMes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                  trend={financialInfo.tendenciaGanhos}
                  trendPositive={financialInfo.tendenciaGanhos >= 0}
                  color="#10B981"
                  loading={loading}
                />
                <StatCard
                  icon={TrendingDown}
                  label="Gastos (Este Mês)"
                  value={`R$ ${financialInfo.gastosMes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                  color="#EF4444"
                  loading={loading}
                />
                <StatCard
                  icon={DollarSign}
                  label="Saldo"
                  value={`R$ ${financialInfo.saldoMes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                  color="#3B82F6"
                  loading={loading}
                />
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Ganhos vs Gastos (Últimos 6 meses)
                </h3>
                {loading ? (
                  <div className="h-300 flex items-center justify-center">
                    <Loader className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={financialInfo.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="ganhos" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Distribuição de Planos
                </h3>
                {loading ? (
                  <div className="h-280 flex items-center justify-center">
                    <Loader className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={financialInfo.plansDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {financialInfo.plansDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} alunos`} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                      {financialInfo.plansDistribution.map((plan) => (
                        <div key={plan.name} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: plan.color }}
                          ></div>
                          <span className="text-sm text-gray-600">
                            {plan.name}: {plan.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* ALERTS SECTION */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="border-b border-gray-200">
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Alertas Pendentes
                    </h3>
                    <button
                      onClick={() => navigate("/admin/alertas")}
                      className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Ver Todos
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="flex gap-2 border-b border-gray-200 -mx-4 sm:-mx-6 px-4 sm:px-6">
                    <button
                      onClick={() => setActiveAlertTab("planos")}
                      className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                        activeAlertTab === "planos"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Mudança de Planos ({alertsList.filter(a => a.type === 'plan').length})
                    </button>
                    <button
                      onClick={() => setActiveAlertTab("reposicao")}
                      className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                        activeAlertTab === "reposicao"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Reposição de Aulas ({alertsList.filter(a => a.type === 'replacement').length})
                    </button>
                  </div>
                </div>
              </div>

              <div>
                {loading ? (
                  <div className="p-6 text-center">
                    <Loader className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                  </div>
                ) : (
                  <div>
                    {alertsList.filter(a => a.type === (activeAlertTab === 'planos' ? 'plan' : 'replacement')).length > 0 ? (
                        alertsList
                            .filter(a => a.type === (activeAlertTab === 'planos' ? 'plan' : 'replacement'))
                            .map(alert => (
                                <AlertCard
                                    key={alert.id}
                                    alert={alert}
                                    type={alert.type}
                                    onAccept={handleAcceptAlert}
                                    onReject={handleRejectAlert}
                                    isLoading={alertProcessing === alert.id}
                                />
                            ))
                    ) : (
                        <div className="p-6 text-center text-gray-500">
                            Nenhum alerta de {activeAlertTab === 'planos' ? 'plano' : 'reposição'} pendente
                        </div>
                    )}
                  </div>
                )}
              </div>
            </section>
            
            {/* Recent Students and Upcoming Classes (Reused same logic as Alerts/Stats) */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="border-b border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Estudantes Recentes
                    </h3>
                    <button onClick={() => navigate("/admin/estudantes")} className="text-sm font-medium text-blue-600 hover:text-blue-700">Ver Todos</button>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                    {loading ? <div className="p-6"><Loader className="mx-auto animate-spin" /></div> : 
                        studentsList.slice(0, 4).map(student => (
                            <StudentListItem key={student.id} student={student} onView={handleStudentClick} />
                        ))
                    }
                </div>
               </div>

               <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="border-b border-gray-200 p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Próximas Aulas</h3>
                        <button onClick={() => navigate("/admin/agenda-estudio")} className="text-sm font-medium text-blue-600 hover:text-blue-700">Ver Calendário</button>
                    </div>
                </div>
                <div className="divide-y divide-gray-100">
                    {loading ? <div className="p-6"><Loader className="mx-auto animate-spin" /></div> : 
                        classesList.length > 0 ? classesList.slice(0, 3).map(classe => (
                            <div key={classe.id} className="p-4 sm:p-6 hover:bg-gray-50">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg"><Calendar size={20} className="text-blue-600"/></div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">{classe.title}</p>
                                        <p className="text-sm text-gray-600">{classe.teacher}</p>
                                        <p className="text-xs text-gray-500">{classe.date}</p>
                                    </div>
                                </div>
                            </div>
                        )) : <div className="p-6 text-center text-gray-500">Nenhuma aula hoje</div>
                    }
                </div>
               </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
