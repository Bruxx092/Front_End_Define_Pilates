import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import { useSidebar } from "@/context/SidebarContext";
import api from "@/services/api";
import { format, subYears, addMonths, parseISO } from "date-fns";

// Componente Modal para Registrar Evolução
const EvolucaoModal = ({ isOpen, onClose, aula, onSave }) => {
  const [status, setStatus] = useState(aula?.StatusPresenca || 'Agendada');
  const [nota, setNota] = useState(aula?.NotaEvolucao || '');
  const [files, setFiles] = useState([]);
  const [isSaving, setIsSaving] = useState(false);



  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };



  useEffect(() => {
    if (aula) {
      setStatus(aula.StatusPresenca || 'Agendada');
      setNota(aula.NotaEvolucao || '');
      setFiles([]);
    }
  }, [aula]);

  if (!isOpen || !aula) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const formData = new FormData();
      formData.append('status_presenca', status);
      formData.append('nota_evolucao', nota);
      
      files.forEach((file) => {
        formData.append('anexos_files', file);
      });

      const registroId = aula._id || aula.id; 
      
      await api.patch(`/agenda/presenca/${registroId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onSave(); 
      onClose();
    } catch (error) {
      console.error("Erro ao salvar evolução:", error);
      alert("Erro ao salvar. Verifique se você tem permissão.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 font-inter">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-[#313A4E]">Registrar Evolução</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600"><strong>Disciplina:</strong> {aula.disciplina}</p>
          <p className="text-sm text-gray-600"><strong>Data:</strong> {format(parseISO(aula.DataHoraAula), "dd/MM/yyyy 'às' HH:mm")}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status de Presença</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B668B] outline-none"
            >
              <option value="Agendada">Agendada</option>
              <option value="Presente">Presente</option>
              <option value="Falta">Falta</option>
              <option value="Reagendada">Reagendada</option>
              <option value="Ausência Justificada">Ausência Justificada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nota de Evolução</label>
            <textarea 
              value={nota} 
              onChange={(e) => setNota(e.target.value)}
              rows={4} 
              placeholder="Descreva o desempenho e evolução do aluno..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B668B] outline-none resize-none"
            />
          </div>
          <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Anexar Fotos de Evolução</label>
                <input 
                  type="file" 
                  multiple 
                  onChange={handleFileChange} 
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#2B668B] file:text-white hover:file:bg-[#1e4d6b] cursor-pointer"
                  accept="image/*" 
                />
                <p className="mt-2 text-sm text-gray-500">{files.length} arquivo(s) selecionado(s).</p>
            </div>

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-6 py-2 bg-[#2B668B] text-white font-semibold rounded-lg hover:bg-[#1e4d6b] disabled:opacity-50 flex items-center"
            >
              {isSaving ? 'Salvando...' : 'Salvar Evolução'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function FichaTecnica() {
  const { id } = useParams();
  const { isMobile, sidebarWidth } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation(); // <-- NOVO: Pega dados passados via navegação
  const [menuOpen, setMenuOpen] = useState(false);
  
  const [studentInfo, setStudentInfo] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const getSidebarConfig = () => {
    const path = window.location.pathname;
    if (path.includes('/admin')) return sidebarConfigs.administrador;
    return sidebarConfigs.instrutor;
  };

  const sidebarData = getSidebarConfig();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    // 1. Tentar usar dados que vieram da tela anterior (Resiliência)
    let initialInfo = null;
    if (location.state && location.state.studentData) {
        initialInfo = {
            name: location.state.studentData.name,
            photo: location.state.studentData.photo,
            birth: null, // Não temos isso na listagem
            profession: null,
            medical: null
        };
        setStudentInfo(initialInfo); // Já mostra o que temos
    }

    let info = initialInfo;
    let adminPermission = false;

    // 2. Tentar buscar Info Completa na API
    try {
      try {
        // Tenta rota de Admin
        const responseAdmin = await api.get(`/alunos/${id}`);
        info = {
          name: responseAdmin.data.name_user,
          photo: responseAdmin.data.foto_user,
          birth: responseAdmin.data.nasc_user,
          medical: responseAdmin.data.estudante?.historico_medico,
          profession: responseAdmin.data.estudante?.profissao_user
        };
        adminPermission = true;
      } catch (err) {
        if (err.response?.status === 403) {
          // Se falhar (403), tenta rota de Instrutor
          const responseInstrutor = await api.get(`/alunos/aluno-instrutor/${id}`, {
              params: { estudante_id: id }
          });
          
          info = {
            name: responseInstrutor.data.name_user,
            photo: responseInstrutor.data.foto_user,
            birth: responseInstrutor.data.nasc_user,
            medical: null,
            profession: null
          };
        } else {
            throw err;
        }
      }
      // Se sucesso, atualiza o estado com dados completos
      setStudentInfo(info);
      setIsAdmin(adminPermission);
    } catch (err) {
        console.warn("Falha ao buscar perfil completo (API retornou erro). Usando dados básicos se disponíveis.", err);
        // Se não tivermos nem os dados da navegação, aí sim mostramos erro
        if (!info) {
            setError("Não foi possível carregar os dados do aluno.");
            setLoading(false);
            return;
        }
        // Se tivermos dados parciais, continuamos sem travar
    }

    // 3. Buscar Histórico de Aulas
    try {
      let historyData = [];

      if (adminPermission) {
         const responseHistory = await api.get(`/agenda/aluno/${id}`);
         historyData = responseHistory.data;
      } else {
         // Instrutor: Tenta buscar histórico
         const startDate = format(subYears(new Date(), 1), 'yyyy-MM-dd');
         const endDate = format(addMonths(new Date(), 1), 'yyyy-MM-dd');
         
         const responseAulas = await api.get('/agenda/minhas_aulas', {
           params: { start_date: startDate, end_date: endDate }
         });
         
         // Filtra aulas onde o ID está presente
         const relevantAulas = responseAulas.data.filter(aula => 
           (aula.participantes || []).includes(parseInt(id)) || 
           (aula.participantes_ids || []).includes(parseInt(id))
         );

         // Busca detalhes para pegar a evolução
         const detailsPromises = relevantAulas.map(async (aula) => {
            try {
                const classDate = aula.dataAgendaAula.split('T')[0];
                const detailRes = await api.get(`/agenda/detalhes_alunos/${aula.AulaID}`, {
                    params: { class_date: classDate }
                });
                return detailRes.data.find(d => d.EstudanteID === parseInt(id));
            } catch (e) { return null; }
         });

         const results = await Promise.all(detailsPromises);
         historyData = results.filter(item => item !== null && item !== undefined);
      }

      historyData.sort((a, b) => new Date(b.DataHoraAula).getTime() - new Date(a.DataHoraAula).getTime());
      setHistory(historyData);

    } catch (histErr) {
      console.warn("Aviso: Não foi possível carregar o histórico de aulas.", histErr);
      // Não define erro global, permite que a tela mostre pelo menos o perfil
      setHistory([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleOpenEvolution = (aula) => {
    setSelectedClass(aula);
    setModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Presente': 'bg-green-100 text-green-800 border-green-200',
      'Falta': 'bg-red-100 text-red-800 border-red-200',
      'Agendada': 'bg-blue-100 text-blue-800 border-blue-200',
      'Reagendada': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Ausência Justificada': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return styles[status] || 'bg-gray-50 text-gray-600 border-gray-200';
  };

  return (
    <div className="flex min-h-screen bg-[#F6F9FF] font-inter">
      <SidebarUnificada
        menuItems={sidebarData.menuItems}
        userInfo={sidebarData.userInfo}
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
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 pt-20 lg:pt-8">
          <div className="max-w-6xl mx-auto">
            
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-[#6B6F7B] hover:text-[#2B668B] mb-6 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Voltar
            </button>

            {loading ? (
               <div className="flex justify-center py-20">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B668B]"></div>
               </div>
            ) : error ? (
               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
            ) : (
              <div className="space-y-6">
                
                {/* Card de Cabeçalho do Aluno */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col md:flex-row gap-6 items-center md:items-start">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0 ring-4 ring-gray-50">
                    {studentInfo?.photo ? (
                      <img src={studentInfo.photo} alt="Aluno" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl text-gray-400 font-bold">{studentInfo?.name?.charAt(0) || '?'}</span>
                    )}
                  </div>
                  <div className="flex-1 text-center md:text-left space-y-2">
                    <h1 className="text-2xl font-bold text-[#111111]">{studentInfo?.name || 'Aluno'}</h1>
                    <p className="text-gray-500">ID: {id}</p>
                    {studentInfo?.birth && (
                       <p className="text-gray-500 text-sm">Nascimento: {format(new Date(studentInfo.birth), 'dd/MM/yyyy')}</p>
                    )}
                    {studentInfo?.profession && (
                       <p className="text-gray-500 text-sm">Profissão: {studentInfo.profession}</p>
                    )}
                  </div>
                </div>

                {/* Histórico Médico (Visível apenas se dados existirem e tiver permissão) */}
                {studentInfo?.medical && (
                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 border-l-4 border-l-[#FF6B6B]">
                    <h2 className="text-lg font-semibold text-[#111111] mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#FF6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      Histórico Médico / Anamnese
                    </h2>
                    <p className="text-gray-600 whitespace-pre-wrap">{studentInfo.medical}</p>
                  </div>
                )}

                {/* Histórico de Evolução / Aulas */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
                    <h2 className="text-lg font-semibold text-[#111111]">Histórico de Evolução</h2>
                    <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                      {history.length} Registros encontrados
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {history.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        {isAdmin 
                            ? "Nenhum registro de aula encontrado para este aluno." 
                            : "Nenhuma aula recente encontrada para registrar evolução."}
                      </div>
                    ) : (
                      history.map((aula) => (
                        <div key={aula._id || aula.id} className="p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-bold text-[#2B668B] text-lg">
                                  {format(parseISO(aula.DataHoraAula), "dd 'de' MMMM, yyyy")}
                                </span>
                                <span className="text-sm text-gray-400 font-medium">
                                  {format(parseISO(aula.DataHoraAula), "HH:mm")}
                                </span>
                              </div>
                              <p className="text-gray-700 font-medium">{aula.disciplina}</p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(aula.StatusPresenca)}`}>
                                {aula.StatusPresenca}
                              </span>
                              
                              <button 
                                onClick={() => handleOpenEvolution(aula)}
                                className="px-4 py-2 text-sm font-semibold text-[#2B668B] border border-[#2B668B] rounded-lg hover:bg-[#2B668B] hover:text-white transition-all"
                              >
                                {aula.NotaEvolucao ? 'Editar Evolução' : 'Registrar Evolução'}
                              </button>
                            </div>
                          </div>

                          {/* Nota de Evolução */}
                          {aula.NotaEvolucao && (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
                              <h4 className="text-xs font-bold text-[#2B668B] uppercase mb-2 tracking-wider">Anotações do Instrutor</h4>
                              <p className="text-gray-700 text-sm whitespace-pre-line">{aula.NotaEvolucao}</p>
                            </div>
                          )}

                          {/* Anexos */}
                          {aula.AnexosLinks && aula.AnexosLinks.length > 0 && (
                            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                              {aula.AnexosLinks.map((link, idx) => (
                                <a key={idx} href={link} target="_blank" rel="noopener noreferrer" className="block w-20 h-20 rounded-lg overflow-hidden border border-gray-200 hover:opacity-80 transition-opacity shrink-0">
                                  <img src={link} alt={`Anexo ${idx}`} className="w-full h-full object-cover" />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        </main>
      </div>

      <EvolucaoModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        aula={selectedClass} 
        onSave={fetchData} 
      />
    </div>
  );
}