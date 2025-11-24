// @ts-nocheck
import apiClient from "./apiClient";

export const faturasService = {
  getFaturas: async (page = 1, limit = 10, status = null) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      if (status) {
        params.append("status", status);
      }
      const response = await apiClient.get(
        `/student/invoices?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar faturas:", error);
      throw error;
    }
  },

  getFaturaById: async (faturaId) => {
    try {
      const response = await apiClient.get(`/student/invoices/${faturaId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar fatura:", error);
      throw error;
    }
  },

  downloadFatura: async (faturaId) => {
    try {
      const response = await apiClient.get(
        `/student/invoices/${faturaId}/download`,
        {
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao baixar fatura:", error);
      throw error;
    }
  },

  viewFatura: async (faturaId) => {
    try {
      const response = await apiClient.get(
        `/student/invoices/${faturaId}/view`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao visualizar fatura:", error);
      throw error;
    }
  },
};
