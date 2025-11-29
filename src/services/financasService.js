// @ts-nocheck
import apiClient from "./apiClient";

export const financasService = {
  async getFinancialSummary(month, year) {
    try {
      const data = await apiClient.get(
        `/financas/resumo?month=${month}&year=${year}`
      );
      return data;
    } catch (error) {
      console.error("Erro ao buscar resumo financeiro:", error);
      throw error;
    }
  },

  async getMonthlyData(months = 6) {
    try {
      const data = await apiClient.get(`/financas/grafico?months=${months}`);
      return data;
    } catch (error) {
      console.error("Erro ao buscar dados mensais:", error);
      throw error;
    }
  },

  async getPlansDistribution() {
    try {
      const data = await apiClient.get("/financas/distribuicao-planos");
      return data;
    } catch (error) {
      console.error("Erro ao buscar distribuição de planos:", error);
      throw error;
    }
  },

  async getPlans(status = "todos", search = "") {
    try {
      const data = await apiClient.get(
        `/planos?status=${status}&search=${search}`
      );
      return data;
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
      throw error;
    }
  },

  async updatePlan(planId, planData) {
    try {
      const data = await apiClient.put(`/planos/${planId}`, planData);
      return data;
    } catch (error) {
      console.error("Erro ao atualizar plano:", error);
      throw error;
    }
  },

  async cancelPlan(planId) {
    try {
      const data = await apiClient.delete(`/planos/${planId}`);
      return data;
    } catch (error) {
      console.error("Erro ao cancelar plano:", error);
      throw error;
    }
  },

  async getRefunds() {
    try {
      const data = await apiClient.get("/financas/devolucoes");
      return data;
    } catch (error) {
      console.error("Erro ao buscar devoluções:", error);
      throw error;
    }
  },
};
