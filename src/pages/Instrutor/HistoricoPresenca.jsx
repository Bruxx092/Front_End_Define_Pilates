// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import { useSidebar } from "@/context/SidebarContext";

// Dados de exemplo - serão substituídos pela API
const sampleHistorico = {
  aluno: {
    id: 1,
    nome: "Gabriel Marques",
    foto: "/src/assets/gabrielEstudante.png"
  },
  registros: [
    { 
      id: 1, 
      data: "17/09", 
      horario: "10:00",
      status: "presente" 
    },
    { 
      id: 2, 
      data: "10/09", 
      horario: "10:00",
      status: "ausente" 
    },
    { 
      id: 3, 
      data: "03/09", 
      horario: "10:00",
      status: "justificada" 
    },
    { 
      id: 4, 
      data: "27/08", 
      horario: "10:00",
      status: "presente" 
    }
  ]
};

// Dados adicionais para o dropdown
const aulasDisponiveis = [
  { id: 1, data: "17/09", horario: "10:00" },
  { id: 2, data: "10/09", horario: "10:00" },
  { id: 3, data: "03/09", horario: "10:00" },
  { id: 4, data: "27/08", horario: "10:00" },
  { id: 5, data: "24/09", horario: "10:00" },
  { id: 6, data: "01/10", horario: "10:00" },
  { id: 7, data: "08/10", horario: "10:00" }
];

export default function HistoricoPresenca() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile, sidebarWidth } = useSidebar();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedAula, setSelectedAula] = useState(aulasDisponiveis[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [historico, setHistorico] = useState(sampleHistorico);
  const [dadosTurma, setDadosTurma] = useState({
    turma: "Pilates Avançado",
    horario: "10:00 - 11:00 (Quarta-Feira)",
    instrutor: "Vitor Luiz"
  });

  // Carregar dados da navegação
  useEffect(() => {
    if (location.state) {
      setDadosTurma({
        turma: location.state.turma || "Pilates Avançado",
        horario: location.state.horario || "10:00 - 11:00 (Quarta-Feira)",
        instrutor: location.state.instrutor || "Vitor Luiz"
      });
      
      // Aqui você faria uma chamada API para buscar o histórico do aluno
      // baseado no location.state.alunoId
    }
  }, [location.state]);

  // Função para atualizar status
  const atualizarStatus = (registroId, novoStatus) => {
    setHistorico(prev => ({
      ...prev,
      registros: prev.registros.map(registro =>
        registro.id === registroId
          ? { ...registro, status: novoStatus }
          : registro
      )
    }));
  };

  // Função para adicionar novo registro
  const adicionarRegistro = () => {
    // Verificar se já existe registro para esta data
    const registroExistente = historico.registros.find(
      r => r.data === selectedAula.data
    );

    if (!registroExistente) {
      const novoRegistro = {
        id: Date.now(), // ID temporário
        data: selectedAula.data,
        horario: selectedAula.horario,
        status: 'presente' // Status padrão
      };

      setHistorico(prev => ({
        ...prev,
        registros: [novoRegistro, ...prev.registros]
      }));
    }
  };

  // Verificar se a aula selecionada já tem registro
  const aulaTemRegistro = historico.registros.some(
    r => r.data === selectedAula.data
  );

  // Obter registro atual para a aula selecionada
  const getRegistroAtual = () => {
    return historico.registros.find(r => r.data === selectedAula.data);
  };

  // Função para obter cor do status
  const getStatusColor = (status) => {
    switch (status) {
      case 'presente': return '#17E383';
      case 'ausente': return '#FF4848';
      case 'justificada': return '#FFC548';
      default: return '#6B7280';
    }
  };

  // Função para obter texto do status
  const getStatusText = (status) => {
    switch (status) {
      case 'presente': return 'Presente';
      case 'ausente': return 'Ausente';
      case 'justificada': return 'Falta (Justificada)';
      default: return 'Não registrado';
    }
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
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <span className="font-bold text-[#555555] text-lg sm:text-xl">TURMA:</span>
                  <p className="text-black text-lg sm:text-xl">{dadosTurma.turma}</p>
                </div>
                <div>
                  <span className="font-bold text-[#555555] text-lg sm:text-xl">HORÁRIO:</span>
                  <p className="text-black text-lg sm:text-xl">{dadosTurma.horario}</p>
                </div>
                <div>
                  <span className="font-bold text-[#555555] text-lg sm:text-xl">INSTRUTOR:</span>
                  <p className="text-black text-lg sm:text-xl">{dadosTurma.instrutor}</p>
                </div>
              </div>

              {/* Informações do Aluno */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={historico.aluno.foto}
                      alt={historico.aluno.nome}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/src/assets/placeholder-user.png';
                      }}
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <div className="mb-2">
                      <span className="font-bold text-[#555555] text-lg">NOME:</span>
                      <p className="text-black text-xl font-semibold">{historico.aluno.nome}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selecionar Aula */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
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
                      {aulasDisponiveis.map((aula) => (
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

                {/* Botão para adicionar registro se não existir */}
                {!aulaTemRegistro && (
                  <button
                    onClick={adicionarRegistro}
                    className="bg-[#2B668B] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1e4d6b] transition-colors whitespace-nowrap"
                  >
                    Registrar Presença
                  </button>
                )}
              </div>

              {/* Status da Aula Selecionada */}
              {aulaTemRegistro && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                  <h3 className="font-bold text-lg text-[#555555] mb-4">
                    Status para {selectedAula.data}:
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {/* Presente */}
                    <button
                      onClick={() => {
                        const registro = getRegistroAtual();
                        if (registro) {
                          atualizarStatus(registro.id, 'presente');
                        }
                      }}
                      className={`px-6 py-3 rounded-2xl font-bold text-white transition-colors ${
                        getRegistroAtual()?.status === 'presente' 
                          ? 'bg-[#17E383]' 
                          : 'bg-gray-400 hover:bg-[#17E383]'
                      }`}
                    >
                      Presente
                    </button>
                    
                    {/* Ausente */}
                    <button
                      onClick={() => {
                        const registro = getRegistroAtual();
                        if (registro) {
                          atualizarStatus(registro.id, 'ausente');
                        }
                      }}
                      className={`px-6 py-3 rounded-2xl font-bold text-white transition-colors ${
                        getRegistroAtual()?.status === 'ausente' 
                          ? 'bg-[#FF4848]' 
                          : 'bg-gray-400 hover:bg-[#FF4848]'
                      }`}
                    >
                      Ausente
                    </button>
                    
                    {/* Falta Justificada */}
                    <button
                      onClick={() => {
                        const registro = getRegistroAtual();
                        if (registro) {
                          atualizarStatus(registro.id, 'justificada');
                        }
                      }}
                      className={`px-6 py-3 rounded-2xl font-bold text-white transition-colors ${
                        getRegistroAtual()?.status === 'justificada' 
                          ? 'bg-[#FFC548]' 
                          : 'bg-gray-400 hover:bg-[#FFC548]'
                      }`}
                    >
                      Falta (Justificada)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Histórico de Registros */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-[#555555]">Histórico de Presenças</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {historico.registros.map((registro) => (
                  <div key={registro.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-black mb-1">
                          Aula {registro.data} - {registro.horario}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getStatusColor(registro.status) }}
                          />
                          <span 
                            className="font-medium"
                            style={{ color: getStatusColor(registro.status) }}
                          >
                            {getStatusText(registro.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => atualizarStatus(registro.id, 'presente')}
                          className={`px-4 py-2 rounded-2xl text-sm font-bold text-white transition-colors ${
                            registro.status === 'presente' 
                              ? 'bg-[#17E383]' 
                              : 'bg-gray-400 hover:bg-[#17E383]'
                          }`}
                        >
                          Presente
                        </button>
                        
                        <button
                          onClick={() => atualizarStatus(registro.id, 'ausente')}
                          className={`px-4 py-2 rounded-2xl text-sm font-bold text-white transition-colors ${
                            registro.status === 'ausente' 
                              ? 'bg-[#FF4848]' 
                              : 'bg-gray-400 hover:bg-[#FF4848]'
                          }`}
                        >
                          Ausente
                        </button>
                        
                        <button
                          onClick={() => atualizarStatus(registro.id, 'justificada')}
                          className={`px-4 py-2 rounded-2xl text-sm font-bold text-white transition-colors ${
                            registro.status === 'justificada' 
                              ? 'bg-[#FFC548]' 
                              : 'bg-gray-400 hover:bg-[#FFC548]'
                          }`}
                        >
                          Justificada
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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