// @ts-nocheck
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios"; // --- API FUTURA: Descomente para usar ---

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

// (Mock da lista de alunos não muda)
const mockAlunosInstrutor = [
  { id: 1, nome: "João Silva", modalidade: "Pilates", reavaliacao: "12/03/2025", email: "joao@email.com", telefone: "11 99999-1111" },
  { id: 2, nome: "Maria Souza", modalidade: "Pilates", reavaliacao: "10/04/2025", email: "maria@email.com", telefone: "11 88888-2222" },
  { id: 3, nome: "Lucas Almeida", modalidade: "Pilates", reavaliacao: "29/04/2025", email: "lucas@email.com", telefone: "11 77777-3333" },
];

// ALTERAÇÃO 1: Crie um "banco de dados" de mocks usando o ID do aluno como chave
const MOCK_DADOS_EVOLUCAO = {
  // Dados para João Silva (ID: 1)
  1: {
    evolucaoGrafico: [
      { mes: "Jan", valor: 20 },
      { mes: "Fev", valor: 28 },
    ],
    observacoes: "João: Focou na respiração. Boa evolução no controle do core.",
    feedback: "João: Continuar focado nos exercícios de fortalecimento.",
    caracteristicas: [
      { id: "flexibilidade", label: "Flexibilidade", value: "Melhorou 10%" },
      { id: "postura", label: "Postura", value: "Corrigida" },
    ],
  },
  // Dados para Maria Souza (ID: 2)
  2: {
    evolucaoGrafico: [
      { mes: "Jan", valor: 30 },
      { mes: "Fev", valor: 35 },
      { mes: "Mar", valor: 42 },
    ],
    observacoes: "Maria: Excelente controle e fluidez no Reformer.",
    feedback: "Maria: Pode avançar para exercícios de nível intermediário/avançado.",
    caracteristicas: [
      { id: "flexibilidade", label: "Flexibilidade", value: "Excelente" },
      { id: "forca", label: "Força", value: "Aumentou 20%" },
    ],
  },
  // Dados para Lucas Almeida (ID: 3)
  3: {
    evolucaoGrafico: [
      { mes: "Fev", valor: 15 },
      { mes: "Mar", valor: 25 },
    ],
    observacoes: "Lucas: Apresentou leve dor no ombro esquerdo durante a aula.",
    feedback: "Lucas: Focar em adaptar exercícios para não sobrecarregar o ombro.",
    caracteristicas: [
      { id: "postura", label: "Postura", value: "Em correção" },
    ],
  },
};


const CHART_COLORS = ["#81C784", "#4DB6AC", "#4DD0E1", "#00BCD4"];

export default function EvolucaoInstrutor() {
  const navigate = useNavigate();
  const { isMobile, sidebarWidth } = useSidebar();
  const [menuOpen, setMenuOpen] = useState(false);

  const [alunos, setAlunos] = useState([]);
  const [loadingAlunos, setLoadingAlunos] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  
  const [loadingDados, setLoadingDados] = useState(false);
  const [data, setData] = useState([]);
  const [observacoes, setObservacoes] = useState("");
  const [feedback, setFeedback] = useState("");
  const [caracteristicas, setCaracteristicas] = useState([]);

  const [newMes, setNewMes] = useState("");
  const [newValor, setNewValor] = useState("");

  
  // --- PREPARAÇÃO API (1): Buscar a lista de alunos do instrutor ---
  useEffect(() => {
    const fetchAlunos = async () => {
      setLoadingAlunos(true);
      // (Bloco API comentado está OK)
      setAlunos(mockAlunosInstrutor);
      setLoadingAlunos(false);
    };
    fetchAlunos();
  }, []);

  
  // --- PREPARAÇÃO API (2): Carregar dados do aluno selecionado ---
  const carregarDadosDoAluno = async (aluno) => {
    if (!aluno) {
      setData([]);
      setObservacoes("");
      setFeedback("");
      setCaracteristicas([]);
      return;
    }
    
    setLoadingDados(true);
    // (Bloco API comentado está OK)
    
    // ALTERAÇÃO 2: Passe o 'aluno' para a função carregarMockAluno
    carregarMockAluno(aluno);
    setLoadingDados(false);
  };

  // ALTERAÇÃO 3: A função agora recebe o 'aluno'
  const carregarMockAluno = (aluno) => {
    // Busca os dados corretos no "banco de dados" usando o ID
    const dadosDoMock = MOCK_DADOS_EVOLUCAO[aluno.id];

    // Se, por acaso, não houver mock para esse aluno, exibe um padrão
    if (!dadosDoMock) {
      setData([]);
      setObservacoes(`Mock de dados não encontrado para ${aluno.nome}.`);
      setFeedback("");
      setCaracteristicas([]);
      return;
    }

    // Carrega os dados específicos do aluno encontrado
    const chartNormalized = dadosDoMock.evolucaoGrafico.map((item, index) => ({
      name: item.mes,
      desempenho: item.valor,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }));
    
    setData(chartNormalized);
    setObservacoes(dadosDoMock.observacoes);
    setFeedback(dadosDoMock.feedback);
    setCaracteristicas(dadosDoMock.caracteristicas);
  };
  
  // Observa mudanças no alunoSelecionado e carrega os dados
  useEffect(() => {
    carregarDadosDoAluno(alunoSelecionado);
  }, [alunoSelecionado]);

  
  // (Restante do seu código: yDomain, addCaracteristica, handleSalvar, etc. não mudam)
  const yDomain = useMemo(() => {
    if (!data.length) return [0, "auto"];
    const values = data.map((d) => Number(d.desempenho));
    return [0, Math.max(...values) + 10];
  }, [data]);

  const addCaracteristica = () => {
    setCaracteristicas((prev) => [
      ...prev,
      { id: `extra_${Date.now()}`, label: `Característica Extra`, value: "" },
    ]);
  };

  const removeCaracteristica = (id) => {
    setCaracteristicas((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCaracteristica = (id, value) => {
    setCaracteristicas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, value } : c))
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

  const handleSalvar = async () => {
    if (!alunoSelecionado) return;
    const payload = {
      observacoes,
      feedback,
      caracteristicas,
      evolucaoGrafico: data.map(d => ({ mes: d.name, valor: d.desempenho })),
    };
    console.log("Salvando (mock):", payload);
    alert("Evolução salva (mock)");
    // (Bloco API comentado está OK)
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

          {/* SELECT ALUNO (Sem alterações) */}
          <Card className="shadow-md border-none mb-6">
            <CardContent className="p-4 md:p-6">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Selecione um aluno:
              </p>
              {loadingAlunos ? <p>Carregando alunos...</p> : (
                <select
                  className="w-full p-2 border rounded-lg text-sm"
                  onChange={(e) => {
                    const selectedId = Number(e.target.value);
                    const selected = alunos.find(a => a.id === selectedId);
                    setAlunoSelecionado(selected || null);
                  }}
                  defaultValue=""
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

          {/* CONTEÚDO (O restante do JSX não muda) */}
          {alunoSelecionado && (
            <Card className="shadow-lg rounded-lg border-none">
              <CardContent className="flex flex-col p-0">
                {/* INFO (sem alterações) */}
                <div className="flex flex-col sm:flex-row p-4 md:p-6 gap-6 relative">
                   <p className="absolute top-2 right-4 text-xs text-red-600">
                    *Reavaliação: {alunoSelecionado.reavaliacao}
                  </p>
                  <div className="w-20 h-20 bg-gray-300 rounded-lg flex items-center justify-center mx-auto sm:mx-0">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm flex-1">
                    <div>
                      <p className="text-gray-500 text-xs">Nome completo</p>
                      <p className="font-semibold">{alunoSelecionado.nome}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Modalidade</p>
                      <p className="font-semibold">
                        {alunoSelecionado.modalidade}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Email</p>
                      <p>{alunoSelecionado.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Telefone</p>
                      <p>{alunoSelecionado.telefone}</p>
                    </div>
                  </div>
                </div>

                {/* BOTÕES SUPERIORES (sem alterações) */}
                <div className="px-4 pb-4 border-t pt-4 grid grid-cols-3 gap-3">
                  {[
                    {
                      path: `/instrutor/aluno/${alunoSelecionado.id}/atestados`, 
                      icon: <FileText className="w-5 h-5 mb-1" />,
                      label: "Atestados",
                    },
                    {
                      path: `/instrutor/aluno/${alunoSelecionado.id}/aulas`, 
                      icon: <BookOpen className="w-5 h-5 mb-1" />,
                      label: "Aulas",
                    },
                    {
                      path: `/instrutor/aluno/${alunoSelecionado.id}/fotos`,
                      icon: <ImageIcon className="w-5 h-5 mb-1" />,
                      label: "Fotos",
                    },
                  ].map((btn, i) => (
                    <div
                      key={i}
                      onClick={() => 
                        navigate(btn.path, { 
                          state: { 
                            alunoId: alunoSelecionado.id, 
                            alunoNome: alunoSelecionado.nome 
                          } 
                        })
                      }
                      className="flex flex-col items-center p-3 text-center border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                    >
                      {btn.icon}
                      <span className="text-xs">{btn.label}</span>
                    </div>
                  ))}
                </div>
                
                {loadingDados && <p className="p-8 text-center">Carregando dados da evolução...</p>}

                {!loadingDados && (
                  <>
                    <div className="flex flex-col lg:flex-row p-4 md:p-8 gap-6">
                      <div className="lg:w-1/2 bg-white rounded-lg p-4 shadow border">
                        <h2 className="font-semibold text-lg mb-4 text-center">
                          Desempenho
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={data}>
                            <XAxis dataKey="name" />
                            <YAxis domain={yDomain} />
                            <Tooltip />
                            <Bar dataKey="desempenho" radius={[6, 6, 0, 0]}>
                              {data.map((entry, i) => (
                                <Cell key={i} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                        <div className="mt-4 flex flex-col sm:flex-row gap-3">
                          <input
                            className="border p-2 rounded w-full sm:w-24 text-sm"
                            placeholder="Mês"
                            value={newMes}
                            onChange={(e) => setNewMes(e.target.value)}
                          />
                          <input
                            className="border p-2 rounded w-full sm:w-24 text-sm"
                            placeholder="Valor"
                            type="number"
                            value={newValor}
                            onChange={(e) => setNewValor(e.target.value)}
                          />
                          <button
                            onClick={addPontoDesempenho}
                            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm flex items-center justify-center gap-1"
                          >
                            <Plus size={16} /> Add
                          </button>
                        </div>
                      </div>

                      <div className="lg:w-1/2 bg-white rounded-lg shadow p-5 border">
                        <h2 className="font-semibold text-lg mb-2">Observações</h2>
                        <textarea
                          className="w-full border rounded p-2 text-sm h-24"
                          value={observacoes}
                          onChange={(e) => setObservacoes(e.target.value)}
                        />
                        <h3 className="font-semibold text-lg mt-4 mb-2">Feedback</h3>
                        <textarea
                          className="w-full border rounded p-2 text-sm h-24"
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                        />
                        <h3 className="font-semibold text-lg mt-4 mb-2">
                          Características
                        </h3>
                        {caracteristicas.map((char) => (
                          <div key={char.id} className="flex gap-2 mb-2">
                            <input
                              className="flex-1 border p-2 rounded text-sm"
                              placeholder={char.label}
                              value={char.value}
                              onChange={(e) =>
                                updateCaracteristica(char.id, e.target.value)
                              }
                            />
                            {char.id.startsWith("extra_") && (
                              <button
                                onClick={() => removeCaracteristica(char.id)}
                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
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

                    <div className="px-5 pb-8">
                      <button
                        onClick={handleSalvar}
                        className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded text-white font-medium"
                      >
                        Salvar Evolução
                      </button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
          
          {!alunoSelecionado && !loadingAlunos && (
            <p className="text-center text-gray-500 mt-10">
              Selecione um aluno acima para ver sua evolução.
            </p> 
          )}
        </main>
      </div>
    </div>
  );
}