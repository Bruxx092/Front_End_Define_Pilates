// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
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
  Download,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Search,
  Filter,
  DollarSign,
} from "lucide-react";
import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";

const Financas = () => {
  const [selectedStatus, setSelectedStatus] = useState("todos");
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const userRole = "administrador";

  const handleEditPlan = (planId) => {
    setSelectedPlanId(planId);
    setShowEditModal(true);
  };

  const handleCancelPlan = (planId) => {
    setSelectedPlanId(planId);
    setShowCancelModal(true);
  };

  const confirmCancelPlan = () => {
    console.log("Cancelando plano:", selectedPlanId);
    setShowCancelModal(false);
    setSelectedPlanId(null);
  };

  const confirmEditPlan = () => {
    console.log("Editando plano:", selectedPlanId);
    setShowEditModal(false);
    setSelectedPlanId(null);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const sidebarWidth = isMobile ? 0 : 280;

  const plansData = [
    {
      id: 1,
      name: "João Oliveira Silva",
      plan: "Anual",
      status: "ativo",
      frequency: "2x/Semana",
      value: 1783.22,
    },
    {
      id: 2,
      name: "Maria Eduarda Santos",
      plan: "Trimestral",
      status: "ativo",
      frequency: "3x/Semana",
      value: 383.22,
    },
    {
      id: 3,
      name: "Pedro Carvalho Silva",
      plan: "Semestral",
      status: "ativo",
      frequency: "2x/Semana",
      value: 783.22,
    },
    {
      id: 4,
      name: "Gabriel Marques da Silva",
      plan: "Anual",
      status: "cancelado",
      frequency: "2x/Semana",
      value: 1783.22,
    },
    {
      id: 5,
      name: "Allan Martins Silva",
      plan: "Semestral",
      status: "cancelado",
      frequency: "2x/Semana",
      value: 783.22,
    },
    {
      id: 6,
      name: "Carla Mendes Costa",
      plan: "Mensal",
      status: "ativo",
      frequency: "2x/Semana",
      value: 180.0,
    },
    {
      id: 7,
      name: "Bruno Almeida Rocha",
      plan: "Trimestral",
      status: "ativo",
      frequency: "3x/Semana",
      value: 450.0,
    },
    {
      id: 8,
      name: "Fernanda Costa Lima",
      plan: "Anual",
      status: "ativo",
      frequency: "4x/Semana",
      value: 2100.0,
    },
  ];

  const refundsData = [
    { name: "Ana Cardoso Silva", value: -320 },
    { name: "Matheus Oliveira Santos", value: -750 },
    { name: "Cecília Lima Pereira", value: -280 },
  ];

  const monthlyData = [
    { month: "Mai", ganhos: 8500, gastos: 2800 },
    { month: "Jun", ganhos: 9200, gastos: 3100 },
    { month: "Jul", ganhos: 8800, gastos: 2900 },
    { month: "Ago", ganhos: 10500, gastos: 3500 },
    { month: "Set", ganhos: 9800, gastos: 3200 },
    { month: "Out", ganhos: 9250, gastos: 3200 },
  ];

  const planDistribution = [
    {
      name: "Ativos",
      value: plansData.filter((p) => p.status === "ativo").length,
      color: "#10b981",
    },
    {
      name: "Cancelados",
      value: plansData.filter((p) => p.status === "cancelado").length,
      color: "#ef4444",
    },
  ];

  const trendData = [
    { value: 8500 },
    { value: 8800 },
    { value: 9200 },
    { value: 8900 },
    { value: 9400 },
    { value: 9250 },
  ];

  const totalGanhos = 9250.0;
  const totalGastos = 3200.0;
  const saldo = totalGanhos - totalGastos;

  const filteredPlans = plansData.filter((plan) => {
    if (selectedStatus !== "todos" && plan.status !== selectedStatus)
      return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SidebarUnificada
        menuItems={sidebarConfigs[userRole]?.menuItems || []}
        userInfo={
          sidebarConfigs[userRole]?.userInfo || { name: "Usuário", email: "" }
        }
        isOpen={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />

      <div
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div>
                <p className="text-xs md:text-sm text-gray-600 mb-1">
                  Ganhos totais
                </p>
                <p className="text-2xl md:text-3xl font-bold text-green-600">
                  R${" "}
                  {totalGanhos.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="p-2 md:p-3 bg-green-100 rounded-lg">
                <TrendingUp className="text-green-600" size={20} />
              </div>
            </div>
            <div className="h-10 md:h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp size={12} /> +8.5% vs mês anterior
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div>
                <p className="text-xs md:text-sm text-gray-600 mb-1">
                  Saldo Final
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-800">
                  R${" "}
                  {saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-2 md:p-3 bg-blue-100 rounded-lg">
                <DollarSign className="text-blue-600" size={20} />
              </div>
            </div>
            <div className="mt-6 md:mt-8 space-y-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">
                  Total de Movimentação
                </p>
                <p className="text-base md:text-lg font-bold text-gray-800">
                  R${" "}
                  {(totalGanhos + totalGastos).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-100 sm:col-span-2 lg:col-span-1">
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div>
                <p className="text-xs md:text-sm text-gray-600 mb-1">
                  Gastos totais
                </p>
                <p className="text-2xl md:text-3xl font-bold text-red-600">
                  R${" "}
                  {totalGastos.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="p-2 md:p-3 bg-red-100 rounded-lg">
                <TrendingDown className="text-red-600" size={20} />
              </div>
            </div>
            <div className="mt-6 md:mt-8">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Devoluções</p>
                <p className="text-base md:text-lg font-bold text-red-600">
                  R${" "}
                  {refundsData
                    .reduce((acc, r) => acc + Math.abs(r.value), 0)
                    .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-6 pb-4 md:pb-6 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-100">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-gray-800">
              Ganhos vs Gastos (Últimos 6 meses)
            </h3>
            <div className="md:hidden">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="ganhos" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="hidden md:block">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
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
                  <Bar dataKey="ganhos" fill="#10b981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="gastos" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-100">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-gray-800">
              Distribuição de Planos
            </h3>
            <div className="md:hidden">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="hidden md:block">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 md:mt-4 space-y-2">
              {planDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-xs md:text-sm text-gray-700">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-gray-800">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 md:px-6 pb-4 md:pb-6">
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-100">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-gray-800">
              Devoluções Recentes
            </h3>
            <div className="space-y-2 md:space-y-3">
              {refundsData.map((refund, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 md:p-3 bg-red-50 rounded-lg"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 font-semibold text-xs md:text-sm">
                        {refund.name.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium text-gray-800 text-sm md:text-base truncate">
                      {refund.name}
                    </span>
                  </div>
                  <span className="text-red-600 font-bold text-sm md:text-base flex-shrink-0">
                    - R${" "}
                    {Math.abs(refund.value).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 md:px-6 pb-4 md:pb-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-100">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <div className="flex flex-col gap-3 md:gap-4">
                <h3 className="text-base md:text-lg font-semibold text-gray-800">
                  Planos Ativos e Cancelados
                </h3>
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="Pesquisar..."
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-sm"
                    />
                  </div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-sm"
                  >
                    <option value="todos">Todos status</option>
                    <option value="ativo">Ativo</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                  <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors text-xs md:text-sm">
                    <Filter size={16} />
                    <span className="hidden sm:inline">Filtrar</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                        Plano
                      </th>
                      <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider hidden md:table-cell">
                        Frequência
                      </th>
                      <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPlans.map((plan) => (
                      <tr key={plan.id} className="hover:bg-gray-50">
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs md:text-sm font-medium text-gray-900 truncate max-w-[120px] md:max-w-none">
                              {plan.name}
                            </span>
                            <span className="text-xs text-gray-500 sm:hidden">
                              {plan.plan}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-700 hidden sm:table-cell">
                          {plan.plan}
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              plan.status === "ativo"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-1 ${
                                plan.status === "ativo"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            ></span>
                            <span className="hidden sm:inline">
                              {plan.status === "ativo" ? "Ativo" : "Cancelado"}
                            </span>
                            <span className="sm:hidden">
                              {plan.status === "ativo" ? "A" : "C"}
                            </span>
                          </span>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-700 hidden md:table-cell">
                          {plan.frequency}
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-semibold text-gray-900">
                          <span className="hidden sm:inline">R$ </span>
                          {plan.value.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 md:gap-2">
                            <button
                              onClick={() => handleEditPlan(plan.id)}
                              className="p-1.5 md:px-3 md:py-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors text-xs font-medium"
                              title="Editar Plano"
                            >
                              <span className="hidden md:inline">Editar</span>
                              <svg
                                className="w-4 h-4 md:hidden"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            {plan.status === "ativo" && (
                              <button
                                onClick={() => handleCancelPlan(plan.id)}
                                className="p-1.5 md:px-3 md:py-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors text-xs font-medium"
                                title="Cancelar Plano"
                              >
                                <span className="hidden md:inline">
                                  Cancelar
                                </span>
                                <svg
                                  className="w-4 h-4 md:hidden"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
                Confirmar Cancelamento
              </h3>
              <p className="text-sm md:text-base text-gray-600 mb-6">
                Tem certeza que deseja cancelar este plano? Esta ação não pode
                ser desfeita.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium"
                >
                  Voltar
                </button>
                <button
                  onClick={confirmCancelPlan}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Confirmar Cancelamento
                </button>
              </div>
            </div>
          </div>
        )}

        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
                Editar Plano
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Plano
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                      <option>Mensal</option>
                      <option>Trimestral</option>
                      <option>Semestral</option>
                      <option>Anual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequência
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                      <option>1x/Semana</option>
                      <option>2x/Semana</option>
                      <option>3x/Semana</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="0,00"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmEditPlan}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Financas;
