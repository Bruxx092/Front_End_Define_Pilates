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
  DollarSign,
  TrendingUp,
  TrendingDown,
  Edit2,
  Trash2,
  Search,
  Loader,
  AlertCircle,
} from "lucide-react";
import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import { useSidebar } from "@/context/SidebarContext";
import api from "@/services/api";
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

// --- Componentes Auxiliares ---

const StatCard = ({ icon: Icon, label, value, trend, positive, color }) => (
  <Card className="p-4 sm:p-6 border border-gray-200">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-xs sm:text-sm text-gray-600 mb-2">{label}</p>
        <p className="text-2xl sm:text-3xl font-bold" style={{ color }}>
          {value}
        </p>
        {trend !== undefined && (
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
  // Normalização do status para exibição
  const normalizedStatus = plan.status ? plan.status.toUpperCase() : "DESCONHECIDO";
  const isActive = normalizedStatus === "ATIVO";
  
  const statusColor = isActive
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
        R$ {Number(plan.value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
      </td>
      <td className="px-3 sm:px-6 py-3 sm:py-4">
        <span
          className={`inline-flex px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold capitalize ${statusColor}`}
        >
          {plan.status}
        </span>
      </td>
      <td className="px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(plan)}
            disabled={isLoading}
            className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors disabled:opacity-50"
            title="Editar Vigência"
          >
            <Edit2 size={18} />
          </button>
          {isActive && (
            <button
              onClick={() => onCancel(plan.id)}
              disabled={isLoading}
              className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors disabled:opacity-50"
              title="Cancelar Contrato"
            >
              {isLoading && cancelingId === plan.id ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Trash2 size={18} />
              )}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

const EditPlanDialog = ({ open, onOpenChange, plan, onConfirm, isLoading }) => {
  // Inicializa com valores seguros para evitar o erro "NaN"
  const [formData, setFormData] = useState({
    name: "",
    data_termino: "",
    value: 0,
  });

  useEffect(() => {
    if (plan && open) {
      // Formata a data para o input (YYYY-MM-DD) de forma segura
      let formattedDate = "";
      if (plan.data_termino) {
        try {
            formattedDate = new Date(plan.data_termino).toISOString().split('T')[0];
        } catch (e) { console.error("Erro ao formatar data", e); }
      }

      setFormData({
        name: plan.name || "",
        data_termino: formattedDate,
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
            Editar Contrato
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Ajuste a data de término do contrato. O valor financeiro é definido pelo Plano e não pode ser alterado aqui.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Estudante
            </label>
            <input
              type="text"
              value={formData.name}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 text-sm cursor-not-allowed"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor Mensal (R$)
            </label>
            <input
              type="text"
              value={Number(formData.value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Término
            </label>
            <input
              type="date"
              value={formData.data_termino}
              onChange={(e) =>
                setFormData({ ...formData, data_termino: e.target.value })
              }
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
            Salvar Alterações
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
            Encerrar Contrato
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base mt-2 text-gray-600">
            Tem certeza que deseja cancelar este contrato? O status será alterado para "CANCELADO" imediatamente.
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
            Confirmar Encerramento
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
  const { isMobile, sidebarWidth } = useSidebar();

  // Estados de Dados
  const [loading, setLoading] = useState(true);
  const [plansList, setPlansList] = useState([]);
  const [summary, setSummary] = useState({ totalGanhos: 0, totalGastos: 0, planosAtivos: 0 });
  const [monthlyChartData, setMonthlyChartData] = useState([]);
  const [distribution, setDistribution] = useState([]);
  
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadFinancialData();
  }, [selectedStatus]);

  const loadFinancialData = async () => {
    setLoading(true);
    try {
        // 1. Buscar todos os alunos
        const studentsRes = await api.get('/alunos/');
        const students = studentsRes.data || [];

        // 2. Buscar Contratos Ativos de cada aluno
        // Nota: O backend retorna o objeto contrato sem o valor monetário.
        // Precisamos buscar o plano depois para saber o valor.
        const contractsPromises = students.map(async (student) => {
            try {
                const contractRes = await api.get(`/contratos/estudante/${student.id_user}/ativo`);
                
                // Se status 204 (No Content) ou data vazia, retorna null
                if (contractRes.status === 204 || !contractRes.data) return null;
                const contract = contractRes.data;

                // 3. Buscar Detalhes do Plano para obter o valor (Fallback)
                let planName = "Plano Vigente";
                let planValue = 0;
                let planFrequency = "Mensal";

                // Tenta buscar dados do Plano Padrão
                if (contract.fk_id_plano) {
                    try {
                        const planInfo = await api.get(`/planos/padrao/${contract.fk_id_plano}`);
                        planName = planInfo.data.nome_plano || planName;
                        planValue = planInfo.data.valor_mensal || 0;
                        planFrequency = planInfo.data.frequencia || planFrequency;
                    } catch (e) { /* Ignora erro ao buscar detalhes do plano */ }
                } 
                // Tenta buscar dados do Plano Personalizado
                else if (contract.fk_id_plano_personalizado) {
                    try {
                        const planInfo = await api.get(`/planos/personalizado/${contract.fk_id_plano_personalizado}`);
                        planName = planInfo.data.nome_plano || "Plano Personalizado";
                        planValue = planInfo.data.valor_total || 0; // Personalizados costumam ter valor total
                    } catch (e) { /* Ignora erro */ }
                }

                return {
                    id: contract.id_contrato,
                    studentId: student.id_user,
                    name: student.name_user,
                    plan: planName,
                    frequency: planFrequency,
                    value: planValue,
                    status: contract.status_contrato,
                    data_termino: contract.data_termino
                };

            } catch (err) {
                // Silencia erros 404 (aluno sem contrato) para não poluir o console
                return null;
            }
        });

        const results = await Promise.all(contractsPromises);
        const activeContracts = results.filter(item => item !== null);

        // 3. Filtragem Local por Status
        let filtered = activeContracts;
        if (selectedStatus !== 'todos') {
            filtered = activeContracts.filter(p => p.status?.toLowerCase() === selectedStatus.toLowerCase());
        }

        setPlansList(filtered);

        // 4. Calcular Estatísticas
        // Consideramos apenas contratos ativos para a previsão de receita
        const totalRevenue = activeContracts
            .filter(c => c.status?.toLowerCase() === 'ativo')
            .reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
        
        const activeCount = activeContracts.filter(c => c.status?.toLowerCase() === 'ativo').length;

        setSummary({
            totalGanhos: totalRevenue,
            totalGastos: 0, // Backend não fornece
            planosAtivos: activeCount,
        });

        // 5. Dados para Gráfico de Pizza (Distribuição)
        const distMap = {};
        activeContracts.forEach(c => {
            const pName = c.plan || "Outros";
            distMap[pName] = (distMap[pName] || 0) + 1;
        });
        const distData = Object.keys(distMap).map((key, index) => ({
            name: key,
            value: distMap[key],
            color: ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"][index % 5]
        }));
        setDistribution(distData);

        // 6. Dados para Gráfico de Barras (Projeção simples)
        const currentMonthName = new Date().toLocaleString('pt-BR', { month: 'short' });
        setMonthlyChartData([
            { month: 'Mês Atual', ganhos: totalRevenue, gastos: 0 },
            { month: 'Próx. Mês', ganhos: totalRevenue, gastos: 0 }
        ]);

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setSelectedPlanId(plan.id);
    setShowEditModal(true);
  };

  const handleCancelPlan = (planId) => {
    setSelectedPlanId(planId);
    setShowCancelModal(true);
  };

  const confirmEditPlan = async (formData) => {
    setIsProcessing(true);
    try {
      // Atualiza a data de término do contrato
      await api.patch(`/contratos/${selectedPlanId}`, {
         data_termino: formData.data_termino
      });
      setShowEditModal(false);
      await loadFinancialData(); 
    } catch (error) {
      console.error("Erro ao atualizar contrato:", error);
      alert("Erro ao atualizar contrato. Verifique os dados.");
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmCancelPlan = async () => {
    setIsProcessing(true);
    try {
      // Define status como cancelado
      await api.patch(`/contratos/${selectedPlanId}`, {
        status_contrato: "cancelado"
      });
      setShowCancelModal(false);
      await loadFinancialData();
    } catch (error) {
      console.error("Erro ao cancelar contrato:", error);
      alert("Erro ao cancelar contrato.");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredPlans = plansList.filter((plan) =>
    (plan.name && plan.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (plan.plan && plan.plan.toLowerCase().includes(searchTerm.toLowerCase()))
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
                Gerencie e acompanhe as receitas e contratos do estúdio.
              </p>
            </section>

            {/* Stats Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={DollarSign}
                label="Receita Estimada (Mensal)"
                value={`R$ ${(summary.totalGanhos || 0).toLocaleString(
                  "pt-BR",
                  { minimumFractionDigits: 2 }
                )}`}
                positive={true}
                color="#10B981"
              />
              <StatCard
                icon={TrendingDown}
                label="Gastos (N/A)"
                value="R$ 0,00"
                positive={false}
                color="#EF4444"
              />
              <StatCard
                icon={TrendingUp}
                label="Saldo Estimado"
                value={`R$ ${(summary.totalGanhos || 0).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}`}
                color="#3B82F6"
              />
              <StatCard
                icon={DollarSign}
                label="Contratos Ativos"
                value={summary.planosAtivos || 0}
                color="#8B5CF6"
              />
            </section>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Monthly Revenue Chart */}
              <Card className="lg:col-span-2 p-4 sm:p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Projeção de Receita
                </h3>
                {loading ? (
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
                      <Bar dataKey="ganhos" fill="#10B981" name="Receita Est." />
                      <Bar dataKey="gastos" fill="#EF4444" name="Gastos" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Card>

              {/* Plans Distribution */}
              <Card className="p-4 sm:p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Distribuição de Contratos
                </h3>
                {loading ? (
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
                        label={({ name, value }) => `${name.substring(0, 10)}..: ${value}`}
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

            {/* Plans Table */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Gerenciamento de Contratos
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
                {loading ? (
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
                            key={plan.id} // Use uma chave única aqui
                            plan={plan}
                            onEdit={handleEditPlan}
                            onCancel={handleCancelPlan}
                            isLoading={isProcessing}
                            editingId={selectedPlanId}
                            cancelingId={selectedPlanId}
                          />
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-3 sm:px-6 py-8 text-center text-gray-500"
                          >
                            Nenhum contrato encontrado
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