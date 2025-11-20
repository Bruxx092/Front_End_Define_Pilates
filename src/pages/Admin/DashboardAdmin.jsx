// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit2,
  ChevronRight,
} from "lucide-react";
import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import { useSidebar } from "@/context/SidebarContext";
import { useNavigate } from "react-router-dom";

const MOCK_DASHBOARD_DATA = {
  totalEstudantes: 24,
  estudantesAtivos: 18,
  estudantesInativos: 4,
  estudantesAtraso: 2,

  totalColaboradores: 5,
  colaboradoresAtivos: 5,

  aulasProximas: 8,
  aulasHoje: 3,

  ganhosMes: 9250.0,
  gastosMes: 3200.0,
  saldoMes: 6050.0,
  tendenciaGanhos: 8.5,

  alertasPlanosAbertos: 2,
  alertasReposicaoAbertos: 2,
  totalAlertas: 4,
};

const MOCK_STUDENTS = [
  {
    id: 1,
    name: "João Oliveira Silva",
    modality: "Yoga",
    status: "Ativo",
    lastPayment: "2024-01-15",
  },
  {
    id: 2,
    name: "Maria Eduarda Santos",
    modality: "Pilates",
    status: "Inativo",
    lastPayment: "2023-12-10",
  },
  {
    id: 3,
    name: "Pedro Carvalho Silva",
    modality: "Curso",
    status: "Ativo",
    lastPayment: "2024-01-20",
  },
  {
    id: 4,
    name: "Gabriel Marques da Silva",
    modality: "Pilates",
    status: "Pagamento em atraso",
    lastPayment: "2023-11-15",
  },
];

const MOCK_COLLABORATORS = [
  { id: 1, nome: "Ana Souza", cargo: "Admin", email: "ana.souza@admin.com" },
  {
    id: 2,
    nome: "Carlos Souza",
    cargo: "Recepcionista",
    email: "carlos@recepcao.com",
  },
];

const MOCK_CLASSES = [
  {
    id: 1,
    title: "Pilates para Iniciante",
    date: "2025-09-02",
    teacher: "Prof. Ana Souza",
    studio: "Estudio Itaquera",
  },
  {
    id: 2,
    title: "Fisioterapia",
    date: "2025-09-03",
    teacher: "Prof. Carlos Silva",
    studio: "Estudio São Miguel",
  },
  {
    id: 3,
    title: "Pilates Funcional",
    date: "2025-09-04",
    teacher: "Prof. Mariana Costa",
    studio: "Estudio Itaquera",
  },
];

const MOCK_PLAN_ALERTS = [
  { id: 1, type: "plan", text: "Roberta quer renovar para plano x" },
  { id: 2, type: "plan", text: "Márcio quer renovar para plano x" },
];

const MOCK_REPLACEMENT_ALERTS = [
  { id: 1, type: "replacement", text: "Pablo quer repor aula no dia 21/07" },
  { id: 2, type: "replacement", text: "Felipe quer repor aula no dia 25/07" },
];

const monthlyFinanceData = [
  { month: "Ago", ganhos: 8500, gastos: 3000 },
  { month: "Set", ganhos: 8800, gastos: 3100 },
  { month: "Out", ganhos: 9200, gastos: 3150 },
  { month: "Nov", ganhos: 8900, gastos: 3200 },
  { month: "Dez", ganhos: 9400, gastos: 3250 },
  { month: "Jan", ganhos: 9250, gastos: 3200 },
];

const plansDistribution = [
  { name: "Anual", value: 8, color: "#10b981" },
  { name: "Semestral", value: 6, color: "#3b82f6" },
  { name: "Trimestral", value: 7, color: "#f59e0b" },
  { name: "Mensal", value: 3, color: "#ef4444" },
];

const StatCard = ({
  icon: Icon,
  label,
  value,
  trend,
  trendPositive,
  color,
}) => (
  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-xs sm:text-sm text-gray-600 mb-1">{label}</p>
        <p
          className="text-2xl sm:text-3xl font-bold"
          style={{ color: color || "#313A4E" }}
        >
          {value}
        </p>
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            {trendPositive ? (
              <TrendingUp size={16} className="text-green-600" />
            ) : (
              <TrendingDown size={16} className="text-red-600" />
            )}
            <span className={trendPositive ? "text-green-600" : "text-red-600"}>
              {trend}% vs período anterior
            </span>
          </div>
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

const AlertCard = ({ alert, type, onAccept, onReject }) => (
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
      <p className="text-gray-800 text-sm sm:text-base break-words">
        {alert.text}
      </p>
    </div>
    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
      <button
        onClick={() => onReject?.(alert.id)}
        className="py-1 px-3 rounded-full font-medium text-xs sm:text-sm bg-red-100 text-red-700 hover:bg-red-200 transition-colors whitespace-nowrap"
      >
        Recusar
      </button>
      <button
        onClick={() => onAccept?.(alert.id)}
        className="py-1 px-3 rounded-full font-medium text-xs sm:text-sm bg-green-100 text-green-700 hover:bg-green-200 transition-colors whitespace-nowrap"
      >
        Aceitar
      </button>
    </div>
  </div>
);

const StudentListItem = ({ student, onView }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Ativo":
        return "#17E383";
      case "Inativo":
        return "#AFAFAF";
      case "Pagamento em atraso":
        return "#FF4848";
      default:
        return "#313A4E";
    }
  };

  return (
    <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
          {student.name}
        </p>
        <div className="flex items-center gap-4 mt-1 text-xs sm:text-sm text-gray-600">
          <span>{student.modality}</span>
          <span
            style={{ color: getStatusColor(student.status) }}
            className="font-medium"
          >
            {student.status}
          </span>
        </div>
      </div>
      <button
        onClick={() => onView?.(student)}
        className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
      >
        <Eye size={18} className="text-gray-600" />
      </button>
    </div>
  );
};


export default function DashboardAdmin() {
  const navigate = useNavigate();
  const { isMobile, sidebarWidth } = useSidebar();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeAlertTab, setActiveAlertTab] = useState("planos");

  const handleStudentClick = (student) => {
    navigate(`/admin/estudantes`);
  };

  const handleAcceptAlert = (alertId) => {
    console.log("Alerta aceito:", alertId);
  };

  const handleRejectAlert = (alertId) => {
    console.log("Alerta recusado:", alertId);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 pt-0">
      {!isMobile && (
        <SidebarUnificada
          menuItems={sidebarConfigs.administrador.menuItems}
          userInfo={sidebarConfigs.administrador.userInfo}
          isOpen={menuOpen}
          onOpenChange={setMenuOpen}
        />
      )}

      {isMobile && (
        <SidebarUnificada
          menuItems={sidebarConfigs.administrador.menuItems}
          userInfo={sidebarConfigs.administrador.userInfo}
          isOpen={menuOpen}
          onOpenChange={setMenuOpen}
        />
      )}

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
                  value={MOCK_DASHBOARD_DATA.estudantesAtivos}
                  trend={15}
                  trendPositive={true}
                  color="#2B668B"
                />
                <StatCard
                  icon={Briefcase}
                  label="Colaboradores"
                  value={MOCK_DASHBOARD_DATA.totalColaboradores}
                  color="#67AF97"
                />
                <StatCard
                  icon={Calendar}
                  label="Aulas Hoje"
                  value={MOCK_DASHBOARD_DATA.aulasHoje}
                  color="#F59E0B"
                />
                <StatCard
                  icon={Bell}
                  label="Alertas Pendentes"
                  value={MOCK_DASHBOARD_DATA.totalAlertas}
                  color="#EF4444"
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
                  value={`R$ ${MOCK_DASHBOARD_DATA.ganhosMes.toLocaleString(
                    "pt-BR",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}`}
                  trend={MOCK_DASHBOARD_DATA.tendenciaGanhos}
                  trendPositive={true}
                  color="#10B981"
                />
                <StatCard
                  icon={TrendingDown}
                  label="Gastos (Este Mês)"
                  value={`R$ ${MOCK_DASHBOARD_DATA.gastosMes.toLocaleString(
                    "pt-BR",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}`}
                  color="#EF4444"
                />
                <StatCard
                  icon={DollarSign}
                  label="Saldo"
                  value={`R$ ${MOCK_DASHBOARD_DATA.saldoMes.toLocaleString(
                    "pt-BR",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}`}
                  color="#3B82F6"
                />
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Ganhos vs Gastos (Últimos 6 meses)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyFinanceData}>
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
                    <Bar
                      dataKey="ganhos"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="gastos"
                      fill="#ef4444"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Distribuição de Planos
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={plansDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {plansDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `${value} alunos`}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {plansDistribution.map((plan) => (
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
              </div>
            </section>

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
                      Mudança de Planos ({MOCK_PLAN_ALERTS.length})
                    </button>
                    <button
                      onClick={() => setActiveAlertTab("reposicao")}
                      className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                        activeAlertTab === "reposicao"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Reposição de Aulas ({MOCK_REPLACEMENT_ALERTS.length})
                    </button>
                  </div>
                </div>
              </div>

              <div>
                {activeAlertTab === "planos" && (
                  <div>
                    {MOCK_PLAN_ALERTS.length > 0 ? (
                      MOCK_PLAN_ALERTS.map((alert) => (
                        <AlertCard
                          key={alert.id}
                          alert={alert}
                          type="plan"
                          onAccept={handleAcceptAlert}
                          onReject={handleRejectAlert}
                        />
                      ))
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        Nenhum alerta de plano pendente
                      </div>
                    )}
                  </div>
                )}

                {activeAlertTab === "reposicao" && (
                  <div>
                    {MOCK_REPLACEMENT_ALERTS.length > 0 ? (
                      MOCK_REPLACEMENT_ALERTS.map((alert) => (
                        <AlertCard
                          key={alert.id}
                          alert={alert}
                          type="replacement"
                          onAccept={handleAcceptAlert}
                          onReject={handleRejectAlert}
                        />
                      ))
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        Nenhum alerta de reposição pendente
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="border-b border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Estudantes Recentes
                    </h3>
                    <button
                      onClick={() => navigate("/admin/estudantes")}
                      className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Ver Todos
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {MOCK_STUDENTS.slice(0, 4).map((student) => (
                    <StudentListItem
                      key={student.id}
                      student={student}
                      onView={handleStudentClick}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="border-b border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Próximas Aulas
                    </h3>
                    <button
                      onClick={() => navigate("/admin/agenda-estudio")}
                      className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Ver Calendário
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {MOCK_CLASSES.slice(0, 3).map((classe) => (
                    <div
                      key={classe.id}
                      className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                          <Calendar size={20} className="text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                            {classe.title}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            {classe.teacher}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            {classe.studio} • {classe.date}
                          </p>
                        </div>
                        <ArrowRight
                          size={18}
                          className="text-gray-400 flex-shrink-0"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="border-b border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Colaboradores
                  </h3>
                  <button
                    onClick={() => navigate("/admin/colaboradores")}
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Gerenciar
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {MOCK_COLLABORATORS.map((colab) => (
                  <div
                    key={colab.id}
                    className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">
                          {colab.nome}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          {colab.cargo}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                          {colab.email}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          navigate(`/admin/colaboradores/${colab.id}`)
                        }
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                      >
                        <Edit2 size={18} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Atalhos Rápidos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => navigate("/admin/estudantes")}
                  className="bg-white hover:bg-gray-50 rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 text-left transition-colors group"
                >
                  <Users
                    className="text-blue-600 mb-2 group-hover:scale-110 transition-transform"
                    size={24}
                  />
                  <p className="font-semibold text-gray-900">
                    Gerenciar Estudantes
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Visualizar e editar perfis dos alunos
                  </p>
                </button>

                <button
                  onClick={() => navigate("/admin/financas")}
                  className="bg-white hover:bg-gray-50 rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 text-left transition-colors group"
                >
                  <DollarSign
                    className="text-green-600 mb-2 group-hover:scale-110 transition-transform"
                    size={24}
                  />
                  <p className="font-semibold text-gray-900">Ver Finanças</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Relatórios e análises financeiras
                  </p>
                </button>

                <button
                  onClick={() => navigate("/admin/agenda-estudio")}
                  className="bg-white hover:bg-gray-50 rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 text-left transition-colors group"
                >
                  <Calendar
                    className="text-orange-600 mb-2 group-hover:scale-110 transition-transform"
                    size={24}
                  />
                  <p className="font-semibold text-gray-900">Agenda de Aulas</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Calendário de aulas por estúdio
                  </p>
                </button>

                <button
                  onClick={() => navigate("/admin/colaboradores")}
                  className="bg-white hover:bg-gray-50 rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 text-left transition-colors group"
                >
                  <Briefcase
                    className="text-purple-600 mb-2 group-hover:scale-110 transition-transform"
                    size={24}
                  />
                  <p className="font-semibold text-gray-900">Colaboradores</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Gerenciar equipe e permissões
                  </p>
                </button>

                <button
                  onClick={() => navigate("/admin/alertas")}
                  className="bg-white hover:bg-gray-50 rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 text-left transition-colors group"
                >
                  <Bell
                    className="text-red-600 mb-2 group-hover:scale-110 transition-transform"
                    size={24}
                  />
                  <p className="font-semibold text-gray-900">Alertas</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Gerenciar solicitações de mudanças
                  </p>
                </button>

                <button
                  onClick={() => navigate("/admin/estudantes")}
                  className="bg-white hover:bg-gray-50 rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 text-left transition-colors group"
                >
                  <TrendingUp
                    className="text-indigo-600 mb-2 group-hover:scale-110 transition-transform"
                    size={24}
                  />
                  <p className="font-semibold text-gray-900">Relatórios</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Estatísticas e performance
                  </p>
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
