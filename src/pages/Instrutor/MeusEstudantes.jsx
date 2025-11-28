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

  // Função para buscar os alunos do instrutor
  useEffect(() => {
    const fetchMyStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const startDate = format(subYears(new Date(), 2), 'yyyy-MM-dd');
        const endDate = format(addYears(new Date(), 1), 'yyyy-MM-dd');

        const responseAulas = await api.get('/agenda/minhas_aulas', {
          params: { start_date: startDate, end_date: endDate }
        });

        const aulas = responseAulas.data;
        const uniqueStudentMap = new Map();

        aulas.forEach((aula) => {
          const participantes = aula.participantes || aula.participantes_ids || [];
          
          if (Array.isArray(participantes)) {
            participantes.forEach((studentId) => {
              if (!uniqueStudentMap.has(studentId)) {
                uniqueStudentMap.set(studentId, {
                  id: studentId,
                  name: `Carregando...`, 
                  modality: aula.disciplina || 'Geral',
                  lastClassDate: aula.dataAgendaAula 
                });
              }
            });
          }
        });

        let studentsList = Array.from(uniqueStudentMap.values());

        const enrichedStudents = await Promise.all(
          studentsList.map(async (student) => {
            try {
              const responseName = await api.get(`/alunos/aluno-instrutor/${student.id}`, {
                params: {
                  estudante_id: student.id 
                }
              });
              
              if (responseName.data && responseName.data.name_user) {
                return {
                  ...student,
                  name: responseName.data.name_user, 
                  photo: responseName.data.foto_user
                };
              }
            } catch (err) {
              console.warn(`Não foi possível obter nome para o ID ${student.id}`, err);
              return {
                ...student,
                name: `Estudante #${student.id}`
              };
            }
            return student;
          })
        );
        
        enrichedStudents.sort((a, b) => a.name.localeCompare(b.name));
        
        setStudents(enrichedStudents);
        setFilteredStudents(enrichedStudents);

      } catch (err) {
        console.error("Erro ao buscar lista de alunos:", err);
        if (err.response && err.response.status === 403) {
             setError("Sessão expirada ou sem permissão. Tente recarregar.");
        } else {
             setError("Não foi possível carregar a lista de alunos.");
        }
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
      const term = searchTerm.toLowerCase();
      result = result.filter(student => 
        student.name.toLowerCase().includes(term) ||
        student.modality.toLowerCase().includes(term) ||
        String(student.id).includes(term)
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
    // Envia os dados do aluno via STATE para que a próxima tela não precise depender 100% da API que está falhando
    navigate(`/instrutor/ficha-tecnica/${student.id}`, { 
        state: { studentData: student } 
    });
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
                    placeholder="Buscar por nome..."
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
                    <span className="text-[18px] text-[#6B6F7B] font-medium">Nome</span>
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
                    Nenhum estudante encontrado em suas aulas recentes.
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
                            <button
                              onClick={() => handleViewTechnicalSheet(student)}
                              className="px-4 py-1 bg-[#2B668B] text-white text-[16px] font-semibold rounded-full hover:bg-[#1e4d6b] transition-colors w-fit"
                            >
                              Ver Ficha
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
                              Ver Ficha
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