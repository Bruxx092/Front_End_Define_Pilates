import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import React, { useState, useRef, useEffect } from 'react';
import { useSidebar } from "@/context/SidebarContext";
import api from "@/services/api";
import { useNavigate } from 'react-router-dom'; 

export default function Estudantes() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, student: null });
  const [actionMenu, setActionMenu] = useState({ isOpen: false, student: null, position: { x: 0, y: 0 } });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isMobile, sidebarWidth } = useSidebar();
  const actionMenuRef = useRef(null);
  const navigate = useNavigate();

  // Função para buscar todos os alunos
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/alunos/');
      
      console.log("Dados brutos da API (Verifique se 'estudante' existe):", response.data);

      const mappedStudents = response.data.map(user => {
        const phone = user.contatos && user.contatos.length > 0 
          ? user.contatos[0].numero_contato 
          : '-';

        // --- LÓGICA ROBUSTA DE ID ---
        // O Backend tem um bug: a rota /alunos/{id} espera o 'id_estudante' para funcionar (devido ao TargetUserFinder),
        // mas o parametro chama user_id. Se enviarmos id_user, dá 404.
        // Precisamos encontrar o id_estudante a todo custo.
        
        let validStudentId = null;

        // 1. Tenta pegar dentro do objeto 'estudante' (Padrão esperado)
        if (user.estudante && user.estudante.id_estudante) {
            validStudentId = user.estudante.id_estudante;
        }
        // 2. Tenta pegar na raiz (caso a API retorne plano)
        else if (user.id_estudante) {
            validStudentId = user.id_estudante;
        }
        // 3. Tenta variações de caixa (Case Sensitive)
        else if (user.Estudante && user.Estudante.id_estudante) {
            validStudentId = user.Estudante.id_estudante;
        }

        if (!validStudentId) {
            console.warn(`AVISO: Usuário ${user.name_user} (ID User: ${user.id_user}) não tem 'id_estudante' vinculado. A ficha técnica não abrirá.`);
        }

        return {
          id: validStudentId, // ID do ESTUDANTE (para navegação da ficha)
          userId: user.id_user, // ID do USUÁRIO (para exclusão)
          name: user.name_user,
          email: user.email_user,
          phone: phone,
        };
      });

      // Ordenação inicial por nome
      mappedStudents.sort((a, b) => a.name.localeCompare(b.name));

      setStudents(mappedStudents);
      setFilteredStudents(mappedStudents);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar estudantes:", err);
      if (err.response && err.response.status === 403) {
        setError("Sem permissão para listar estudantes.");
      } else {
        setError("Erro ao carregar a lista de estudantes.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filtros e busca
  useEffect(() => {
    let result = students;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(student => 
        student.name.toLowerCase().includes(term) ||
        (student.email && student.email.toLowerCase().includes(term))
      );
    }
    
    if (sortBy) {
      result = [...result].sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'email') return (a.email || '').localeCompare(b.email || '');
        return 0;
      });
    }
    
    setFilteredStudents(result);
  }, [students, searchTerm, sortBy]);

  const handleActionMenuOpen = (student, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const rect = event.currentTarget.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const menuHeight = 150; 
    
    const yPosition = rect.bottom + menuHeight > viewportHeight ? 
      rect.top - menuHeight : rect.bottom;
    
    setActionMenu({
      isOpen: true,
      student,
      position: {
        x: rect.left - 100, 
        y: yPosition
      }
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setActionMenu({ isOpen: false, student: null, position: { x: 0, y: 0 } });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeleteClick = (student) => {
    setDeleteModal({ isOpen: true, student });
    setActionMenu({ isOpen: false, student: null, position: { x: 0, y: 0 } });
  };

  const handleConfirmDelete = async () => {
    if (deleteModal.student) {
      try {
        // Usa userId para deletar o usuário
        const idToDelete = deleteModal.student.userId;
        await api.delete(`/users/${idToDelete}`);
        
        setStudents(prev => prev.filter(student => student.userId !== idToDelete));
        console.log(`Estudante ${deleteModal.student.name} excluído`);
      } catch (err) {
        console.error("Erro ao excluir estudante:", err);
        alert("Erro ao excluir estudante. Verifique se ele possui pendências.");
      }
    }
    setDeleteModal({ isOpen: false, student: null });
  };

  // Função para visualizar ficha técnica com validação
  const handleViewTechnicalSheet = (student) => {
    if (!student.id) {
        // Alerta visual para o usuário entender por que não funciona
        alert(`Não foi possível abrir a ficha técnica de "${student.name}".\n\nMotivo: O sistema não encontrou um ID de estudante vinculado a este usuário. Verifique se o cadastro foi concluído corretamente.`);
        return;
    }
    
    console.log(`Navegando para ficha: ID Estudante=${student.id} (User ID=${student.userId})`);
    // Navega enviando o ID DE ESTUDANTE, que é o que o backend "TargetUserFinder" espera encontrar
    navigate(`/admin/ficha/${student.id}`);
  };

  return (
    <div className="flex min-h-screen bg-[#F6F9FF] font-inter">
      <SidebarUnificada
        menuItems={sidebarConfigs.administrador.menuItems}
        userInfo={sidebarConfigs.administrador.userInfo}
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
            
            {/* Cabeçalho */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8">
              <h1 className={`font-bold text-[#111111] ${isMobile ? 'text-2xl mb-4' : 'text-[28px]'}`}>
                Gerenciar Estudantes
              </h1>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-[#313A4E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-60 pl-10 pr-4 py-2 border border-[#E1E1E1] rounded-lg bg-white text-[#313A4E] placeholder-[#313A4E] focus:outline-none focus:ring-2 focus:ring-[#2B668B] focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-56 pl-4 pr-10 py-2 border border-[#E1E1E1] rounded-lg bg-white text-[#313A4E] focus:outline-none focus:ring-2 focus:ring-[#2B668B] focus:border-transparent appearance-none"
                  >
                    <option value="">Ordenar por...</option>
                    <option value="name">Nome</option>
                    <option value="email">Email</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-[#313A4E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {error && (
                <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                    {error}
                </div>
            )}

            {/* Tabela de estudantes */}
            <div className="overflow-hidden">
              {/* Cabeçalho da tabela - apenas desktop */}
              {!isMobile && (
                <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b-2 border-[#F4F4F4] rounded-t-3xl bg-white">
                  <div className="col-span-4">
                    <span className="text-[18px] text-[#6B6F7B] font-medium">Nome</span>
                  </div>
                  <div className="col-span-4">
                    <span className="text-[18px] text-[#6B6F7B] font-medium">Email</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[18px] text-[#6B6F7B] font-medium">Telefone</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-[18px] text-[#6B6F7B] font-medium">Ações</span>
                  </div>
                </div>
              )}

              {/* Corpo da tabela */}
              <div className="bg-white">
                {loading ? (
                      <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B668B]"></div>
                        <p className="mt-2 text-[#6B6F7B]">Carregando lista de estudantes...</p>
                    </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="text-center py-8 text-[#6B6F7B]">
                    Nenhum estudante encontrado
                  </div>
                ) : (
                  filteredStudents.map((student) => (
                    <div
                      key={student.userId} // Use userId para key
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
                            <span className="text-[#6B6F7B] font-medium flex-shrink-0">Email:</span>
                            <span className="text-[#313A4E] text-right text-sm break-all">
                              {student.email}
                            </span>
                          </div>

                          <div className="flex justify-between items-center gap-4">
                            <span className="text-[#6B6F7B] font-medium flex-shrink-0">Telefone:</span>
                            <span className="text-[#313A4E] text-right">
                              {student.phone}
                            </span>
                          </div>

                          <div className="flex justify-between items-center gap-4">
                            <span className="text-[#6B6F7B] font-medium flex-shrink-0">Ações:</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleViewTechnicalSheet(student)}
                                    // Desabilita visualmente se não tiver ID, mas o clique trata o alerta
                                    className={`px-4 py-1 text-white text-sm rounded-full transition-colors ${!student.id ? 'bg-gray-400' : 'bg-[#2B668B] hover:bg-[#1e4d6b]'}`}
                                >
                                    Ficha
                                </button>
                                <button
                                    onClick={(e) => handleActionMenuOpen(student, e)}
                                    className="p-2 text-[#313A4E] hover:bg-gray-100 rounded-lg transition-colors relative"
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
                          <div className="col-span-4">
                            <span className="font-semibold text-[#313A4E]">
                              {student.name}
                            </span>
                          </div>

                          <div className="col-span-4">
                            <span className="text-[#6B6F7B] text-sm">
                              {student.email}
                            </span>
                          </div>

                          <div className="col-span-2">
                             <span className="text-[#6B6F7B]">
                                {student.phone}
                             </span>
                          </div>

                          <div className="col-span-2 flex justify-end items-center gap-3">
                            <button
                                onClick={() => handleViewTechnicalSheet(student)}
                                className={`text-sm font-medium ${!student.id ? 'text-gray-400' : 'text-[#2B668B] hover:underline'}`}
                            >
                                Ficha Técnica
                            </button>
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
              transform: 'translateX(-50%)'
            } : {}
          }
        >
          <div className="px-4 py-2 text-sm font-bold text-gray-700 border-b border-gray-100">
            Ações para {actionMenu.student?.name}
          </div>
          
          <button
            onClick={() => {
                handleViewTechnicalSheet(actionMenu.student);
                setActionMenu({ ...actionMenu, isOpen: false });
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Visualizar Ficha Técnica
          </button>

          <button
            onClick={() => handleDeleteClick(actionMenu.student)}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors border-t border-gray-100 mt-1"
          >
            Excluir Estudante
          </button>
        </div>
      )}

      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirmar Exclusão
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir o estudante <strong>{deleteModal.student?.name}</strong>? <br/>
              Esta ação removerá o acesso do aluno e todos os seus dados.
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