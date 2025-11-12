// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
// --- API FUTURA: Descomente para usar ---
// import axios from "axios";
import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import { useSidebar } from "@/context/SidebarContext";

// =======================================================================
// CONFIGURAÇÃO DA API E MOCKS
// =======================================================================

// 🚀 Alterne para 'false' para usar a API real
const USE_MOCKS = true;

// --- API FUTURA: Configure sua URL base ---
const API_BASE_URL = import.meta.env.VITE_API_BASE || "";
const ENDPOINTS = {
  COLABORADORES: "/api/colaboradores",
  COLABORADOR_POR_ID: (id) => `/api/colaboradores/${id}`,
};

// --- MOCK: Lista de Colaboradores (Admins/Recepcionistas) ---
// 🔔 CORREÇÃO: Removido 'modalidade', adicionado 'cargo' e 'email'
const mockColaboradores = [
  { id: 1, nome: "Ana Souza", cargo: "Admin", email: "ana.souza@admin.com" },
  { id: 2, nome: "Carlos Souza", cargo: "Recepcionista", email: "carlos@recepcao.com" },
  { id: 3, nome: "Samara da Silva", cargo: "Recepcionista", email: "samara@recepcao.com" },
  { id: 4, nome: "Bruno Costa", cargo: "Admin", email: "bruno.costa@admin.com" },
  { id: 5, nome: "Wandinha Gomes", cargo: "Recepcionista", email: "wandinha@recepcao.com" },
];

/**
 * --- API FUTURA: Obtém o token de autenticação (ex: do localStorage) ---
 */
const getToken = () => {
  const token = localStorage.getItem("token");
  // if (!token) throw new Error("Usuário não autenticado.");
  return token;
};

/**
 * --- API FUTURA: Função para buscar os colaboradores ---
 */
const apiFetchColaboradores = async () => {
  if (USE_MOCKS) {
    await new Promise(res => setTimeout(res, 500)); // Simula delay
    return mockColaboradores;
  }
  
  // --- API REAL ---
  // try {
  //   const token = getToken();
  //   const { data } = await axios.get(
  //     `${API_BASE_URL}${ENDPOINTS.COLABORADORES}`,
  //     { headers: { Authorization: `Bearer ${token}` } }
  //   );
  //   return data;
  // } catch (err) {
  //   console.error("Erro ao buscar colaboradores:", err);
  //   throw new Error("Não foi possível carregar os colaboradores.");
  // }
  
  // Placeholder (remover ao usar axios)
  return [];
};


// =======================================================================
// COMPONENTE PRINCIPAL
// =======================================================================
export default function ColaboradoresPage() {
  const navigate = useNavigate();
  const { isMobile, sidebarWidth } = useSidebar();
  const [menuOpen, setMenuOpen] = useState(false);

  // Estados da lista
  const [colaboradores, setColaboradores] = useState([]);
  
  // Estados de Filtro e Ordenação
  const [busca, setBusca] = useState("");
  // 🔔 CORREÇÃO: Trocado 'modalidadeFiltro' por 'cargoFiltro'
  const [cargoFiltro, setCargoFiltro] = useState("");
  const [ordenacao, setOrdenacao] = useState("");

  // Estados para consumo da API
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // Usar 'null' para erro

  // Efeito para carregar os dados
  useEffect(() => {
    const fetchDados = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiFetchColaboradores();
        setColaboradores(data);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar os colaboradores.");
        // Em caso de erro, ainda pode-se optar por mostrar mocks
        // setColaboradores(mockColaboradores); 
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDados();
  }, []); // Roda apenas uma vez

  // Filtragem e ordenação
  const colaboradoresFiltrados = colaboradores
    .filter(
      (c) =>
        c.nome.toLowerCase().includes(busca.toLowerCase()) &&
        // 🔔 CORREÇÃO: Filtrando por 'cargo'
        (cargoFiltro ? c.cargo === cargoFiltro : true)
    )
    .sort((a, b) => {
      if (ordenacao === "nomeAZ") return a.nome.localeCompare(b.nome);
      if (ordenacao === "nomeZA") return b.nome.localeCompare(a.nome);
      return 0;
    });

  // Funções de navegação
  const handleVisualizar = (id) => {
    navigate(`/admin/colaboradores/${id}`);
  };

  const handleCadastrar = (e) => {
    e.stopPropagation();
    // 🔔 MELHORIA: Rota mais RESTful, mas mantendo a original
    // navigate("/admin/colaboradores/novo"); 
    navigate("/colaborator-signin");
  };

  // Componente de Badge para o Cargo (Melhoria de UI)
  const CargoBadge = ({ cargo }) => {
    const styleMap = {
      "Admin": "bg-blue-100 text-blue-800",
      "Recepcionista": "bg-green-100 text-green-800",
      "default": "bg-gray-100 text-gray-800"
    };
    const style = styleMap[cargo] || styleMap["default"];
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${style}`}>
        {cargo}
      </span>
    );
  };


  return (
    <div className="flex min-h-screen bg-[#f8fbff]">
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
        <main className="p-4 sm:p-8 flex flex-col items-center">
          <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm p-6">
            
            {/* Cabeçalho */}
            {/* 📱 MELHORIA: Responsivo com 'flex-col sm:flex-row' */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
              <h1 className="text-2xl font-semibold text-gray-800">
                Colaboradores
              </h1>

              <button
                onClick={handleCadastrar}
                className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition w-full sm:w-auto"
              >
                <UserPlus size={18} />
                Cadastrar Colaborador
              </button>
            </div>

            {/* Mensagem de carregamento */}
            {isLoading && (
              <p className="text-gray-500 text-center mb-4">Carregando...</p>
            )}

            {/* Mensagem de erro */}
            {error && (
              <p className="text-red-500 text-center mb-4 text-sm font-medium">{error}</p>
            )}

            {/* Barra de filtros */}
            {/* 📱 MELHORIA: 'flex-wrap' para melhor ajuste */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 items-center justify-between flex-wrap">
              {/* Busca */}
              <div className="relative w-full sm:flex-1 sm:min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Pesquisar por nome..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-teal-400 outline-none"
                />
              </div>

              {/* 🔔 CORREÇÃO: Filtro de Cargo */}
              <div className="relative w-full sm:flex-1 sm:min-w-[180px]">
                <select
                  value={cargoFiltro}
                  onChange={(e) => setCargoFiltro(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 appearance-none focus:ring-2 focus:ring-teal-400 outline-none"
                >
                  <option value="">Todos os cargos</option>
                  <option value="Admin">Admin</option>
                  <option value="Recepcionista">Recepcionista</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>

              {/* Ordenação */}
              <div className="relative w-full sm:flex-1 sm:min-w-[180px]">
                <select
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 appearance-none focus:ring-2 focus:ring-teal-400 outline-none"
                >
                  <option value="">Ordenar por...</option>
                  <option value="nomeAZ">Nome (A–Z)</option>
                  <option value="nomeZA">Nome (Z–A)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            {/* Tabela */}
            {/* 📱 MELHORIA: 'overflow-x-auto' para rolar em telas pequenas */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3 text-sm text-gray-600 font-medium">
                      Nome
                    </th>
                    <th className="px-4 py-3 text-sm text-gray-600 font-medium">
                      Cargo
                    </th>
                    <th className="px-4 py-3 text-sm text-gray-600 font-medium">
                      Email
                    </th>
                    <th className="px-4 py-3 text-sm text-gray-600 font-medium text-center">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {colaboradoresFiltrados.length > 0 ? (
                    colaboradoresFiltrados.map((colab) => (
                      <tr
                        key={colab.id}
                        className="border-t hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3 text-gray-900 font-medium">{colab.nome}</td>
                        <td className="px-4 py-3">
                          <CargoBadge cargo={colab.cargo} />
                        </td>
                        <td className="px-4 py-3 text-gray-600">{colab.email}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleVisualizar(colab.id)}
                            className="px-3 py-1.5 bg-teal-500 text-white text-sm rounded-md hover:bg-teal-600 transition"
                          >
                            Visualizar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center text-gray-500 py-4 italic">
                        {isLoading ? "Carregando..." : "Nenhum colaborador encontrado."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rodapé */}
          <footer className="text-gray-600 text-sm mt-10 text-center space-y-1">
            <p>📞 Telefone/WhatsApp: (11) 94142-4166</p>
            <p>📧 Unidade 1: José Aldo Piassi, 165, São Miguel Paulista</p>
          </footer>
        </main>
      </div>
    </div>
  );
}