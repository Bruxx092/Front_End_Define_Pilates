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
  DollarSign,
  TrendingUp,
  TrendingDown,
  Edit2,
  Trash2,
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  Loader,
  AlertCircle,
  MoreVertical,
} from "lucide-react";
import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import { useSidebar } from "@/context/SidebarContext";
import { useApi } from "@/hooks/useApi";
import { financasService } from "@/services/financasService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Planos/dialog";
import { ButtonPlanos } from "@/components/ui/Planos/buttonPlanos";
import { Card } from "@/components/ui/Planos/card";

const StatCard = ({ icon: Icon, label, value, trend, positive, color }) => (
  <Card className="p-4 sm:p-6 border border-gray-200">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-xs sm:text-sm text-gray-600 mb-2">{label}</p>
        <p className="text-2xl sm:text-3xl font-bold" style={{ color }}>
          {value}
        </p>
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            {positive ? (
              <TrendingUp size={16} className="text-green-600" />
            ) : (
              <TrendingDown size={16} className="text-red-600" />
            )}
            <span
              className={`text-xs sm:text-sm ${
                positive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend}%
            </span>
          </div>
        )}
      </div>
      <div
        className="p-3 rounded-lg flex-shrink-0"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon size={24} style={{ color }} />
      </div>
    </div>
  </Card>
);

const PlanTableRow = ({
  plan,
  onEdit,
  onCancel,
  isLoading,
  editingId,
  cancelingId,
}) => {
  const statusColor =
    plan.status === "ativo"
      ? "text-green-600 bg-green-100"
      : "text-red-600 bg-red-100";

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium text-gray-900">
        {plan.name}
      </td>
      <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-600">
        {plan.plan}
      </td>
      <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-600">
        {plan.frequency}
      </td>
      <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold text-blue-600">
        R$ {plan.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
      </td>
      <td className="px-3 sm:px-6 py-3 sm:py-4">
        <span
          className={`inline-flex px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold ${statusColor}`}
        >
          {plan.status === "ativo" ? "Ativo" : "Cancelado"}
        </span>
      </td>
      <td className="px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(plan.id)}
            disabled={isLoading && editingId === plan.id}
            className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors disabled:opacity-50"
            title="Editar"
          >
            {isLoading && editingId === plan.id ? (
              <Loader size={18} className="animate-spin" />
            ) : (
              <Edit2 size={18} />
            )}
          </button>
          <button
            onClick={() => onCancel(plan.id)}
            disabled={isLoading && cancelingId === plan.id}
            className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors disabled:opacity-50"
            title="Cancelar"
          >
            {isLoading && cancelingId === plan.id ? (
              <Loader size={18} className="animate-spin" />
            ) : (
              <Trash2 size={18} />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
};

const EditPlanDialog = ({ open, onOpenChange, plan, onConfirm, isLoading }) => {
  const [formData, setFormData] = useState({
    name: plan?.name || "",
    plan: plan?.plan || "",
    frequency: plan?.frequency || "",
    value: plan?.value || 0,
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name || "",
        plan: plan.plan || "",
        frequency: plan.frequency || "",
        value: plan.value || 0,
      });
    }
  }, [plan, open]);

  const handleSubmit = () => {
    onConfirm(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-md rounded-xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold">
            Editar Plano
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Estudante
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plano
            </label>
            <select
              value={formData.plan}
              onChange={(e) =>
                setFormData({ ...formData, plan: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="Mensal">Mensal</option>
              <option value="Trimestral">Trimestral</option>
              <option value="Semestral">Semestral</option>
              <option value="Anual">Anual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frequência
            </label>
            <input
              type="text"
              value={formData.frequency}
              onChange={(e) =>
                setFormData({ ...formData, frequency: e.target.value })
              }
              placeholder="Ex: 2x/Semana"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor
            </label>
            <input
              type="number"
              value={formData.value}
              onChange={(e) =>
                setFormData({ ...formData, value: parseFloat(e.target.value) })
              }
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
        <DialogFooter className="flex-col gap-2 sm:gap-3 mt-6">
          <ButtonPlanos
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            {isLoading ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Edit2 className="mr-2 h-4 w-4" />
            )}
            Atualizar Plano
          </ButtonPlanos>
          <ButtonPlanos
            onClick={() => onOpenChange(false)}
            variant="outline"
            disabled={isLoading}
            className="w-full"
          >
            Cancelar
          </ButtonPlanos>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const CancelPlanDialog = ({ open, onOpenChange, onConfirm, isLoading }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-md rounded-xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold text-red-600">
            Cancelar Plano
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base mt-2">
            Tem certeza que deseja cancelar este plano? Esta ação não pode ser
            desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:gap-3 mt-6">
          <ButtonPlanos
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
          >
            {isLoading ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Confirmar Cancelamento
          </ButtonPlanos>
          <ButtonPlanos
            onClick={() => onOpenChange(false)}
            variant="outline"
            disabled={isLoading}
            className="w-full"
          >
            Voltar
          </ButtonPlanos>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Financas = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("todos");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const { isMobile, sidebarWidth } = useSidebar();

  // API Hooks
  const financialSummary = useApi(null);
  const monthlyData = useApi([]);
  const plansDistribution = useApi([]);
  const plans = useApi([]);
  const refunds = useApi([]);
  const [editingId, setEditingId] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadFinancialData();
  }, [selectedStatus, currentMonth, currentYear, searchTerm]);

  const loadFinancialData = async () => {
    try {
      await financialSummary.request(() =>
        financasService.getFinancialSummary(currentMonth, currentYear)
      );
      await monthlyData.request(() => financasService.getMonthlyData(6));
      await plansDistribution.request(() =>
        financasService.getPlansDistribution()
      );
      await plans.request(() =>
        financasService.getPlans(selectedStatus, searchTerm)
      );
      await refunds.request(() => financasService.getRefunds());
    } catch (error) {
      console.error("Erro ao carregar dados financeiros:", error);
    }
  };

  const handleEditPlan = (planId) => {
    const plan = plans.data?.find((p) => p.id === planId);
    if (plan) {
      setSelectedPlan(plan);
      setSelectedPlanId(planId);
      setEditingId(planId);
      setShowEditModal(true);
    }
  };

  const handleCancelPlan = (planId) => {
    setSelectedPlanId(planId);
    setCancelingId(planId);
    setShowCancelModal(true);
  };

  const confirmEditPlan = async (formData) => {
    setIsProcessing(true);
    try {
      await financasService.updatePlan(selectedPlanId, formData);
      setShowEditModal(false);
      setEditingId(null);
      await loadFinancialData();
    } catch (error) {
      console.error("Erro ao atualizar plano:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmCancelPlan = async () => {
    setIsProcessing(true);
    try {
      await financasService.cancelPlan(selectedPlanId);
      setShowCancelModal(false);
      setCancelingId(null);
      await loadFinancialData();
    } catch (error) {
      console.error("Erro ao cancelar plano:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const summary = financialSummary.data || {};
  const monthlyChartData = monthlyData.data || [];
  const distribution = plansDistribution.data || [];
  const plansList = plans.data || [];
  const refundsList = refunds.data || [];

  const filteredPlans = plansList.filter((plan) =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
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
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto mt-16 md:mt-0">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-8">
            {/* Header */}
            <section className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Finanças
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Gerencie e acompanhe as finanças do estúdio
              </p>
            </section>

            {/* Stats Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={DollarSign}
                label="Ganhos"
                value={`R$ ${(summary.totalGanhos || 0).toLocaleString(
                  "pt-BR",
                  {
                    minimumFractionDigits: 2,
                  }
                )}`}
                trend={summary.trendGanhos}
                positive={true}
                color="#10B981"
              />
              <StatCard
                icon={TrendingDown}
                label="Gastos"
                value={`R$ ${(summary.totalGastos || 0).toLocaleString(
                  "pt-BR",
                  {
                    minimumFractionDigits: 2,
                  }
                )}`}
                trend={summary.trendGastos}
                positive={false}
                color="#EF4444"
              />
              <StatCard
                icon={TrendingUp}
                label="Saldo"
                value={`R$ ${(
                  (summary.totalGanhos || 0) - (summary.totalGastos || 0)
                ).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}`}
                color="#3B82F6"
              />
              <StatCard
                icon={DollarSign}
                label="Planos Ativos"
                value={summary.planosAtivos || 0}
                color="#8B5CF6"
              />
            </section>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Monthly Revenue Chart */}
              <Card className="lg:col-span-2 p-4 sm:p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Receita Mensal
                </h3>
                {monthlyData.loading ? (
                  <div className="h-64 flex items-center justify-center">
                    <Loader className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #ccc",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="ganhos" fill="#10B981" name="Ganhos" />
                      <Bar dataKey="gastos" fill="#EF4444" name="Gastos" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Card>

              {/* Plans Distribution */}
              <Card className="p-4 sm:p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Distribuição de Planos
                </h3>
                {plansDistribution.loading ? (
                  <div className="h-64 flex items-center justify-center">
                    <Loader className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={distribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Card>
            </div>

            {/* Refunds Section */}
            {refundsList.length > 0 && (
              <Card className="p-4 sm:p-6 border border-yellow-200 bg-yellow-50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-900 mb-3">
                      Devoluções Pendentes
                    </h3>
                    <div className="space-y-2">
                      {refundsList.map((refund, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-sm sm:text-base"
                        >
                          <span className="text-yellow-800">{refund.name}</span>
                          <span className="font-semibold text-red-600">
                            R${" "}
                            {Math.abs(refund.value).toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Plans Table */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Planos de Estudantes
                </h2>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <div className="relative flex-1 sm:flex-none">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Buscar estudante..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div className="flex gap-2">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="todos">Todos</option>
                      <option value="ativo">Ativos</option>
                      <option value="cancelado">Cancelados</option>
                    </select>
                  </div>
                </div>
              </div>

              <Card className="overflow-x-auto border border-gray-200">
                {plans.loading ? (
                  <div className="p-6 text-center">
                    <Loader className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                          Estudante
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                          Plano
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                          Frequência
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                          Valor
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPlans.length > 0 ? (
                        filteredPlans.map((plan) => (
                          <PlanTableRow
                            key={plan.id}
                            plan={plan}
                            onEdit={handleEditPlan}
                            onCancel={handleCancelPlan}
                            isLoading={isProcessing}
                            editingId={editingId}
                            cancelingId={cancelingId}
                          />
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-3 sm:px-6 py-8 text-center text-gray-500"
                          >
                            Nenhum plano encontrado
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </Card>
            </section>
          </div>
        </main>

        {/* Modals */}
        <EditPlanDialog
          open={showEditModal}
          onOpenChange={setShowEditModal}
          plan={selectedPlan}
          onConfirm={confirmEditPlan}
          isLoading={isProcessing}
        />

        <CancelPlanDialog
          open={showCancelModal}
          onOpenChange={setShowCancelModal}
          onConfirm={confirmCancelPlan}
          isLoading={isProcessing}
        />
      </div>
    </div>
  );
};

export default Financas;
