import api from './api';

// Cache para evitar chamadas repetidas
let cachedPlans = null;
let cachedStudents = null; 

// Função auxiliar para buscar o nome do plano pelo ID
const getPlanName = async (planId) => {
    if (!planId) return null;
    try {
        if (!cachedPlans) {
            const response = await api.get('/planos/geral');
            cachedPlans = response.data;
        }
        // Tenta encontrar pelo id_plano (back) ou id (front)
        const plan = cachedPlans.find(p => (p.id_plano || p.id) === planId);
        return plan ? (plan.descricao_plano || plan.nome) : `Plano ${planId}`;
    } catch (error) {
        return `Plano ${planId}`;
    }
};

// Função para buscar nome do estudante
// Resolve o problema de IDs trocados (ID Estudante vs ID Usuário)
const getStudentName = async (studentIdFK) => {
    if (!studentIdFK) return "Estudante Desconhecido";
    
    try {
        // Se ainda não temos a lista de alunos em cache, buscamos do back
        if (!cachedStudents) {
            console.log("[DEBUG] Buscando lista completa de alunos para mapear IDs...");
            // Assume que existe uma rota que lista todos os alunos.
            // Se essa rota falhar (403/404), o catch vai capturar.
            const response = await api.get('/alunos/'); 
            cachedStudents = response.data || [];
        }

        // A MÁGICA: Procura na lista qual usuário tem o 'estudante.id_estudante' igual ao ID da solicitação
        // ou se o próprio id_user bate com o ID da solicitação (para garantir)
        const foundUser = cachedStudents.find(user => 
            (user.estudante && user.estudante.id_estudante === studentIdFK) ||
            (user.id_user === studentIdFK)
        );

        if (foundUser) {
            return foundUser.name_user; // Retorna o nome correto (ex: Gabriel Marques)
        }

        // Tentativa de fallback: busca direta pelo ID (caso o ID da solicitação seja o ID do usuário)
        try {
             const response = await api.get(`/alunos/${studentIdFK}`);
             if (response.data && response.data.name_user) {
                 return response.data.name_user;
             }
        } catch (e) {
            // Ignora erro aqui
        }

        // Fallback final se nada funcionar
        return `Estudante (ID: ${studentIdFK})`;

    } catch (error) {
        // Log discreto para não poluir o console se a rota de lista não existir
        console.warn("[DEBUG] Não foi possível mapear nome do aluno pela lista:", error.message);
        return `Estudante (ID: ${studentIdFK})`;
    }
};

export const alertasService = {
  // Busca alertas (Solicitações)
  getAlerts: async (studioId = null) => {
    try {
        const url = studioId ? `/solicitacao/?studio_id=${studioId}` : '/solicitacao/';
        const response = await api.get(url);
        const allRequests = response.data || [];

        const planAlerts = [];
        const replacementAlerts = [];

        // Processa todas as solicitações em paralelo para montar os textos
        await Promise.all(allRequests.map(async (req) => {
            const studentName = await getStudentName(req.fk_id_estudante);
            let alertText = req.menssagem; 

            // Formata o texto dependendo do tipo
            if (req.tipo_de_solicitacao === 'plano' && req.fk_id_novo_plano) {
                const planName = await getPlanName(req.fk_id_novo_plano);
                alertText = `${studentName} quer mudar para o plano: ${planName}`;
            } else if (req.tipo_de_solicitacao === 'plano') {
                alertText = `${studentName} solicitou mudança de plano.`;
            } else {
                // Formata a data se existir
                const dateText = req.data_sugerida ? ` para ${new Date(req.data_sugerida).toLocaleDateString()}` : "";
                alertText = `${studentName} quer repor aula${dateText}`;
            }

            const alertObj = {
                id: req.id_solicitacao,
                type: req.tipo_de_solicitacao, // 'plano' ou 'aula'
                text: alertText,
                studentId: req.fk_id_estudante,
                details: { ...req }
            };

            // Filtra apenas as que estão "em espera"
            if (req.status_solicitacao === 'em espera' || !req.status_solicitacao) {
                if (req.tipo_de_solicitacao === 'plano') {
                    planAlerts.push(alertObj);
                } else {
                    replacementAlerts.push(alertObj);
                }
            }
        }));

        return { planAlerts, replacementAlerts };

    } catch (error) {
        console.error("Erro ao buscar alertas:", error);
        throw error;
    }
  },

  // --- AÇÕES REAIS (INTEGRADAS) ---

  // Aceitar Solicitação -> status: "atendida"
  acceptAlert: async (id, type) => {
    console.log(`[API] Aceitando solicitação ${id}...`);
    try {
        // Rota conforme documentação
        await api.put(`/solicitacao/${id}/resolucao`, null, {
            params: {
                status_solicitacao: 'atendida'
            }
        });
        return true;
    } catch (error) {
        console.error("Erro ao aceitar solicitação:", error);
        throw error;
    }
  },

  // Recusar Solicitação -> status: "recusada"
  rejectAlert: async (id, type) => {
    console.log(`[API] Recusando solicitação ${id}...`);
    try {
        // Rota conforme documentação
        await api.put(`/solicitacao/${id}/resolucao`, null, {
            params: {
                status_solicitacao: 'recusada'
            }
        });
        return true;
    } catch (error) {
        console.error("Erro ao recusar solicitação:", error);
        throw error;
    }
  }
};