import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import React, { useState, useRef, useEffect } from 'react';
import { useSidebar } from "@/context/SidebarContext";

// Dados de exemplo dos estudantes
const sampleStudents = [
  { 
    id: 1, 
    name: 'João Oliveira Silva', 
    modality: 'Yoga'
  },
  { 
    id: 2, 
    name: 'Maria Eduarda Santos', 
    modality: 'Pilates'
  },
  { 
    id: 3, 
    name: 'Pedro Carvalho Silva', 
    modality: 'Curso'
  },
  { 
    id: 4, 
    name: 'Gabriel Marques da Silva', 
    modality: 'Yoga'
  },
  { 
    id: 5, 
    name: 'Allan Martins Silva', 
    modality: 'Pilates'
  },
  { 
    id: 6, 
    name: 'Ana Carolina Lima', 
    modality: 'Curso'
  },
  { 
    id: 7, 
    name: 'Ana Lima', 
    modality: 'Yoga'
  },
  { 
    id: 8, 
    name: 'Carlos Eduardo Rocha', 
    modality: 'Pilates'
  },
  { 
    id: 9, 
    name: 'Fernanda Costa Oliveira', 
    modality: 'Curso'
  },
];

export default function MeusEstudantes() {
  const [students, setStudents] = useState(sampleStudents);
  const [filteredStudents, setFilteredStudents] = useState(sampleStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalityFilter, setModalityFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  
  const { isMobile, sidebarWidth } = useSidebar();

  // Filtros e busca
  useEffect(() => {
    let result = students;
    
    // Filtro por busca
    if (searchTerm) {
      result = result.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.modality.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtro por modalidade
    if (modalityFilter) {
      result = result.filter(student => student.modality === modalityFilter);
    }
    
    // Ordenação
    if (sortBy) {
      result = [...result].sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'modality') return a.modality.localeCompare(b.modality);
        return 0;
      });
    }
    
    setFilteredStudents(result);
  }, [students, searchTerm, modalityFilter, sortBy]);

  // Função para visualizar ficha técnica
  const handleViewTechnicalSheet = (student) => {
    console.log(`Visualizando ficha técnica de ${student.name}`);
    // Aqui você pode implementar a navegação para a ficha técnica ou abrir um modal
  };

  return (
    <div className="flex min-h-screen bg-[#F6F9FF] font-inter">
      {/* Componente da Sidebar com navbar do instrutor */}
      <SidebarUnificada
        menuItems={sidebarConfigs.instrutor.menuItems}
        userInfo={sidebarConfigs.instrutor.userInfo}
        isOpen={menuOpen}
        onOpenChange={setMenuOpen}
      />

      {/* Container do conteúdo principal */}
      <div
        className="flex flex-col flex-1 transition-all duration-300 min-w-0"
        style={{
          marginLeft: !isMobile ? `${sidebarWidth}px` : "0",
          width: !isMobile ? `calc(100% - ${sidebarWidth}px)` : "100%",
        }}
      >
        {/* Conteúdo específico da página Meus Estudantes */}
        <main className="flex-1 flex items-center justify-center py-4 px-3 sm:px-4 lg:px-6 pt-20 sm:pt-6 lg:py-8 pb-6 sm:pb-8">
          <div className={`bg-white rounded-3xl shadow-lg ${isMobile ? 'w-full mx-auto p-4' : 'w-full max-w-7xl mx-auto p-8'}`}>
            
            {/* Cabeçalho */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8">
              <h1 className={`font-bold text-[#111111] ${isMobile ? 'text-2xl mb-4' : 'text-[28px]'}`}>
                Meus Alunos
              </h1>
              
              {/* Barra de pesquisa e Filtros */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Barra de pesquisa */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-[#313A4E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Pesquisar por..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-60 pl-10 pr-4 py-2 border border-[#E1E1E1] rounded-lg bg-white text-[#313A4E] placeholder-[#313A4E] focus:outline-none focus:ring-2 focus:ring-[#2B668B] focus:border-transparent"
                  />
                </div>

                {/* Filtro por modalidade */}
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
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-[#313A4E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Ordenar por */}
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

            {/* Tabela de estudantes */}
            <div className="overflow-hidden">
              {/* Cabeçalho da tabela - apenas desktop */}
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

              {/* Corpo da tabela */}
              <div className="bg-white">
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-8 text-[#6B6F7B]">
                    Nenhum estudante encontrado
                  </div>
                ) : (
                  filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className={`${isMobile ? 'flex flex-col gap-3 p-4' : 'grid grid-cols-12 gap-4 px-6 py-4'} items-center border-b border-[#F5F5F5] hover:bg-gray-50`}
                    >
                      {isMobile ? (
                        <>
                          {/* Mobile Layout */}
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
                          {/* Desktop Layout */}
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