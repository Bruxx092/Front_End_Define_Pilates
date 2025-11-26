// @ts-nocheck
// import apiClient from "./api";
import api from "./api";


export const planosService = {
  getCurrentPlan: async () => {
    try {
      const response = await api.get("/planos/my-active-plano");
      // console.log(response.data)
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
      const response = await api.get("/planos/geral");
      if (response){
        return response.data;
      }
    } catch (error) {
      console.error("Erro ao buscar planos disponíveis:", error);
      throw error;
    }
  },

  requestPlanChange: async (menssagem, planId) => {
    try {
      // const tipo_solcitacao = 'plano'
      // const acao_solcitacao_plano ='MUDANCA_PLANO'
      // const acao_solcitacao_aula =null
      // const fk_id_aula_referencia=null
      // const data_sugerida=null
      // const plano_padrao_id = planId
      // const plano_personalizado=null
      // const fk_id_novo_plano=planId

      const request_new_plano={
        "menssagem": menssagem,
        "tipo_de_solicitacao": 'plano',
        "acao_solicitacao_plano": 'MUDANCA_PLANO',
        "acao_solicitacao_aula": null,
        "fk_id_aula_referencia": null,
        "data_sugerida": null,
        "fk_id_novo_plano": planId,
        "fk_id_novo_plano_personalizado": null,
      }
      const response = await api.post("/solicitacao/createSolcicitacao", 
        request_new_plano
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao solicitar mudança de plano:", error);
      throw error;
    }
  },

  getPlanChangeHistory: async () => {
    try {
      const response = await api.get("/student/plans/change-history");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar histórico de planos:", error);
      throw error;
    }
  },
};
