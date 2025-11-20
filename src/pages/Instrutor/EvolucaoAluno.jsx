// @ts-nocheck
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
// --- API FUTURA: Descomente para usar ---
// import axios from "axios";

import { Card, CardContent } from "@/components/ui/Content/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  User,
  FileText,
  BookOpen,
  Image as ImageIcon,
  Plus,
  Trash2,
} from "lucide-react";
import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import { useSidebar } from "@/context/SidebarContext";

// =======================================================================
// CONFIGURAÇÃO DA API E MOCKS
// =======================================================================

// 🚀 Alterne para 'false' para usar a API real
const USE_MOCKS = true;

// --- API FUTURA: Configure sua URL base ---
const API_BASE_URL = import.meta.env.VITE_API_BASE || "";
const ENDPOINTS = {
  // Endpoint para o instrutor buscar SEUS alunos
  MEUS_ALUNOS: "/api/instrutor/meus-alunos", 
  // Endpoint para buscar/atualizar dados de UM aluno
  EVOLUCAO_ALUNO: (alunoId) => `/api/evolucao/${alunoId}`,
};

// --- MOCK: Lista de alunos do instrutor ---
const mockAlunosInstrutor = [
  { id: 1, nome: "João Silva", modalidade: "Pilates", reavaliacao: "12/03/2025", email: "joao@email.com", telefone: "11 99999-1111" },
  { id: 2, nome: "Maria Souza", modalidade: "Pilates", reavaliacao: "10/04/2025", email: "maria@email.com", telefone: "11 88888-2222" },
  { id: 3, nome: "Lucas Almeida", modalidade: "Pilates", reavaliacao: "29/04/2025", email: "lucas@email.com", telefone: "11 77777-3333" },
];

// --- MOCK: "Banco de dados" de evolução por ID ---
const MOCK_DADOS_EVOLUCAO = {
  1: { // João
    evolucaoGrafico: [ { mes: "Jan", valor: 20 }, { mes: "Fev", valor: 28 } ],
    observacoes: "João: Focou na respiração. Boa evolução no controle do core.",
    feedback: "João: Continuar focado nos exercícios de fortalecimento.",
    caracteristicas: [
      { id: "flexibilidade", label: "Flexibilidade", value: "Melhorou 10%" },
      { id: "postura", label: "Postura", value: "Corrigida" },
    ],
  },
  2: { // Maria
    evolucaoGrafico: [ { mes: "Jan", valor: 30 }, { mes: "Fev", valor: 35 }, { mes: "Mar", valor: 42 } ],
    observacoes: "Maria: Excelente controle e fluidez no Reformer.",
    feedback: "Maria: Pode avançar para exercícios de nível intermediário/avançado.",
    caracteristicas: [
      { id: "flexibilidade", label: "Flexibilidade", value: "Excelente" },
      { id: "forca", label: "Força", value: "Aumentou 20%" },
    ],
  },
  3: { // Lucas
    evolucaoGrafico: [ { mes: "Fev", valor: 15 }, { mes: "Mar", valor: 25 } ],
    observacoes: "Lucas: Apresentou leve dor no ombro esquerdo durante a aula.",
    feedback: "Lucas: Focar em adaptar exercícios para não sobrecarregar o ombro.",
    caracteristicas: [ { id: "postura", label: "Postura", value: "Em correção" } ],
  },
};

const CHART_COLORS = ["#81C784", "#4DB6AC", "#4DD0E1", "#00BCD4"];

// =======================================================================
// FUNÇÕES DE SERVIÇO DA API (Abstração)
// =======================================================================

/**
 * --- API FUTURA: Obtém o token de autenticação (ex: do localStorage) ---
 * Esta é a função que verifica o token de quem está cadastrado.
 */
const getToken = () => {
  // No futuro, isso pode vir de um Contexto (useAuth)
  const token = localStorage.getItem("token");
  if (!token) {
    // Redireciona para o login ou lança erro
    console.warn("Nenhum token encontrado. Acesso não autorizado.");
    // throw new Error("Usuário não autenticado."); // Descomente na API real
  }
  return token;
};

/**
 * Busca a lista de alunos associados ao instrutor logado.
 */
const apiFetchAlunosInstrutor = async () => {
  if (USE_MOCKS) {
    await new Promise(res => setTimeout(res, 500)); // Simula delay
    return mockAlunosInstrutor;
  }

  // --- API REAL ---
  // const token = getToken();
  // const { data } = await axios.get(
  //   `${API_BASE_URL}${ENDPOINTS.MEUS_ALUNOS}`,
  //   { headers: { Authorization: `Bearer ${token}` } }
  // );
  // return data;
  
  // Placeholder (remover ao usar axios)
  return [];
};

/**
 * Busca os dados de evolução de um aluno específico.
 */
const apiFetchEvolucaoAluno = async (alunoId) => {
  if (USE_MOCKS) {
    await new Promise(res => setTimeout(res, 800)); // Simula delay
    return MOCK_DADOS_EVOLUCAO[alunoId] || { evolucaoGrafico: [], observacoes: "Aluno sem dados.", feedback: "", caracteristicas: [] };
  }

  // --- API REAL ---
  // const token = getToken();
  // const { data } = await axios.get(
  //   `${API_BASE_URL}${ENDPOINTS.EVOLUCAO_ALUNO(alunoId)}`,
  //   { headers: { Authorization: `Bearer ${token}` } }
  // );
  // return data;
  
  // Placeholder (remover ao usar axios)
  return { evolucaoGrafico: [], observacoes: "", feedback: "", caracteristicas: [] };
};

/**
 * Salva (PUT/POST) os dados de evolução de um aluno.
 */
const apiSaveEvolucaoAluno = async (alunoId, payload) => {
  if (USE_MOCKS) {
    await new Promise(res => setTimeout(res, 1000));
    console.log("MOCK SAVE [Payload]:", payload);
    // Atualiza o mock em memória (opcional)
    MOCK_DADOS_EVOLUCAO[alunoId] = { ...MOCK_DADOS_EVOLUCAO[alunoId], ...payload };
    return { success: true, data: payload };
  }
  
  // --- API REAL ---
  // const token = getToken();
  // const { data } = await axios.put(
  //   `${API_BASE_URL}${ENDPOINTS.EVOLUCAO_ALUNO(alunoId)}`,
  //   payload,
  //   { headers: { Authorization: `Bearer ${token}` } }
  // );
  // return data;
  
  // Placeholder (remover ao usar axios)
  return { success: true };
};

// =======================================================================
// COMPONENTE PRINCIPAL
// =======================================================================
export default function EvolucaoInstrutor() {
  const navigate = useNavigate();
  const { isMobile, sidebarWidth } = useSidebar();
  
  // Estados de UI
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Estados da Lista de Alunos
  const [alunos, setAlunos] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [loadingAlunos, setLoadingAlunos] = useState(false);
  const [alunosError, setAlunosError] = useState(null);
  
  // Estados dos Dados da Evolução
  const [loadingDados, setLoadingDados] = useState(false);
  const [dadosError, setDadosError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estados do Formulário
  const [data, setData] = useState([]);
  const [observacoes, setObservacoes] = useState("");
  const [feedback, setFeedback] = useState("");
  const [caracteristicas, setCaracteristicas] = useState([]);
  
  // Estados para adicionar novos pontos no gráfico
  const [newMes, setNewMes] = useState("");
  const [newValor, setNewValor] = useState("");

  
  // --- EFEITO 1: Buscar a lista de alunos do instrutor ---
  useEffect(() => {
    const fetchAlunos = async () => {
      setLoadingAlunos(true);
      setAlunosError(null);
      try {
        const data = await apiFetchAlunosInstrutor();
        setAlunos(data);
      } catch (err) {
        setAlunosError("Falha ao carregar lista de alunos. " + err.message);
      } finally {
        setLoadingAlunos(false);
      }
    };
    fetchAlunos();
  }, []); // Roda apenas uma vez

  
  // --- EFEITO 2: Carregar dados quando um aluno é selecionado ---
  useEffect(() => {
    // Função para limpar os dados
    const clearData = () => {
      setData([]);
      setObservacoes("");
      setFeedback("");
      setCaracteristicas([]);
      setDadosError(null);
    };
    
    // Função para buscar os dados do aluno
    const carregarDadosDoAluno = async (aluno) => {
      if (!aluno) {
        clearData();
        return;
      }
      
      setLoadingDados(true);
      setDadosError(null);
      try {
        const dados = await apiFetchEvolucaoAluno(aluno.id);
        
        // Normaliza dados do gráfico
        const chartNormalized = (dados.evolucaoGrafico || []).map((item, index) => ({
          name: item.mes,
          desempenho: item.valor,
          fill: CHART_COLORS[index % CHART_COLORS.length],
        }));
        
        setData(chartNormalized);
        setObservacoes(dados.observacoes || "");
        setFeedback(dados.feedback || "");
        setCaracteristicas(dados.caracteristicas || []);

      } catch (err) {
        setDadosError("Falha ao carregar dados do aluno. " + err.message);
        clearData(); // Limpa os dados se houver erro
      } finally {
        setLoadingDados(false);
      }
    };
    
    carregarDadosDoAluno(alunoSelecionado);
  }, [alunoSelecionado]); // Roda toda vez que 'alunoSelecionado' mudar

  
  // --- Funções do Formulário (Handlers) ---

  const yDomain = useMemo(() => {
    if (!data.length) return [0, "auto"];
    const values = data.map((d) => Number(d.desempenho));
    return [0, Math.max(...values) + 10];
  }, [data]);

  const addCaracteristica = () => {
    setCaracteristicas((prev) => [
      ...prev,
      { id: `extra_${Date.now()}`, label: `Nova Característica`, value: "" },
    ]);
  };

  const removeCaracteristica = (id) => {
    setCaracteristicas((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCaracteristica = (id, field, value) => {
    setCaracteristicas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const addPontoDesempenho = () => {
    if (!newMes.trim() || !newValor) return;
    const novo = {
      name: newMes,
      desempenho: Number(newValor),
      fill: CHART_COLORS[data.length % CHART_COLORS.length],
    };
    setData((prev) => [...prev, novo]);
    setNewMes("");
    setNewValor("");
  };

  // --- Handler para Salvar (Chamada de API) ---
  const handleSalvar = async () => {
    if (!alunoSelecionado || isSaving) return;
    
    setIsSaving(true);
    setDadosError(null); // Limpa erros antigos

    // Monta o payload para a API
    const payload = {
      observacoes,
      feedback,
      // Garante que o 'label' seja salvo junto
      caracteristicas: caracteristicas.map(c => ({ 
        id: c.id, 
        label: c.label, 
        value: c.value 
      })),
      // Salva os dados brutos do gráfico
      evolucaoGrafico: data.map(d => ({ mes: d.name, valor: d.desempenho })),
    };
    
    try {
      await apiSaveEvolucaoAluno(alunoSelecionado.id, payload);
      alert("Evolução salva com sucesso!");
    } catch (err) {
      alert("Erro ao salvar evolução. " + err.message);
      setDadosError("Erro ao salvar: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarUnificada
        menuItems={sidebarConfigs.instrutor?.menuItems}
        userInfo={sidebarConfigs.instrutor?.userInfo}
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
        <main className="flex-1 p-4 md:p-8">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
            Evolução dos Alunos (Instrutor)
          </h1>

          {/* === Bloco de Seleção de Aluno === */}
          <Card className="shadow-md border-none mb-6">
            <CardContent className="p-4 md:p-6">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Selecione um aluno:
              </p>
              
              {loadingAlunos && <p className="text-sm text-gray-600">Carregando lista de alunos...</p>}
              
              {alunosError && <p className="text-sm text-red-600 font-medium">{alunosError}</p>}
              
              {!loadingAlunos && !alunosError && (
                <select
                  className="w-full p-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    const selectedId = Number(e.target.value);
                    const selected = alunos.find(a => a.id === selectedId);
                    setAlunoSelecionado(selected || null);
                  }}
                  defaultValue=""
                  aria-label="Selecionar Aluno"
                >
                  <option value="" disabled>Escolher aluno...</option>
                  {alunos.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nome}
                    </option>
                  ))}
                </select>
              )}
            </CardContent>
          </Card>

          {/* === Mensagem Padrão (Sem aluno) === */}
          {!alunoSelecionado && !loadingAlunos && (
            <p className="text-center text-gray-500 mt-10 p-4 bg-white rounded-lg shadow-sm">
              Selecione um aluno acima para ver e editar sua evolução.
            </p> 
          )}
          
          {/* === Bloco Principal de Evolução (Condicional) === */}
          {alunoSelecionado && (
            <Card className="shadow-lg rounded-lg border-none overflow-hidden">
              <CardContent className="flex flex-col p-0">
                
                {/* --- Info do Aluno --- */}
                <div className="flex flex-col sm:flex-row p-4 md:p-6 gap-6 relative border-b">
                   <p className="absolute top-2 right-4 text-xs text-red-600 font-medium">
                     *Reavaliação: {alunoSelecionado.reavaliacao}
                   </p>
                   {/* Avatar: Centralizado no mobile, esquerda no desktop */}
                   <div className="w-20 h-20 bg-gray-300 rounded-lg flex items-center justify-center mx-auto sm:mx-0 shrink-0">
                     <User className="w-10 h-10 text-white" />
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm flex-1">
                     <div>
                       <p className="text-gray-500 text-xs">Nome completo</p>
                       <p className="font-semibold text-gray-900">{alunoSelecionado.nome}</p>
                     </div>
                     <div>
                       <p className="text-gray-500 text-xs">Modalidade</p>
                       <p className="font-semibold text-gray-900">
                         {alunoSelecionado.modalidade}
                       </p>
                     </div>
                     <div>
                       <p className="text-gray-500 text-xs">Email</p>
                       <p className="text-gray-800">{alunoSelecionado.email}</p>
                     </div>
                     <div>
                       <p className="text-gray-500 text-xs">Telefone</p>
                       <p className="text-gray-800">{alunoSelecionado.telefone}</p>
                     </div>
                   </div>
                </div>

                {/* --- Botões de Navegação --- */}
                <div className="px-4 pb-4 border-b pt-4 grid grid-cols-3 gap-3">
                  {[
                    { path: `/instrutor/aluno/${alunoSelecionado.id}/atestados`, icon: <FileText className="w-5 h-5 mb-1" />, label: "Atestados" },
                    { path: `/instrutor/aluno/${alunoSelecionado.id}/aulas`, icon: <BookOpen className="w-5 h-5 mb-1" />, label: "Aulas" },
                    { path: `/instrutor/aluno/${alunoSelecionado.id}/fotos`, icon: <ImageIcon className="w-5 h-5 mb-1" />, label: "Fotos" },
                  ].map((btn, i) => (
                    <div
                      key={i}
                      role="button"
                      tabIndex={0}
                      onClick={() => 
                        navigate(btn.path, { 
                          state: { 
                            alunoId: alunoSelecionado.id, 
                            alunoNome: alunoSelecionado.nome 
                          } 
                        })
                      }
                      onKeyDown={(e) => e.key === 'Enter' && navigate(btn.path, { state: { alunoId: alunoSelecionado.id, alunoNome: alunoSelecionado.nome } })}
                      className="flex flex-col items-center p-3 text-center border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition text-gray-700"
                    >
                      {btn.icon}
                      <span className="text-xs font-medium">{btn.label}</span>
                    </div>
                  ))}
                </div>
                
                {/* --- Estados de Loading/Error dos Dados --- */}
                {loadingDados && (
                  <p className="p-8 text-center text-gray-600">Carregando dados da evolução...</p>
                )}
                
                {dadosError && (
                  <p className="p-8 text-center text-red-600 font-medium">{dadosError}</p>
                )}

                {/* --- Conteúdo Principal (Gráfico e Formulários) --- */}
                {!loadingDados && !dadosError && (
                  <div className="bg-gray-50">
                    <div className="flex flex-col lg:flex-row p-4 md:p-8 gap-6">
                      
                      {/* Coluna Esquerda: Gráfico */}
                      <div className="lg:w-1/2 bg-white rounded-lg p-4 shadow border">
                        <h2 className="font-semibold text-lg mb-4 text-center text-gray-800">
                          Desempenho
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={data} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                            <YAxis domain={yDomain} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                            <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "4px" }} labelStyle={{ fontWeight: "bold" }} />
                            <Bar dataKey="desempenho" radius={[6, 6, 0, 0]}>
                              {data.map((entry, i) => (
                                <Cell key={i} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                        
                        {/* 📱 MELHORIA RESPONSIVA: Inputs do Gráfico */}
                        <div className="mt-4 flex flex-col sm:flex-row gap-3">
                          <input
                            className="border p-2 rounded w-full sm:flex-1 text-sm"
                            placeholder="Mês (ex: Abr)"
                            value={newMes}
                            onChange={(e) => setNewMes(e.target.value)}
                          />
                          <input
                            className="border p-2 rounded w-full sm:flex-1 text-sm"
                            placeholder="Valor (ex: 30)"
                            type="number"
                            value={newValor}
                            onChange={(e) => setNewValor(e.target.value)}
                          />
                          <button
                            onClick={addPontoDesempenho}
                            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm flex items-center justify-center gap-1 w-full sm:w-auto"
                          >
                            <Plus size={16} /> Add
                          </button>
                        </div>
                      </div>

                      {/* Coluna Direita: Formulários */}
                      <div className="lg:w-1/2 bg-white rounded-lg shadow p-5 border">
                        <h2 className="font-semibold text-lg mb-2 text-gray-800">Observações</h2>
                        <textarea
                          className="w-full border rounded p-2 text-sm h-24"
                          value={observacoes}
                          onChange={(e) => setObservacoes(e.target.value)}
                          placeholder="Digite as observações do instrutor..."
                        />
                        <h3 className="font-semibold text-lg mt-4 mb-2 text-gray-800">Feedback</h3>
                        <textarea
                          className="w-full border rounded p-2 text-sm h-24"
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="Digite o feedback para o aluno..."
                        />
                        <h3 className="font-semibold text-lg mt-4 mb-2 text-gray-800">
                          Características
                        </h3>
                        {caracteristicas.map((char) => (
                          <div key={char.id} className="flex gap-2 mb-2">
                            {/* Input para o Label (se for 'extra') */}
                            {char.id.startsWith("extra_") ? (
                              <input
                                className="w-2/5 border p-2 rounded text-sm bg-gray-50"
                                placeholder="Rótulo (ex: Força)"
                                value={char.label}
                                onChange={(e) =>
                                  updateCaracteristica(char.id, 'label', e.target.value)
                                }
                              />
                            ) : (
                              <span className="w-2/5 p-2 text-sm text-gray-600">{char.label}:</span>
                            )}
                            
                            {/* Input para o Valor */}
                            <input
                              className="flex-1 border p-2 rounded text-sm"
                              placeholder="Valor (ex: Bom)"
                              value={char.value}
                              onChange={(e) =>
                                updateCaracteristica(char.id, 'value', e.target.value)
                              }
                            />
                            {char.id.startsWith("extra_") && (
                              <button
                                onClick={() => removeCaracteristica(char.id)}
                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
                                aria-label="Remover característica"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={addCaracteristica}
                          className="mt-3 p-2 w-full bg-blue-500 hover:bg-blue-600 rounded text-white text-sm flex items-center justify-center gap-1"
                        >
                          <Plus size={16} /> Adicionar característica
                        </button>
                      </div>
                    </div>

                    {/* Botão Salvar (Fora das colunas) */}
                    <div className="px-4 md:px-8 pb-6">
                      <button
                        onClick={handleSalvar}
                        disabled={isSaving}
                        className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded text-white font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {isSaving ? "Salvando..." : "Salvar Evolução"}
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

        </main>
      </div>
    </div>
  );
}