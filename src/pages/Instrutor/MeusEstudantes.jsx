import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import React, { useState, useEffect } from 'react';
import { useSidebar } from "@/context/SidebarContext";
import api from "@/services/api";
import { format, addYears, subYears } from "date-fns";
import { useNavigate } from "react-router-dom"; 

export default function MeusEstudantes() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalityFilter, setModalityFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { isMobile, sidebarWidth } = useSidebar();
  const navigate = useNavigate();

  // Função para buscar os alunos do instrutor através da agenda
  useEffect(() => {
    const fetchMyStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        // Intervalo estendido para garantir que pegamos todas as aulas
        const startDate = format(subYears(new Date(), 5), 'yyyy-MM-dd');
        const endDate = format(addYears(new Date(), 5), 'yyyy-MM-dd');

        console.log(`Buscando aulas entre ${startDate} e ${endDate}`);

        // 1. Buscar TODAS as aulas do instrutor
        const responseAulas = await api.get('/agenda/minhas_aulas', {
          params: {
            start_date: startDate,
            end_date: endDate
          }
        });

        const aulas = responseAulas.data;
        const uniqueStudentMap = new Map();

        // 2. Processar cada aula
        await Promise.all(aulas.map(async (aula) => {
          // Verifica se há participantes (pode vir como 'participantes' ou 'participantes_ids')
          const participantesIds = aula.participantes || aula.participantes_ids || [];

          if (participantesIds.length > 0) {
            let detalhesAlunos = [];
            
            try {
              const classDate = aula.dataAgendaAula.split('T')[0]; 
              // Tenta buscar detalhes adicionais (AgendaAluno)
              const responseDetalhes = await api.get(`/agenda/detalhes_alunos/${aula.AulaID}`, {
                params: { class_date: classDate }
              });
              detalhesAlunos = responseDetalhes.data || [];
            } catch (err) {
              console.warn(`Aviso: Não foi possível buscar detalhes extras para a aula ${aula.AulaID}`);
            }

            // 3. Cruzar dados: Usamos os IDs da aula como fonte da verdade
            participantesIds.forEach(studentId => {
              // Tenta achar o detalhe específico desse aluno na resposta do endpoint de detalhes
              const detalheEncontrado = detalhesAlunos.find(d => d.EstudanteID === studentId);

              if (!uniqueStudentMap.has(studentId)) {
                // Tenta extrair o nome de onde for possível, ou usa o ID como fallback
                // O backend atual para instrutores NÃO envia o nome do aluno por padrão, então usamos o ID.
                const studentName = detalheEncontrado?.nome_estudante || 
                                    detalheEncontrado?.EstudanteNome || 
                                    `Estudante #${studentId}`; 
                
                const studentModality = detalheEncontrado?.disciplina || aula.disciplina || 'Geral';
                
                uniqueStudentMap.set(studentId, {
                  id: studentId,
                  name: studentName, 
                  modality: studentModality, 
                  // Flag para saber se veio do detalhe ou apenas do ID
                  hasDetails: !!detalheEncontrado 
                });
              }
            });
          }
        }));

        const studentsList = Array.from(uniqueStudentMap.values());
        
        // Ordenação padrão
        studentsList.sort((a, b) => a.name.localeCompare(b.name));
        
        console.log("Lista final de estudantes processada:", studentsList);
        setStudents(studentsList);
        setFilteredStudents(studentsList);

      } catch (err) {
        console.error("Erro ao processar lista de alunos:", err);
        setError("Não foi possível carregar a lista. Tente recarregar a página.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyStudents();
  }, []);

  // Filtros e busca
  useEffect(() => {
    let result = students;
    
    if (searchTerm) {
      result = result.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.modality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(student.id).includes(searchTerm) // Permite buscar por ID também
      );
    }
    
    if (modalityFilter) {
      result = result.filter(student => student.modality.toLowerCase() === modalityFilter.toLowerCase());
    }
    
    if (sortBy) {
      result = [...result].sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'modality') return a.modality.localeCompare(b.modality);
        return 0;
      });
    }
    
    setFilteredStudents(result);
  }, [students, searchTerm, modalityFilter, sortBy]);

  const handleViewTechnicalSheet = (student) => {
    console.log(`Visualizando ficha técnica: ${student.name} (ID: ${student.id})`);
    // navigate(`/instrutor/ficha-tecnica/${student.id}`);
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
        <main className="flex-1 flex items-center justify-center py-4 px-3 sm:px-4 lg:px-6 pt-20 sm:pt-6 lg:py-8 pb-6 sm:pb-8">
          <div className={`bg-white rounded-3xl shadow-lg ${isMobile ? 'w-full mx-auto p-4' : 'w-full max-w-7xl mx-auto p-8'}`}>
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8">
              <h1 className={`font-bold text-[#111111] ${isMobile ? 'text-2xl mb-4' : 'text-[28px]'}`}>
                Meus Alunos
              </h1>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-[#313A4E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Pesquisar por nome ou ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-60 pl-10 pr-4 py-2 border border-[#E1E1E1] rounded-lg bg-white text-[#313A4E] placeholder-[#313A4E] focus:outline-none focus:ring-2 focus:ring-[#2B668B] focus:border-transparent"
                  />
                </div>

                {/* Modality Filter */}
                <div className="relative">
                  <select
                    value={modalityFilter}
                    onChange={(e) => setModalityFilter(e.target.value)}
                    className="w-full sm:w-64 pl-4 pr-10 py-2 border border-[#E1E1E1] rounded-lg bg-white text-[#313A4E] focus:outline-none focus:ring-2 focus:ring-[#2B668B] focus:border-transparent appearance-none"
                  >
                    <option value="">Filtrar por modalidade</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Pilates">Pilates</option>
                    <option value="Curso">Curso</option>
                    <option value="Geral">Geral</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-[#313A4E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Sort Filter */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-56 pl-4 pr-10 py-2 border border-[#E1E1E1] rounded-lg bg-white text-[#313A4E] focus:outline-none focus:ring-2 focus:ring-[#2B668B] focus:border-transparent appearance-none"
                  >
                    <option value="">Ordenar por...</option>
                    <option value="name">Nome</option>
                    <option value="modality">Modalidade</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-[#313A4E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                <p>{error}</p>
              </div>
            )}

            {/* Students Table */}
            <div className="overflow-hidden">
              {!isMobile && (
                <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b-2 border-[#F4F4F4] rounded-t-3xl bg-white">
                  <div className="col-span-6">
                    <span className="text-[18px] text-[#6B6F7B] font-medium">Nome / ID</span>
                  </div>
                  <div className="col-span-3">
                    <span className="text-[18px] text-[#6B6F7B] font-medium">Modalidade</span>
                  </div>
                  <div className="col-span-3 flex items-center">
                    <span className="text-[18px] text-[#6B6F7B] font-medium">Ficha Técnica</span>
                  </div>
                </div>
              )}

              <div className="bg-white">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B668B]"></div>
                    <p className="mt-2 text-[#6B6F7B]">Carregando seus alunos...</p>
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="text-center py-8 text-[#6B6F7B]">
                    Nenhum estudante encontrado em suas aulas (verifique se há aulas agendadas com participantes).
                  </div>
                ) : (
                  filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className={`${isMobile ? 'flex flex-col gap-3 p-4' : 'grid grid-cols-12 gap-4 px-6 py-4'} items-center border-b border-[#F5F5F5] hover:bg-gray-50`}
                    >
                      {isMobile ? (
                        <>
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-[#6B6F7B] font-medium flex-shrink-0">Nome:</span>
                            <span className="font-semibold text-[#313A4E] text-right truncate">
                              {student.name}
                            </span>
                          </div>

                          <div className="flex justify-between items-center gap-4">
                            <span className="text-[#6B6F7B] font-medium flex-shrink-0">Modalidade:</span>
                            <span className="font-semibold text-[#313A4E] text-right">
                              {student.modality}
                            </span>
                          </div>

                          <div className="flex flex-col gap-2">
                            <span className="text-[#6B6F7B] font-medium">Ficha Técnica:</span>
                            <button
                              onClick={() => handleViewTechnicalSheet(student)}
                              className="px-4 py-1 bg-[#2B668B] text-white text-[16px] font-semibold rounded-full hover:bg-[#1e4d6b] transition-colors w-fit"
                            >
                              Visualizar
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="col-span-6">
                            <span className="font-semibold text-[#313A4E]">
                              {student.name}
                            </span>
                          </div>

                          <div className="col-span-3">
                            <span className="font-semibold text-[#313A4E]">
                              {student.modality}
                            </span>
                          </div>

                          <div className="col-span-3 flex items-center">
                            <button
                              onClick={() => handleViewTechnicalSheet(student)}
                              className="px-6 py-1 bg-[#2B668B] text-white text-[16px] font-semibold rounded-full hover:bg-[#1e4d6b] transition-colors"
                            >
                              Visualizar
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}