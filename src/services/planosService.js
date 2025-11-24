// @ts-nocheck
import apiClient from "./apiClient";

export const planosService = {
  getCurrentPlan: async () => {
    try {
      const response = await apiClient.get("/student/plans/current");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar plano atual:", error);
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  getAvailablePlans: async () => {
    try {
      const response = await apiClient.get("/plans");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar planos disponíveis:", error);
      throw error;
    }
  },

  requestPlanChange: async (planId) => {
    try {
      const response = await apiClient.post("/student/plans/change-request", {
        planId,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao solicitar mudança de plano:", error);
      throw error;
    }
  },

  getPlanChangeHistory: async () => {
    try {
      const response = await apiClient.get("/student/plans/change-history");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar histórico de planos:", error);
      throw error;
    }
  },
};
