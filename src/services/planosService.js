import api from './api';

export const planosService = {
  // Busca todos os planos disponíveis
  getAvailablePlans: async () => {
    try {
      const response = await api.get('/planos/geral');
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar planos disponíveis:", error);
      return [];
    }
  },

  // Busca o plano ATUAL do aluno logado
  getCurrentPlan: async () => {
    try {
      // Rota para pegar o contrato ativo
      const response = await api.get('/planos/my-active-plano');
      const data = response.data;

      if (!data || !data.detalhes_plano) {
        return null;
      }

      const detalhes = data.detalhes_plano;

      // Traduz os dados do back para o front
      return {
        id: data.id_contrato,
        name: detalhes.descricao_plano || detalhes.nome_plano || "Plano sem nome",
        price: `R$ ${detalhes.valor_final_contrato}`, 
        frequency: detalhes.modalidade ? detalhes.modalidade.replace(/_/g, ' ') : "Frequência não informada",
        benefits: [
            `Total de aulas: ${detalhes.qtde_aulas_totais_plano}`,
            `Status: ${data.status_contrato}`,
            data.data_termino ? `Vence em: ${new Date(data.data_termino).toLocaleDateString('pt-BR')}` : "Sem data de término",
            "Acesso aos equipamentos"
        ]
      };

    } catch (error) {
      console.error("Erro ao buscar plano atual:", error);
      return null;
    }
  },
  
  // Enviar solicitação de mudança
  // ROTA CORRIGIDA conforme a imagem: createSolcicitacao (sic)
  requestPlanChange: async (payload) => {
      return api.post('/solicitacao/createSolcicitacao', payload);
  }
};