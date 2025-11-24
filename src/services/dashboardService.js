// @ts-nocheck
import apiClient from "./apiClient";

export const dashboardService = {
  getDashboardData: async () => {
    try {
      const response = await apiClient.get("/admin/dashboard");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
      throw error;
    }
  },

  getStudentsList: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get(
        `/admin/students?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar lista de estudantes:", error);
      throw error;
    }
  },

  getCollaboratorsList: async () => {
    try {
      const response = await apiClient.get("/admin/collaborators");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar lista de colaboradores:", error);
      throw error;
    }
  },

  getScheduledClasses: async (date) => {
    try {
      const response = await apiClient.get(`/admin/classes?date=${date}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar aulas agendadas:", error);
      throw error;
    }
  },

  getAlerts: async () => {
    try {
      const response = await apiClient.get("/admin/alerts");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar alertas:", error);
      throw error;
    }
  },

  getFinancialData: async () => {
    try {
      const response = await apiClient.get("/admin/financial");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados financeiros:", error);
      throw error;
    }
  },

  acceptAlert: async (alertId) => {
    try {
      const response = await apiClient.post(`/admin/alerts/${alertId}/accept`);
      return response.data;
    } catch (error) {
      console.error("Erro ao aceitar alerta:", error);
      throw error;
    }
  },

  rejectAlert: async (alertId) => {
    try {
      const response = await apiClient.post(`/admin/alerts/${alertId}/reject`);
      return response.data;
    } catch (error) {
      console.error("Erro ao rejeitar alerta:", error);
      throw error;
    }
  },

  getStudentProfile: async () => {
    try {
      const response = await apiClient.get("/student/profile");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar perfil do estudante:", error);
      throw error;
    }
  },

  getStudentSchedule: async () => {
    try {
      const response = await apiClient.get("/student/schedule");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar agenda do estudante:", error);
      throw error;
    }
  },

  getStudentEvolution: async () => {
    try {
      const response = await apiClient.get("/student/evolution");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar evolução do estudante:", error);
      throw error;
    }
  },

  getCurrentInvoice: async () => {
    try {
      const response = await apiClient.get("/student/invoices/current");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar fatura atual:", error);
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
};
