// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import { useSidebar } from "@/context/SidebarContext";

// Dados de exemplo - serão substituídos pela API
const sampleData = {
  turma: "Pilates Avançado",
  horario: "10:00 - 11:00 (Quarta-Feira)",
  instrutor: "Vitor Luiz",
  aulas: [
    { id: 1, data: "17/09", horario: "10:00" },
    { id: 2, data: "10/09", horario: "10:00" },
    { id: 3, data: "03/09", horario: "10:00" },
    { id: 4, data: "27/08", horario: "10:00" },
    { id: 5, data: "24/09", horario: "10:00" },
    { id: 6, data: "01/10", horario: "10:00" }
  ],
  alunos: [
    { 
      id: 1, 
      nome: "Gabriel Marques", 
      foto: "/src/assets/gabrielEstudante.png",
      presencas: {
        "10/09": "ausente",
        "03/09": "justificada"
      }
    },
    { 
      id: 2, 
      nome: "Allana Martins", 
      foto: "/src/assets/allanaEstudante.png",
      presencas: {
        "10/09": "presente"
      }
    },
    { 
      id: 3, 
      nome: "Pedro Henrique", 
      foto: "/src/assets/pedroEstudante.png",
      presencas: {
        "10/09": "presente"
      }
    },
    { 
      id: 4, 
      nome: "João Silva", 
      foto: "/src/assets/gabrielEstudante.png",
      presencas: {}
    },
    { 
      id: 5, 
      nome: "Maria Santos", 
      foto: "/src/assets/allanaEstudante.png",
      presencas: {}
    },
    { 
      id: 6, 
      nome: "Carlos Oliveira", 
      foto: "/src/assets/pedroEstudante.png",
      presencas: {}
    },
    { 
      id: 7, 
      nome: "Ana Costa", 
      foto: "/src/assets/allanaEstudante.png",
      presencas: {}
    },
    { 
      id: 8, 
      nome: "Paula Rodrigues", 
      foto: "/src/assets/allanaEstudante.png",
      presencas: {}
    }
  ]
};

export default function RegistroPresenca() {
  const navigate = useNavigate();
  const { isMobile, sidebarWidth } = useSidebar();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedAula, setSelectedAula] = useState(sampleData.aulas[0]);
  const [alunos, setAlunos] = useState(sampleData.alunos);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Função para atualizar presença
  const atualizarPresenca = (alunoId, status) => {
    setAlunos(prev => prev.map(aluno => {
      if (aluno.id === alunoId) {
        const novasPresencas = {
          ...aluno.presencas,
          [selectedAula.data]: status
        };
        return {
          ...aluno,
          presencas: novasPresencas
        };
      }
      return aluno;
    }));
  };

  // Função para obter status atual do aluno para a aula selecionada
  const getStatusAtual = (aluno) => {
    return aluno.presencas[selectedAula.data] || null;
  };

  // Função para navegar para o histórico
  const verHistorico = (alunoId) => {
    navigate('/instrutor/historico-presenca', { 
      state: { 
        alunoId,
        turma: sampleData.turma,
        horario: sampleData.horario,
        instrutor: sampleData.instrutor
      }
    });
  };

  // Calcular layout responsivo
  const getGridClasses = () => {
    if (isMobile) {
      return 'grid-cols-1 gap-4';
    }
    const count = alunos.length;
    if (count <= 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';
    if (count <= 6) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';
  };

  return (
    <div className="flex min-h-screen bg-[#F6F9FF] font-inter">
      {/* Sidebar do Instrutor */}
      <SidebarUnificada
        menuItems={sidebarConfigs.instrutor.menuItems}
        userInfo={sidebarConfigs.instrutor.userInfo}
        isOpen={menuOpen}
        onOpenChange={setMenuOpen}
      />

      {/* Conteúdo Principal */}
      <div
        className="flex flex-col flex-1 transition-all duration-300 min-w-0"
        style={{
          marginLeft: !isMobile ? `${sidebarWidth}px` : "0",
          width: !isMobile ? `calc(100% - ${sidebarWidth}px)` : "100%",
        }}
      >
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 sm:pt-6">
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 max-w-7xl mx-auto">
            
            {/* Cabeçalho */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#555555] mb-6">
                REGISTRO DE PRESENÇA
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <span className="font-bold text-[#555555] text-lg sm:text-xl">TURMA:</span>
                  <p className="text-black text-lg sm:text-xl">{sampleData.turma}</p>
                </div>
                <div>
                  <span className="font-bold text-[#555555] text-lg sm:text-xl">HORÁRIO:</span>
                  <p className="text-black text-lg sm:text-xl">{sampleData.horario}</p>
                </div>
                <div>
                  <span className="font-bold text-[#555555] text-lg sm:text-xl">INSTRUTOR:</span>
                  <p className="text-black text-lg sm:text-xl">{sampleData.instrutor}</p>
                </div>
              </div>

              {/* Selecionar Aula */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                <span className="font-bold text-black text-lg sm:text-xl whitespace-nowrap">
                  Selecionar Aula:
                </span>
                <div className="relative w-full sm:w-64">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex justify-between items-center shadow-sm hover:border-gray-400 transition-colors"
                  >
                    <span className="text-black">{selectedAula.data} - {selectedAula.horario}</span>
                    <svg 
                      className={`w-5 h-5 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {sampleData.aulas.map((aula) => (
                        <button
                          key={aula.id}
                          onClick={() => {
                            setSelectedAula(aula);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <span className="text-black">{aula.data} - {aula.horario}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Grid de Alunos */}
            <div className={`grid ${getGridClasses()}`}>
              {alunos.map((aluno) => {
                const statusAtual = getStatusAtual(aluno);
                
                return (
                  <div key={aluno.id} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                    {/* Foto do Aluno */}
                    <div className="h-48 sm:h-56 bg-gray-200 relative">
                      <img
                        src={aluno.foto}
                        alt={aluno.nome}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/src/assets/placeholder-user.png';
                        }}
                      />
                    </div>
                    
                    {/* Informações do Aluno */}
                    <div className="p-4">
                      <div className="mb-3">
                        <span className="font-bold text-black text-sm">NOME:</span>
                        <p className="text-black font-semibold truncate">{aluno.nome}</p>
                      </div>
                      
                      {/* Botões de Status */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {/* Presente */}
                        <button
                          onClick={() => atualizarPresenca(aluno.id, 'presente')}
                          className={`py-2 px-1 rounded-2xl text-xs font-bold text-white transition-colors ${
                            statusAtual === 'presente' 
                              ? 'bg-[#17E383]' 
                              : 'bg-gray-400 hover:bg-[#17E383]'
                          }`}
                        >
                          Presente
                        </button>
                        
                        {/* Ausente */}
                        <button
                          onClick={() => atualizarPresenca(aluno.id, 'ausente')}
                          className={`py-2 px-1 rounded-2xl text-xs font-bold text-white transition-colors ${
                            statusAtual === 'ausente' 
                              ? 'bg-[#FF4848]' 
                              : 'bg-gray-400 hover:bg-[#FF4848]'
                          }`}
                        >
                          Ausente
                        </button>
                        
                        {/* Falta Justificada */}
                        <button
                          onClick={() => atualizarPresenca(aluno.id, 'justificada')}
                          className={`py-2 px-1 rounded-2xl text-xs font-bold text-white transition-colors ${
                            statusAtual === 'justificada' 
                              ? 'bg-[#FFC548]' 
                              : 'bg-gray-400 hover:bg-[#FFC548]'
                          }`}
                        >
                          Falta (Justificada)
                        </button>
                      </div>
                      
                      {/* Botão Ver Histórico */}
                      <button
                        onClick={() => verHistorico(aluno.id)}
                        className="w-full bg-[#2B668B] text-white py-2 rounded-2xl font-semibold hover:bg-[#1e4d6b] transition-colors text-sm"
                      >
                        VER HISTÓRICO
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* Overlay para dropdown */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-0"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}