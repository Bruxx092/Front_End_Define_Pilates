import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import React, { useState, useRef, useEffect } from 'react';
import { useSidebar } from "@/context/SidebarContext";

// Dados de exemplo dos estudantes
const sampleStudents = [
  { 
    id: 1, 
    name: 'João Oliveira Silva', 
    modality: 'Yoga', 
    status: 'Ativo',
    course: 'Curso Completo de Yoga',
    lastPayment: '2024-01-15'
  },
  { 
    id: 2, 
    name: 'Maria Eduarda Santos', 
    modality: 'Pilates', 
    status: 'Inativo',
    course: 'Pilates Básico',
    lastPayment: '2023-12-10'
  },
  { 
    id: 3, 
    name: 'Pedro Carvalho Silva', 
    modality: 'Curso', 
    status: 'Ativo',
    course: 'Curso de Meditação',
    lastPayment: '2024-01-20'
  },
  { 
    id: 4, 
    name: 'Gabriel Marques da Silva', 
    modality: 'Yoga', 
    status: 'Ativo',
    course: 'Yoga Avançado',
    lastPayment: '2024-01-18'
  },
  { 
    id: 5, 
    name: 'Allan Martins Silva', 
    modality: 'Pilates', 
    status: 'Pagamento em atraso',
    course: 'Pilates Intermediário',
    lastPayment: '2023-11-30'
  },
  { 
    id: 6, 
    name: 'Ana Carolina Lima', 
    modality: 'Yoga', 
    status: 'Ativo',
    course: 'Yoga para Iniciantes',
    lastPayment: '2024-01-22'
  },
  { 
    id: 7, 
    name: 'Ana Lima', 
    modality: 'Curso', 
    status: 'Ativo',
    course: 'Yoga para Iniciantes',
    lastPayment: '2024-01-22'
  },
  { 
    id: 8, 
    name: 'Carlos Eduardo Rocha', 
    modality: 'Pilates', 
    status: 'Ativo',
    course: 'Pilates Avançado',
    lastPayment: '2024-01-25'
  },
  { 
    id: 9, 
    name: 'Fernanda Costa Oliveira', 
    modality: 'Yoga', 
    status: 'Inativo',
    course: 'Yoga Terapêutico',
    lastPayment: '2023-12-15'
  },
  { 
    id: 10, 
    name: 'Rafael Souza Santos', 
    modality: 'Curso', 
    status: 'Pagamento em atraso',
    course: 'Curso de Alongamento',
    lastPayment: '2023-11-20'
  },
  { 
    id: 11, 
    name: 'Juliana Almeida Pereira', 
    modality: 'Pilates', 
    status: 'Ativo',
    course: 'Pilates para Gestantes',
    lastPayment: '2024-01-28'
  },
  { 
    id: 12, 
    name: 'Roberto Nunes Lima', 
    modality: 'Yoga', 
    status: 'Ativo',
    course: 'Yoga para Idosos',
    lastPayment: '2024-01-30'
  }
];

export default function Estudantes() {
  const [students, setStudents] = useState(sampleStudents);
  const [filteredStudents, setFilteredStudents] = useState(sampleStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalityFilter, setModalityFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, student: null });
  const [actionMenu, setActionMenu] = useState({ isOpen: false, student: null, position: { x: 0, y: 0 } });
  const [customModality, setCustomModality] = useState('');
  
  const { isMobile, sidebarWidth } = useSidebar();
  const tableRef = useRef(null);
  const actionMenuRef = useRef(null);

  // Filtros e busca
  useEffect(() => {
    let result = students;
    
    // Filtro por busca
    if (searchTerm) {
      result = result.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.modality.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtro por status
    if (statusFilter) {
      result = result.filter(student => student.status === statusFilter);
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
        if (sortBy === 'status') return a.status.localeCompare(b.status);
        return 0;
      });
    }
    
    setFilteredStudents(result);
  }, [students, searchTerm, statusFilter, modalityFilter, sortBy]);

  // Status options
  const statusOptions = ['Ativo', 'Inativo', 'Pagamento em atraso'];

  // Função para abrir menu de ações
  const handleActionMenuOpen = (student, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const rect = event.currentTarget.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const menuHeight = 280;
    
    const yPosition = rect.bottom + menuHeight > viewportHeight ? 
      rect.top - menuHeight : rect.bottom;
    
    setActionMenu({
      isOpen: true,
      student,
      position: {
        x: rect.left,
        y: yPosition
      }
    });
    setCustomModality(''); // Limpa o campo quando abre o menu
  };

  // Fechar menu de ações ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setActionMenu({ isOpen: false, student: null, position: { x: 0, y: 0 } });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Função para alterar status
  const handleStatusChange = (studentId, newStatus) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, status: newStatus } : student
    ));
    setActionMenu({ isOpen: false, student: null, position: { x: 0, y: 0 } });
  };

  // Função para alterar modalidade
  const handleModalityChange = (studentId, newModality) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, modality: newModality } : student
    ));
    setActionMenu({ isOpen: false, student: null, position: { x: 0, y: 0 } });
  };

  // Função para aplicar modalidade customizada
  const handleCustomModality = () => {
    if (customModality.trim() && actionMenu.student) {
      handleModalityChange(actionMenu.student.id, customModality.trim());
    }
  };

  // Função para abrir modal de exclusão
  const handleDeleteClick = (student) => {
    setDeleteModal({ isOpen: true, student });
    setActionMenu({ isOpen: false, student: null, position: { x: 0, y: 0 } });
  };

  // Função para confirmar exclusão
  const handleConfirmDelete = () => {
    if (deleteModal.student) {
      setStudents(prev => prev.filter(student => student.id !== deleteModal.student.id));
      console.log(`Estudante ${deleteModal.student.name} excluído`);
    }
    setDeleteModal({ isOpen: false, student: null });
  };

  // Função para visualizar ficha técnica
  const handleViewTechnicalSheet = (student) => {
    console.log(`Visualizando ficha técnica de ${student.name}`);
  };

  // Obter cor do status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo': return '#17E383';
      case 'Inativo': return '#AFAFAF';
      case 'Pagamento em atraso': return '#FF4848';
      default: return '#313A4E';
    }
  };

  // Obter cor da borda do status
  const getStatusBorderColor = (status) => {
    switch (status) {
      case 'Ativo': return '#17E383';
      case 'Inativo': return '#AFAFAF';
      case 'Pagamento em atraso': return '#FF4848';
      default: return '#313A4E';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F6F9FF] font-inter">
      {/* Componente da Sidebar */}
      <SidebarUnificada
        menuItems={sidebarConfigs.administrador.menuItems}
        userInfo={sidebarConfigs.administrador.userInfo}
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
        {/* Conteúdo específico da página Estudantes */}
        <main className="flex-1 flex items-center justify-center py-4 px-3 sm:px-4 lg:px-6 pt-20 sm:pt-6 lg:py-8 pb-6 sm:pb-8">
          <div className={`bg-white rounded-3xl shadow-lg ${isMobile ? 'w-full mx-auto p-4' : 'w-full max-w-7xl mx-auto p-8'}`}>
            
            {/* Cabeçalho */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8">
              <h1 className={`font-bold text-[#111111] ${isMobile ? 'text-2xl mb-4' : 'text-[28px]'}`}>
                Estudantes
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

                {/* Filtro por status */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full sm:w-40 pl-4 pr-10 py-2 border border-[#E1E1E1] rounded-lg bg-white text-[#313A4E] focus:outline-none focus:ring-2 focus:ring-[#2B668B] focus:border-transparent appearance-none"
                  >
                    <option value="">Status</option>
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
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
                    <option value="status">Status</option>
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
    <div className="col-span-4">
      <span className="text-[18px] text-[#6B6F7B] font-medium">Nome</span>
    </div>
    <div className="col-span-2">
      <span className="text-[18px] text-[#6B6F7B] font-medium">Modalidade</span>
    </div>
    <div className="col-span-2">
      <span className="text-[18px] text-[#6B6F7B] font-medium">Status</span>
    </div>
    <div className="col-span-2 flex items-center ml-16">
      <span className="text-[18px] text-[#6B6F7B] font-medium">Ficha Técnica</span>
    </div>
    <div className="col-span-2 text-right">
      <span className="text-[18px] text-[#6B6F7B] font-medium">Ações</span>
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
                  filteredStudents.map((student, index) => (
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

                          <div className="flex justify-between items-center gap-4">
                            <span className="text-[#6B6F7B] font-medium flex-shrink-0">Status:</span>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full border-4 flex-shrink-0"
                                style={{ borderColor: getStatusBorderColor(student.status) }}
                              />
                              <span 
                                className="font-medium whitespace-nowrap"
                                style={{ color: getStatusColor(student.status) }}
                              >
                                {student.status}
                              </span>
                            </div>
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

                          <div className="flex justify-between items-center gap-4">
                            <span className="text-[#6B6F7B] font-medium flex-shrink-0">Ações:</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => handleActionMenuOpen(student, e)}
                                className="p-2 text-[#313A4E] hover:bg-gray-100 rounded-lg transition-colors relative"
                                title="Mais opções"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
{/* Desktop Layout */}
<div className="col-span-4">
  <span className="font-semibold text-[#313A4E]">
    {student.name}
  </span>
</div>

<div className="col-span-2">
  <span className="font-semibold text-[#313A4E]">
    {student.modality}
  </span>
</div>

<div className="col-span-2 flex items-center">
  <div className="flex items-center gap-2">
    <div 
      className="w-4 h-4 rounded-full border-4 flex-shrink-0"
      style={{ borderColor: getStatusBorderColor(student.status) }}
    />
    <span 
      className="font-medium whitespace-nowrap"
      style={{ color: getStatusColor(student.status) }}
    >
      {student.status}
    </span>
  </div>
</div>

<div className="col-span-2 flex items-center ml-16">
  <button
    onClick={() => handleViewTechnicalSheet(student)}
    className="px-6 py-1 bg-[#2B668B] text-white text-[16px] font-semibold rounded-full hover:bg-[#1e4d6b] transition-colors"
  >
    Visualizar
  </button>
</div>

<div className="col-span-2 flex justify-end items-center">
  <button
    onClick={(e) => handleActionMenuOpen(student, e)}
    className="p-2 text-[#313A4E] hover:bg-gray-100 rounded-lg transition-colors relative"
    title="Mais opções"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
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

      {/* Menu de ações (três pontos) */}
      {actionMenu.isOpen && (
        <div
          ref={actionMenuRef}
          className={`fixed bg-white shadow-lg rounded-lg py-2 z-50 border border-gray-200 ${
            isMobile 
              ? 'w-11/12 max-w-xs bottom-4 left-1/2 transform -translate-x-1/2' 
              : 'min-w-48'
          }`}
          style={
            !isMobile ? {
              left: `${actionMenu.position.x}px`,
              top: `${actionMenu.position.y}px`,
              transform: 'translateX(-100%)'
            } : {}
          }
        >
          {/* Alterar Status */}
          <div className="px-4 py-2 text-sm font-bold text-gray-700 border-b border-gray-100">
            Alterar Status
          </div>
          {statusOptions.map(status => (
            <button
              key={status}
              onClick={() => handleStatusChange(actionMenu.student.id, status)}
              className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {status}
            </button>
          ))}
          
          {/* Alterar Modalidade */}
          <div className="px-4 py-2 text-sm font-bold text-gray-700 border-b border-gray-100 mt-2">
            Alterar Modalidade
          </div>
          <div className="px-4 py-2">
            <input
              type="text"
              placeholder="Digite a modalidade..."
              value={customModality}
              onChange={(e) => setCustomModality(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B668B] focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCustomModality();
                }
              }}
            />
            <button
              onClick={handleCustomModality}
              className="w-full mt-2 px-3 py-2 bg-[#2B668B] text-white text-sm rounded-lg hover:bg-[#1e4d6b] transition-colors"
            >
              Aplicar Modalidade
            </button>
            <div className="flex flex-wrap gap-1 mt-2">
              {['Yoga', 'Pilates', 'Curso', 'Alongamento', 'Meditação'].map(modality => (
                <button
                  key={modality}
                  onClick={() => handleModalityChange(actionMenu.student.id, modality)}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                  {modality}
                </button>
              ))}
            </div>
          </div>
          
          {/* Excluir */}
          <div className="px-4 py-2 text-sm font-bold text-gray-700 border-b border-gray-100 mt-2">
            Ações
          </div>
          <button
            onClick={() => handleDeleteClick(actionMenu.student)}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
          >
            Excluir Estudante
          </button>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirmar Exclusão
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir o estudante <strong>{deleteModal.student?.name}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, student: null })}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}