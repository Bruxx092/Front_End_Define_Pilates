// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import { useSidebar } from "@/context/SidebarContext";
import api from "@/services/api";
import { format, parseISO, addMonths, subMonths } from "date-fns";

const DEFAULT_USER_PHOTO = '/src/assets/placeholder-user.png';

export default function RegistroPresenca() {
  const navigate = useNavigate();
  const { isMobile, sidebarWidth } = useSidebar();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Estados
  const [aulas, setAulas] = useState([]);
  const [selectedAula, setSelectedAula] = useState(null);
  const [alunos, setAlunos] = useState([]);
  
  const [loadingAulas, setLoadingAulas] = useState(true);
  const [loadingAlunos, setLoadingAlunos] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState(null);

  // 1. Buscar Aulas do Instrutor
  useEffect(() => {
    const fetchAulas = async () => {
      setLoadingAulas(true);
      try {
        // Busca aulas de 1 mês atrás até 1 mês à frente
        const startDate = format(subMonths(new Date(), 1), 'yyyy-MM-dd');
        const endDate = format(addMonths(new Date(), 1), 'yyyy-MM-dd');

        const response = await api.get('/agenda/minhas_aulas', {
          params: { start_date: startDate, end_date: endDate }
        });

        const aulasFormatadas = response.data.map(aula => {
            const parts = aula.participantes || aula.participantes_ids || [];
            return {
              id: aula.AulaID, 
              dataIso: aula.dataAgendaAula, 
              dataObj: parseISO(aula.dataAgendaAula),
              data: format(parseISO(aula.dataAgendaAula), "dd/MM"),
              horario: format(parseISO(aula.dataAgendaAula), "HH:mm"),
              turma: aula.disciplina || "Pilates",
              instrutor: "Você",
              participantesIds: Array.isArray(parts) ? parts : [] 
            };
          });

        // Ordena: Aulas com alunos primeiro, depois por data mais recente
        aulasFormatadas.sort((a, b) => {
            if (b.participantesIds.length !== a.participantesIds.length) {
                return b.participantesIds.length - a.participantesIds.length;
            }
            return b.dataObj - a.dataObj;
        });

        setAulas(aulasFormatadas);

        // Seleciona automaticamente a primeira aula se houver
        if (aulasFormatadas.length > 0) {
          setSelectedAula(aulasFormatadas[0]);
        }
      } catch (err) {
        console.error("Erro ao buscar aulas:", err);
        setError("Não foi possível carregar suas aulas. Verifique sua conexão.");
      } finally {
        setLoadingAulas(false);
      }
    };

    fetchAulas();
  }, []);

  // 2. Buscar Alunos da Aula Selecionada - ESTRATÉGIA INDIVIDUAL (SOLUÇÃO FINAL)
  useEffect(() => {
    if (!selectedAula) return;

    const fetchDadosAlunos = async () => {
      setLoadingAlunos(true);
      setAlunos([]); 
      setError(null);
      
      const listaIds = selectedAula.participantesIds;

      if (!listaIds || listaIds.length === 0) {
        setLoadingAlunos(false);
        return;
      }

      try {
        const formattedDate = format(selectedAula.dataObj, 'yyyy-MM-dd');

        // Fazemos chamadas em paralelo para cada aluno para garantir a identificação correta
        const promessasAlunos = listaIds.map(async (studentId) => {
            // A. Buscar Perfil (com parâmetro corrigido para evitar erro 422)
            const perfilReq = api.get(`/alunos/aluno-instrutor/${studentId}`, {
                params: { estudante_id: studentId }
            }).catch(e => {
                console.warn(`Erro ao carregar perfil ${studentId}`, e);
                return { data: { name_user: `Aluno #${studentId}`, foto_user: null } };
            });

            // B. Buscar Agenda Individual (Workaround para falta de ID no endpoint de lista)
            const agendaReq = api.get(`/agenda/aluno/${studentId}`, {
                params: { 
                    start_date: formattedDate,
                    end_date: formattedDate
                }
            }).catch(e => {
                console.warn(`Erro ao carregar agenda ${studentId}`, e);
                return { data: [] };
            });

            const [resPerfil, resAgenda] = await Promise.all([perfilReq, agendaReq]);

            // Processar Perfil
            const perfilData = resPerfil.data || {};
            const nome = perfilData.name_user || perfilData.nome || `Aluno #${studentId}`;
            const foto = perfilData.foto_user || perfilData.foto || null;

            // Processar Agenda
            // Procuramos na agenda do dia o registro que corresponde à AulaID selecionada
            let registroId = null;
            let status = 'Agendada';
            let hasError = false;

            const agendaList = Array.isArray(resAgenda.data) ? resAgenda.data : [];
            const matchAula = agendaList.find(item => item.AulaID === selectedAula.id);

            if (matchAula) {
                // O campo _id do Mongo às vezes vem como '_id' ou 'id' dependendo do parser
                registroId = matchAula._id || matchAula.id;
                status = matchAula.StatusPresenca || 'Agendada';
            } else {
                // Se não achou a aula na agenda do aluno, é inconsistência de dados
                hasError = true;
                status = 'Sem Registro';
            }

            return {
                id: studentId,
                registro_id: registroId,
                nome,
                foto,
                status,
                hasError
            };
        });

        const alunosResolvidos = await Promise.all(promessasAlunos);
        
        // Ordenação alfabética
        alunosResolvidos.sort((a, b) => a.nome.localeCompare(b.nome));
        setAlunos(alunosResolvidos);

      } catch (err) {
        console.error("Erro fatal ao processar alunos:", err);
        setError("Erro ao carregar lista de alunos.");
      } finally {
        setLoadingAlunos(false);
      }
    };

    fetchDadosAlunos();
  }, [selectedAula]);

  // 3. Atualizar Presença
  const atualizarPresenca = async (aluno, novoStatus) => {
    // Bloqueio de segurança: Se não temos o ID do registro (mongo), não podemos atualizar
    if (!aluno.registro_id) {
      alert("Atenção: O sistema não encontrou o agendamento individual deste aluno para hoje. Por favor, solicite à administração que verifique a matrícula/agenda deste aluno.");
      return;
    }

    // Otimista update: Atualiza a interface antes da resposta do servidor
    const listaAnterior = [...alunos];
    setAlunos(prev => prev.map(a => 
      a.id === aluno.id ? { ...a, status: novoStatus } : a
    ));

    try {
      // O backend espera form-data para o status
      const formData = new FormData();
      formData.append('status_presenca', novoStatus);
      
      await api.patch(`/agenda/presenca/${aluno.registro_id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Sucesso silencioso (já atualizado na UI)
    } catch (err) {
      console.error("Erro ao salvar presença:", err);
      alert("Falha ao salvar a presença. As alterações serão revertidas.");
      // Reverte em caso de erro
      setAlunos(listaAnterior);
    }
  };

  const verHistorico = (alunoId) => {
    navigate(`/instrutor/ficha-tecnica/${alunoId}`);
  };

  const getGridClasses = () => {
    if (isMobile) return 'grid-cols-1 gap-4';
    const count = alunos.length;
    if (count <= 2) return 'grid-cols-1 sm:grid-cols-2 gap-4';
    if (count <= 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';
  };

  // Habilita os botões apenas se tivermos o ID do registro
  const podeMarcarPresenca = (aluno) => {
    return !!aluno.registro_id;
  };

  return (
    <div className="flex min-h-screen bg-[#F6F9FF] font-inter">
      <SidebarUnificada
        menuItems={sidebarConfigs.instrutor.menuItems}
        userInfo={sidebarConfigs.instrutor.userInfo}
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 sm:pt-6 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 max-w-7xl mx-auto w-full">
            
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#555555] mb-6">
                REGISTRO DE PRESENÇA
              </h1>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              {loadingAulas ? (
                 <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B668B]"></div>
                 </div>
              ) : selectedAula ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <span className="font-bold text-[#555555] text-lg sm:text-xl">TURMA:</span>
                            <p className="text-black text-lg sm:text-xl">{selectedAula.turma}</p>
                        </div>
                        <div>
                            <span className="font-bold text-[#555555] text-lg sm:text-xl">HORÁRIO:</span>
                            <p className="text-black text-lg sm:text-xl">{selectedAula.horario}</p>
                        </div>
                        <div>
                            <span className="font-bold text-[#555555] text-lg sm:text-xl">DATA:</span>
                            <p className="text-black text-lg sm:text-xl">{selectedAula.data}</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                        <span className="font-bold text-black text-lg sm:text-xl whitespace-nowrap">
                        Selecionar Aula:
                        </span>
                        <div className="relative w-full sm:w-64">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex justify-between items-center shadow-sm hover:border-gray-400 transition-colors"
                        >
                            <span className="text-black">
                                {selectedAula.data} - {selectedAula.horario} ({selectedAula.participantesIds.length} alunos)
                            </span>
                            <svg 
                                className={`w-5 h-5 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        {isDropdownOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {aulas.map((aula) => (
                                <button
                                key={aula.id}
                                onClick={() => {
                                    setSelectedAula(aula);
                                    setIsDropdownOpen(false);
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                >
                                <span className="text-black">{aula.data} - {aula.horario} - {aula.turma} ({aula.participantesIds.length})</span>
                                </button>
                            ))}
                            </div>
                        )}
                        </div>
                    </div>
                  </>
              ) : (
                  <div className="text-gray-500">Nenhuma aula encontrada para o período.</div>
              )}
            </div>

            {loadingAlunos ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2B668B]"></div>
                </div>
            ) : alunos.length === 0 ? (
                 <div className="text-center text-gray-500 py-8">
                    {selectedAula 
                        ? (selectedAula.participantesIds.length > 0 
                            ? "Carregando dados dos alunos..." 
                            : "Esta aula não possui alunos matriculados.") 
                        : "Selecione uma aula."}
                 </div>
            ) : (
                <div className={`grid ${getGridClasses()}`}>
                {alunos.map((aluno) => (
                    <div key={aluno.id} className={`bg-white rounded-lg shadow-lg border overflow-hidden ${aluno.hasError ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                    
                    <div className="h-48 sm:h-56 bg-gray-200 relative">
                        <img
                            src={aluno.foto || DEFAULT_USER_PHOTO}
                            alt={aluno.nome}
                            className={`w-full h-full object-cover ${!aluno.registro_id ? 'grayscale opacity-60' : ''}`}
                            onError={(e) => { e.target.src = DEFAULT_USER_PHOTO; }}
                        />
                        {!aluno.registro_id && (
                          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                            Erro de Dados
                          </div>
                        )}
                    </div>
                    
                    <div className="p-4">
                        <div className="mb-3">
                            <span className="font-bold text-black text-sm">NOME:</span>
                            <p className="text-black font-semibold truncate" title={aluno.nome}>{aluno.nome}</p>
                            {!aluno.registro_id && (
                                <p className="text-[10px] text-red-600 mt-2 font-bold leading-tight bg-red-100 p-1 rounded">
                                    Agendamento não localizado. Contate o suporte.
                                </p>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mb-4">
                        {['Presente', 'Falta', 'Ausência Justificada'].map((statusOption) => {
                            const isSelected = aluno.status === statusOption;
                            let btnColor = 'bg-gray-400 hover:bg-gray-500';
                            
                            if (isSelected) {
                                if (statusOption === 'Presente') btnColor = 'bg-[#17E383]';
                                else if (statusOption === 'Falta') btnColor = 'bg-[#FF4848]';
                                else btnColor = 'bg-[#FFC548]';
                            }

                            return (
                                <button
                                    key={statusOption}
                                    onClick={() => atualizarPresenca(aluno, statusOption)}
                                    disabled={!podeMarcarPresenca(aluno)}
                                    className={`py-2 px-1 rounded-2xl text-[10px] sm:text-xs font-bold text-white transition-colors ${btnColor} ${!podeMarcarPresenca(aluno) ? 'opacity-30 cursor-not-allowed' : ''}`}
                                    title={!podeMarcarPresenca(aluno) ? "Registro indisponível no sistema" : ""}
                                >
                                    {statusOption === 'Ausência Justificada' ? 'Justificada' : statusOption}
                                </button>
                            );
                        })}
                        </div>
                        
                        <button
                            onClick={() => verHistorico(aluno.id)}
                            className="w-full bg-[#2B668B] text-white py-2 rounded-2xl font-semibold hover:bg-[#1e4d6b] transition-colors text-sm"
                        >
                            VER HISTÓRICO
                        </button>
                    </div>
                    </div>
                ))}
                </div>
            )}
          </div>
        </main>
      </div>

      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-0"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}