import api from './api';

// Cache simples para evitar buscar planos e alunos repetidamente
let cachedPlans = null;
const studentCache = {};

// Função auxiliar para buscar o nome do plano pelo ID
const getPlanName = async (planId) => {
    if (!planId) return null;
    
    try {
        if (!cachedPlans) {
            const response = await api.get('/planos/geral');
            cachedPlans = response.data;
        }
        
        const plan = cachedPlans.find(p => (p.id_plano || p.id) === planId);
        return plan ? (plan.descricao_plano || plan.nome) : `Plano ${planId}`;
    } catch (error) {
        console.error("Erro ao buscar detalhes do plano:", error);
        return `Plano ${planId}`;
    }
};

// Função auxiliar para buscar nome do estudante
const getStudentName = async (studentId) => {
    if (!studentId) return "Estudante Desconhecido";
    
    if (studentCache[studentId]) {
        return studentCache[studentId];
    }
    
    try {
        // Tenta buscar o aluno
        const response = await api.get(`/alunos/${studentId}`);
        const name = response.data.name_user;
        
        if (name) {
            studentCache[studentId] = name;
            return name;
        }
        
        return `Estudante (ID: ${studentId})`; 
    } catch (error) {
        // Tratamento específico para 404 (Não Encontrado)
        if (error.response && error.response.status === 404) {
            console.warn(`[INFO] Aluno ID ${studentId} não encontrado no banco.`);
            return `Estudante (ID: ${studentId})`;
        }

        console.error(`[ERRO] Falha ao buscar nome do aluno ${studentId}:`, error.message);
        return `Estudante (ID: ${studentId})`;
    }
};

export const alertasService = {
  getAlerts: async (studioId = null) => {
    try {
        const url = studioId ? `/solicitacao/?studio_id=${studioId}` : '/solicitacao/';
        const response = await api.get(url);
        const allRequests = response.data || [];

        console.log("[DEBUG] Solicitações recebidas do backend:", allRequests); // <--- OLHE ESTE LOG NO CONSOLE

        const planAlerts = [];
        const replacementAlerts = [];

        await Promise.all(allRequests.map(async (req) => {
            // Log para conferir o ID que está vindo em CADA solicitação
            console.log(`[DEBUG] Processando solicitação ID ${req.id_solicitacao}. fk_id_estudante: ${req.fk_id_estudante}`);

            const studentName = await getStudentName(req.fk_id_estudante);
            
            let alertText = req.menssagem; 

            if (req.tipo_de_solicitacao === 'plano' && req.fk_id_novo_plano) {
                const planName = await getPlanName(req.fk_id_novo_plano);
                alertText = `${studentName} quer mudar para o plano: ${planName}`;
            } else if (req.tipo_de_solicitacao === 'plano') {
                alertText = `${studentName} solicitou mudança de plano.`;
            } else {
                const dateText = req.data_sugerida ? ` para ${new Date(req.data_sugerida).toLocaleDateString()}` : "";
                alertText = `${studentName} quer repor aula${dateText}`;
            }

            const alertObj = {
                id: req.id_solicitacao,
                type: req.tipo_de_solicitacao,
                text: alertText,
                studentId: req.fk_id_estudante,
                details: { ...req }
            };

            if (req.tipo_de_solicitacao === 'plano') {
                planAlerts.push(alertObj);
            } else {
                replacementAlerts.push(alertObj);
            }
        }));

        return { planAlerts, replacementAlerts };

    } catch (error) {
        console.error("Erro ao buscar alertas:", error);
        throw error;
    }
  },

  acceptAlert: async (id, type) => {
    console.log(`[API] Aceitando solicitação ${id}`);
    // await api.post(`/solicitacao/${id}/aceitar`); 
    return true; 
  },

  rejectAlert: async (id, type) => {
    console.log(`[API] Recusando solicitação ${id}`);
    // await api.post(`/solicitacao/${id}/recusar`);
    return true;
  }
};