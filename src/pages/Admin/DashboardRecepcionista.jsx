// @ts-nocheck
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  UserPlus,
  Search,
  MoreVertical,
  User,
  MapPin,
  Info,
  ArrowRightLeft,
  XCircle,
  MessageCircle,
  Users,
  CheckCircle,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight,
  CalendarDays
} from "lucide-react";
import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import { useSidebar } from "@/context/SidebarContext";

const apiService = {
  // Simula busca de alunos no banco (Autocomplete)
  buscarAlunosPorNome: async (termo) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!termo) return resolve([]);
        const termoLower = termo.toLowerCase();
        const resultados = TODOS_ALUNOS_DB.filter(a => 
            a.nome.toLowerCase().includes(termoLower)
        );
        resolve(resultados);
      }, 300); // Pequeno delay para simular rede
    });
  },

  buscarAulasDoDia: async (unidade, dataIso) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const diaSemana = new Date(dataIso + "T00:00:00").getDay();
        if (diaSemana === 0) return resolve([]);

        const baseAulas = [
          { id: `aula-${dataIso}-1`, horario: "07:00", instrutor: "Prof. Ana", modalidade: "Pilates Clássico", sala: "Sala 1", status_aula: "ativa", alunos: [{ id: 101, nome: "Maria Silva", status: "presente" }] },
          { id: `aula-${dataIso}-2`, horario: "08:00", instrutor: "Prof. Ana", modalidade: "Pilates Solo", sala: "Sala 2", status_aula: "ativa", alunos: [] },
          { id: `aula-${dataIso}-3`, horario: "09:00", instrutor: "Prof. Roberto", modalidade: "Reformer", sala: "Sala 1", status_aula: "ativa", alunos: [{ id: 104, nome: "Pedro Rocha", status: "pendente" }, { id: 105, nome: "Ana Julia", status: "pendente" }] },
          { id: `aula-${dataIso}-4`, horario: "10:00", instrutor: "Prof. Roberto", modalidade: "Fisioterapia", sala: "Sala 3", status_aula: "ativa", alunos: [] },
          { id: `aula-${dataIso}-5`, horario: "18:00", instrutor: "Prof. Carla", modalidade: "Pilates Solo", sala: "Sala 2", status_aula: "ativa", alunos: [{ id: 106, nome: "Bruno Mars", status: "pendente" }] },
        ];
        resolve(baseAulas.filter(() => Math.random() > 0.2));
      }, 400);
    });
  },

  cancelarAula: async (aulaId) => new Promise(r => setTimeout(r, 500)),
  substituirInstrutor: async (aulaId, novoInstrutor) => new Promise(r => setTimeout(r, 500)),
  enviarMensagemTurma: async (aulaId, mensagem) => new Promise(r => setTimeout(r, 800)),
  salvarReagendamento: async (aulaDestinoId, aluno) => new Promise(r => setTimeout(r, 600)),
  
  // Modificado para receber objeto aluno completo
  criarAgendamento: async (aulaId, alunoObj) => new Promise(r => setTimeout(r, 600))
};

// Simulação do Usuário Logado
const USUARIO_LOGADO = {
  nome: "Julia Recepção",
  cargo: "Recepcionista Sênior",
  unidade: "Itaquera"
};

// "Banco de Dados" de Todos os Alunos para Busca
const TODOS_ALUNOS_DB = [
    { id: 101, nome: "Maria Silva", plano: "Mensal 2x" },
    { id: 102, nome: "João Souza", plano: "Trimestral 3x" },
    { id: 103, nome: "Carla Dias", plano: "Anual Livre" },
    { id: 104, nome: "Pedro Rocha", plano: "Mensal 1x" },
    { id: 105, nome: "Ana Julia", plano: "Semestral 2x" },
    { id: 106, nome: "Bruno Mars", plano: "Mensal 3x" },
    { id: 107, nome: "Fernanda Lima", plano: "Anual 2x" },
    { id: 108, nome: "Carlos Eduardo", plano: "Mensal 2x" },
    { id: 109, nome: "Mariana Ximenes", plano: "Trimestral 1x" },
    { id: 110, nome: "Roberto Carlos", plano: "Vitalício" },
];

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
          <h3 className="font-bold text-lg text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default function DashboardRecepcionista() {
  const navigate = useNavigate();
  const { isMobile, sidebarWidth } = useSidebar();
  const [menuOpen, setMenuOpen] = useState(false);
  const [busca, setBusca] = useState("");

  // --- ESTADOS DE DATA E DADOS ---
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split('T')[0]);
  const [aulas, setAulas] = useState([]);
  const [loadingAulas, setLoadingAulas] = useState(false);

  // --- ESTADOS DE CONTROLE UI ---
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [alunoEmReagendamento, setAlunoEmReagendamento] = useState(null); 

  // --- ESTADO DE MODAIS E BUSCA DE ALUNO ---
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null, 
    data: null, 
    isLoading: false,
    step: 'search' // 'search' | 'confirm' (Para fluxo de agendamento)
  });
  
  const [inputValue, setInputValue] = useState(""); // Texto digitado
  const [sugestoesAlunos, setSugestoesAlunos] = useState([]); // Lista de sugestões
  const [alunoSelecionadoParaAgendar, setAlunoSelecionadoParaAgendar] = useState(null); // Objeto aluno escolhido

  // Efeito para carregar aulas
  useEffect(() => {
    const carregarAgenda = async () => {
      setLoadingAulas(true);
      setAulas([]);
      try {
        const dados = await apiService.buscarAulasDoDia(USUARIO_LOGADO.unidade, dataSelecionada);
        setAulas(dados);
      } catch (error) {
        console.error("Erro ao buscar agenda", error);
      } finally {
        setLoadingAulas(false);
      }
    };
    carregarAgenda();
  }, [dataSelecionada]);

  // Efeito para Autocomplete (Debounce)
  useEffect(() => {
    if (modalState.type === 'novo_agendamento' && modalState.step === 'search') {
        const delayDebounceFn = setTimeout(async () => {
            if (inputValue.length > 1) {
                const resultados = await apiService.buscarAlunosPorNome(inputValue);
                setSugestoesAlunos(resultados);
            } else {
                setSugestoesAlunos([]);
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }
  }, [inputValue, modalState.type, modalState.step]);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);


  // --- HELPERS ---
  const handleTrocarData = (dias) => {
    const novaData = new Date(dataSelecionada + "T00:00:00");
    novaData.setDate(novaData.getDate() + dias);
    setDataSelecionada(novaData.toISOString().split('T')[0]);
  };
  const formatarDataExibicao = (isoDate) => {
    const date = new Date(isoDate + "T00:00:00");
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
  };

  const agendaFiltrada = useMemo(() => {
    if (!busca) return aulas;
    const termo = busca.toLowerCase();
    return aulas.filter(aula => {
      const matchInstrutor = aula.instrutor.toLowerCase().includes(termo);
      const matchModalidade = aula.modalidade.toLowerCase().includes(termo);
      const matchAluno = aula.alunos.some(aluno => aluno.nome.toLowerCase().includes(termo));
      return matchInstrutor || matchModalidade || matchAluno;
    });
  }, [busca, aulas]);

  // --- MANIPULAÇÃO DE MODAIS ---
  const abrirModalAcao = (type, data) => {
    setActiveMenuId(null);
    setInputValue("");
    setSugestoesAlunos([]);
    setAlunoSelecionadoParaAgendar(null);
    setModalState({ isOpen: true, type, data, isLoading: false, step: 'search' });
  };

  const fecharModal = () => {
    setModalState({ isOpen: false, type: null, data: null, isLoading: false, step: 'search' });
  };

  // --- AÇÕES PRINCIPAIS ---
  const iniciarReagendamento = (aluno, aulaId) => {
    setActiveMenuId(null);
    setAulas(prev => prev.map(a => 
      a.id === aulaId ? { ...a, alunos: a.alunos.filter(al => al.id !== aluno.id) } : a
    ));
    setAlunoEmReagendamento({
      alunoId: aluno.id,
      alunoNome: aluno.nome,
      aulaOrigemId: aulaId,
      origemData: dataSelecionada
    });
  };

  const cancelarReagendamento = () => {
    if (alunoEmReagendamento.origemData === dataSelecionada) {
        setAulas(prev => prev.map(a => 
            a.id === alunoEmReagendamento.aulaOrigemId
            ? { ...a, alunos: [...a.alunos, { id: alunoEmReagendamento.alunoId, nome: alunoEmReagendamento.alunoNome, status: 'pendente' }] }
            : a
        ));
    }
    setAlunoEmReagendamento(null);
  };

  const handleSlotVazioClick = (aula) => {
    if (aula.status_aula === 'cancelada') return;
    if (alunoEmReagendamento) {
      abrirModalAcao('confirmar_reagendamento', { aulaDestino: aula });
    } else {
      abrirModalAcao('novo_agendamento', { aulaDestino: aula });
    }
  };

  // Funções Específicas do Fluxo de Novo Agendamento
  const selecionarAlunoDaLista = (aluno) => {
      setAlunoSelecionadoParaAgendar(aluno);
      setModalState(prev => ({ ...prev, step: 'confirm' })); // Muda para passo de confirmação
  };

  const voltarParaBusca = () => {
      setModalState(prev => ({ ...prev, step: 'search' }));
      setAlunoSelecionadoParaAgendar(null);
  };


  const handleConfirmarAcao = async () => {
    setModalState(prev => ({ ...prev, isLoading: true }));
    const { type, data } = modalState;

    try {
      // Ações simples (mantidas)
      if (type === 'cancelar') {
        await apiService.cancelarAula(data.id);
        setAulas(prev => prev.map(a => a.id === data.id ? { ...a, status_aula: 'cancelada', alunos: [] } : a));
      }
      if (type === 'substituir') {
        if (!inputValue.trim()) return;
        await apiService.substituirInstrutor(data.id, inputValue);
        setAulas(prev => prev.map(a => a.id === data.id ? { ...a, instrutor: inputValue } : a));
      }
      if (type === 'navegar_aluno') {
        navigate(`/admin/estudantes?busca=${encodeURIComponent(data.alunoNome)}`);
      }

      // === CONFIRMAÇÃO DO NOVO AGENDAMENTO ===
      if (type === 'novo_agendamento') {
        if (!alunoSelecionadoParaAgendar) return; 

        await apiService.criarAgendamento(data.aulaDestino.id, alunoSelecionadoParaAgendar);
        
        setAulas(prev => prev.map(a => 
          a.id === data.aulaDestino.id 
          ? { ...a, alunos: [...a.alunos, { id: alunoSelecionadoParaAgendar.id, nome: alunoSelecionadoParaAgendar.nome, status: 'pendente' }] }
          : a
        ));
      }

      if (type === 'confirmar_reagendamento') {
        await apiService.salvarReagendamento(data.aulaDestino.id, alunoEmReagendamento);
        setAulas(prev => prev.map(a => 
            a.id === data.aulaDestino.id 
            ? { ...a, alunos: [...a.alunos, { id: alunoEmReagendamento.alunoId, nome: alunoEmReagendamento.alunoNome, status: 'pendente' }] }
            : a
        ));
        setAlunoEmReagendamento(null);
      }

    } catch (error) {
      console.error(error);
      alert("Erro na operação.");
    } finally {
      setModalState(prev => ({ ...prev, isLoading: false }));
      fecharModal();
    }
  };

  // --- RENDERIZAÇÃO DO CONTEÚDO DO MODAL ---
  const renderModalContent = () => {
    const { type, data, isLoading, step } = modalState;

    // === FLUXO DE NOVO AGENDAMENTO COM BUSCA E CONFIRMAÇÃO ===
    if (type === 'novo_agendamento') {
        if (step === 'search') {
            return {
                title: "Novo Agendamento",
                body: (
                    <div>
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Dados da Aula</p>
                            <div className="flex justify-between items-end mt-1">
                                <div>
                                    <p className="font-bold text-gray-800 text-lg">{data?.aulaDestino?.horario}</p>
                                    <p className="text-sm text-gray-600">{formatarDataExibicao(dataSelecionada)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-800">{data?.aulaDestino?.modalidade}</p>
                                    <p className="text-xs text-gray-500">{data?.aulaDestino?.instrutor}</p>
                                </div>
                            </div>
                        </div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">Buscar Aluno:</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Digite o nome..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                autoFocus
                            />
                        </div>

                        {/* LISTA DE SUGESTÕES */}
                        <div className="mt-2 max-h-48 overflow-y-auto border border-gray-100 rounded-lg divide-y divide-gray-100">
                            {inputValue.length > 1 && sugestoesAlunos.length === 0 && (
                                <div className="p-3 text-sm text-gray-500 text-center">Nenhum aluno encontrado.</div>
                            )}
                            {sugestoesAlunos.map(aluno => (
                                <button 
                                    key={aluno.id}
                                    onClick={() => selecionarAlunoDaLista(aluno)}
                                    className="w-full text-left p-3 hover:bg-blue-50 flex justify-between items-center group transition-colors"
                                >
                                    <div>
                                        <p className="font-medium text-gray-800 group-hover:text-blue-700">{aluno.nome}</p>
                                        <p className="text-xs text-gray-500">{aluno.plano}</p>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500" />
                                </button>
                            ))}
                        </div>
                    </div>
                ),
                hideFooter: true 
            };
        }

        // PASSO 2: CONFIRMAÇÃO
        if (step === 'confirm') {
            return {
                title: "Confirmar Agendamento",
                body: (
                    <div className="text-center">
                         <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="text-green-600" size={32} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-1">Agendar Aula?</h4>
                        <p className="text-gray-500 mb-6">Confira os dados antes de confirmar.</p>

                        <div className="bg-gray-50 rounded-xl p-4 text-left space-y-3 border border-gray-100">
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-sm text-gray-500">Aluno:</span>
                                <span className="text-sm font-bold text-gray-800">{alunoSelecionadoParaAgendar?.nome}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-sm text-gray-500">Data:</span>
                                <span className="text-sm font-medium text-gray-800 capitalize">{formatarDataExibicao(dataSelecionada)}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="text-sm text-gray-500">Horário:</span>
                                <span className="text-sm font-bold text-gray-800">{data?.aulaDestino?.horario}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Modalidade:</span>
                                <span className="text-sm font-medium text-gray-800">{data?.aulaDestino?.modalidade}</span>
                            </div>
                        </div>
                    </div>
                ),
                actionLabel: isLoading ? "Agendando..." : "Confirmar",
                actionColor: "bg-green-600 hover:bg-green-700",
                secondaryAction: (
                    <button onClick={voltarParaBusca} className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium">
                        Voltar
                    </button>
                )
            };
        }
    }

    if (type === 'confirmar_reagendamento') {
        return {
            title: "Confirmar Reagendamento",
            body: (
                <div className="text-center">
                    <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ArrowRightLeft className="text-orange-600" size={32} />
                    </div>
                    <p className="text-gray-600 mb-2">Mover aluno:</p>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">{alunoEmReagendamento?.alunoNome}</h4>
                    
                    <div className="flex items-center justify-center gap-3 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                        <span>De: {alunoEmReagendamento?.origemData}</span>
                        <ArrowRightLeft size={14} />
                        <span className="font-bold text-gray-800">Para: {formatarDataExibicao(dataSelecionada)} - {data?.aulaDestino?.horario}</span>
                    </div>
                </div>
            ),
            actionLabel: isLoading ? "Movendo..." : "Confirmar Mudança",
            actionColor: "bg-orange-600 hover:bg-orange-700"
        };
    }

    if (type === 'navegar_aluno') {
        return {
          title: "Acessar Ficha do Aluno",
          body: (
            <div className="text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="text-blue-600" size={32} />
              </div>
              <p className="text-gray-600 mb-2">Visualizar ficha de:</p>
              <h4 className="text-xl font-bold text-gray-900">{data?.alunoNome}</h4>
            </div>
          ),
          actionLabel: "Ver Ficha",
          actionColor: "bg-blue-600 hover:bg-blue-700"
        };
    }

    // Cancelar, Substituir, Mensagem...
    if (type === 'cancelar') {
        return {
          title: "Cancelar Aula",
          body: <p className="text-gray-600 text-center">Cancelar aula de <strong>{data?.modalidade}</strong>?</p>,
          actionLabel: "Confirmar",
          actionColor: "bg-red-600 hover:bg-red-700"
        };
    }
    if (type === 'substituir') {
        return {
            title: "Trocar Instrutor",
            body: <input className="w-full border p-2 rounded" placeholder="Nome do novo instrutor" value={inputValue} onChange={e => setInputValue(e.target.value)} />,
            actionLabel: "Salvar",
            actionColor: "bg-blue-600"
        }
    }
    if (type === 'mensagem') {
        return {
            title: "Enviar Mensagem",
            body: <textarea className="w-full border p-2 rounded h-24" placeholder="Digite a mensagem..." value={inputValue} onChange={e => setInputValue(e.target.value)} />,
            actionLabel: "Enviar",
            actionColor: "bg-green-600"
        }
    }

    return { title: "", body: null, actionLabel: "", actionColor: "" };
  };

  const modalContent = renderModalContent();
  const toggleMenu = (e, id) => { e.stopPropagation(); setActiveMenuId(activeMenuId === id ? null : id); };
  const getSlots = (alunos) => {
    const slots = [...alunos];
    while (slots.length < 3) slots.push(null);
    return slots;
  };
  const StatusBadge = ({ status }) => {
    const map = { presente: "bg-green-100 text-green-700 border-green-200", pendente: "bg-yellow-50 text-yellow-600 border-yellow-100", falta: "bg-red-50 text-red-500 border-red-100", falta_justificada: "bg-gray-100 text-gray-500 border-gray-200 line-through" };
    return <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${map[status] || map.pendente}`}>{status.replace('_', ' ')}</span>;
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <SidebarUnificada
        menuItems={sidebarConfigs.administrador.menuItems}
        userInfo={{ nome: USUARIO_LOGADO.nome, cargo: USUARIO_LOGADO.cargo, email: "recepcao@pilates.com" }}
        isOpen={menuOpen}
        onOpenChange={setMenuOpen}
      />

      <div className="flex flex-col flex-1 transition-all duration-300 min-w-0 w-full" style={{ marginLeft: !isMobile ? `${sidebarWidth}px` : "0", width: !isMobile ? `calc(100% - ${sidebarWidth}px)` : "100%" }}>
        
        {/* BARRA REAGENDAMENTO */}
        {alunoEmReagendamento && (
            <div className="sticky top-0 z-40 bg-orange-500 text-white px-6 py-3 shadow-md flex items-center justify-between animate-in slide-in-from-top">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full"><ArrowRightLeft size={20} /></div>
                    <div><p className="font-bold text-sm">Reagendando: {alunoEmReagendamento.alunoNome}</p><p className="text-xs text-orange-100">Escolha uma vaga livre.</p></div>
                </div>
                <button onClick={cancelarReagendamento} className="bg-white text-orange-600 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-orange-50 transition">Cancelar</button>
            </div>
        )}

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {/* HEADER */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-8 gap-6 border-b pb-6">
              <div className="w-full xl:w-auto">
                <div className="flex items-center gap-2 text-blue-600 mb-2 bg-blue-50 w-fit px-3 py-1 rounded-full border border-blue-100"><MapPin size={14} /><span className="font-bold text-xs tracking-wide uppercase">{USUARIO_LOGADO.unidade}</span></div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
                <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm w-fit">
                    <button onClick={() => handleTrocarData(-1)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition"><ChevronLeft size={20} /></button>
                    <div className="flex items-center gap-2 px-4 py-1 border-x border-gray-100 min-w-[220px] justify-center"><CalendarDays size={18} className="text-blue-500" /><span className="font-semibold text-gray-700 capitalize">{formatarDataExibicao(dataSelecionada)}</span></div>
                    <button onClick={() => handleTrocarData(1)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition"><ChevronRight size={20} /></button>
                    <input type="date" value={dataSelecionada} onChange={(e) => setDataSelecionada(e.target.value)} className="w-8 h-8 p-1 cursor-pointer opacity-50 hover:opacity-100" title="Selecionar data" />
                </div>
              </div>
              <div className="relative w-full xl:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder="Buscar nesta data..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm transition-all" />
              </div>
            </div>

            {/* FEED */}
            <div className="space-y-5">
              {loadingAulas ? <div className="py-20 text-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div><p className="text-gray-500">Carregando...</p></div> : agendaFiltrada.length === 0 ? <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300"><Calendar size={24} className="text-gray-400 mx-auto mb-4" /><h3 className="text-gray-900 font-medium">Sem aulas</h3><p className="text-gray-500 text-sm mt-1">Tente outro dia.</p></div> : (
                agendaFiltrada.map((aula) => {
                  const isCanceled = aula.status_aula === 'cancelada';
                  return (
                  <div key={aula.id} className={`relative rounded-2xl p-0 shadow-sm border overflow-visible flex flex-col md:flex-row transition-all duration-300 ${isCanceled ? 'bg-gray-50 border-gray-200 opacity-70' : 'bg-white border-gray-200 hover:shadow-md'}`}>
                    {isCanceled && <div className="absolute inset-0 z-10 bg-white/40 flex items-center justify-center backdrop-blur-[1px] rounded-2xl pointer-events-none"><span className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold border border-red-200 transform -rotate-12 text-lg shadow-lg">AULA CANCELADA</span></div>}
                    <div className="bg-slate-50 p-6 md:w-72 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100 relative">
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl ${isCanceled ? 'bg-gray-400' : 'bg-blue-500'}`}></div>
                      <div>
                        <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2 text-gray-900 font-bold text-3xl">{aula.horario}</div><span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">{aula.sala}</span></div>
                        <h3 className="font-bold text-gray-800 text-lg leading-tight">{aula.modalidade}</h3>
                        <p className="text-gray-500 text-sm mt-1 flex items-center gap-1"><User size={14} /> {aula.instrutor}</p>
                      </div>
                      <div className="mt-6 flex items-center justify-between relative">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${aula.alunos.length === 3 ? "bg-red-50 text-red-600" : aula.alunos.length === 0 ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>{aula.alunos.length}/3 Alunos</span>
                        {!isCanceled && <div className="relative"><button onClick={(e) => toggleMenu(e, aula.id)} className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100"><MoreVertical size={18} /></button>{activeMenuId === aula.id && <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200"><button onClick={() => abrirModalAcao('substituir', { id: aula.id, instrutorAtual: aula.instrutor })} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 flex gap-2"><ArrowRightLeft size={14} /> Trocar Prof</button><button onClick={() => abrirModalAcao('mensagem', { id: aula.id, qtdAlunos: aula.alunos.length })} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 flex gap-2"><MessageCircle size={14} /> Avisar Turma</button><div className="h-px bg-gray-100"></div><button onClick={() => abrirModalAcao('cancelar', { id: aula.id, modalidade: aula.modalidade, horario: aula.horario })} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex gap-2"><XCircle size={14} /> Cancelar</button></div>}</div>}
                      </div>
                    </div>
                    <div className="flex-1 p-4 md:p-5 grid grid-cols-1 gap-3 content-center">
                      {getSlots(aula.alunos).map((aluno, index) => (
                        <div key={index} onClick={() => !aluno && !isCanceled && handleSlotVazioClick(aula)} className={`relative flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${aluno ? "bg-white border-gray-200" : isCanceled ? "bg-gray-100 border-gray-200" : alunoEmReagendamento ? "bg-orange-50 border-dashed border-orange-300 cursor-pointer hover:bg-orange-100 ring-2 ring-orange-200 ring-offset-1" : "bg-gray-50 border-dashed border-gray-300 hover:bg-blue-50/50 hover:border-blue-200 cursor-pointer group/slot"}`}>
                          {aluno ? (
                            <><div className="flex items-center gap-3 cursor-pointer hover:opacity-80 flex-1" onClick={(e) => { e.stopPropagation(); if(!isCanceled) abrirModalAcao('navegar_aluno', { alunoNome: aluno.nome, alunoId: aluno.id }); }}><div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">{aluno.nome.charAt(0)}</div><div><p className="font-semibold text-gray-800 text-sm hover:text-blue-600 hover:underline">{aluno.nome}</p><StatusBadge status={aluno.status} /></div></div>{!isCanceled && <div className="flex items-center gap-1"><button onClick={(e) => { e.stopPropagation(); iniciarReagendamento(aluno, aula.id); }} title="Reagendar" className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg"><ArrowRightLeft size={18} /></button><button onClick={(e) => { e.stopPropagation(); abrirModalAcao('navegar_aluno', { alunoNome: aluno.nome, alunoId: aluno.id }); }} title="Ficha" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Info size={18} /></button></div>}</>
                          ) : !isCanceled && <><div className="flex items-center gap-3 opacity-50 group-hover/slot:opacity-100 transition-opacity"><div className={`w-10 h-10 rounded-full flex items-center justify-center ${alunoEmReagendamento ? 'bg-orange-200 text-orange-600' : 'bg-gray-200 text-gray-400'}`}><UserPlus size={18} /></div><span className={`text-sm font-medium ${alunoEmReagendamento ? 'text-orange-700 font-bold' : 'text-gray-500'}`}>{alunoEmReagendamento ? "Mover Aqui" : "Vaga Disponível"}</span></div>{!alunoEmReagendamento && <button className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg opacity-0 group-hover/slot:opacity-100 transition-all transform translate-x-2 group-hover/slot:translate-x-0">Agendar</button>}</>}
                        </div>
                      ))}
                    </div>
                  </div>
                )})
              )}
            </div>
          </div>
        </main>
      </div>

      <Modal isOpen={modalState.isOpen} onClose={fecharModal} title={modalContent.title} footer={
            !modalContent.hideFooter && (
            <>
                {modalContent.secondaryAction ? modalContent.secondaryAction : <button onClick={fecharModal} disabled={modalState.isLoading} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium">Cancelar</button>}
                <button onClick={handleConfirmarAcao} disabled={modalState.isLoading} className={`px-4 py-2 text-white rounded-lg transition shadow-sm font-medium flex items-center gap-2 ${modalContent.actionColor} ${modalState.isLoading ? 'opacity-70' : ''}`}>{modalState.isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}{modalContent.actionLabel}</button>
            </>
            )
        }>
        {modalContent.body}
      </Modal>
    </div>
  );
}