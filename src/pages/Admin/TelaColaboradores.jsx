// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import { useSidebar } from "@/context/SidebarContext";

// =======================================================================
// CONFIGURAÇÃO DA API
// =======================================================================

// Vazio para usar Proxy do Vite
const API_BASE_URL = ""; 

const ENDPOINTS = {
  COLABORADORES: "/colaboradore/", 
  COLABORADOR_POR_ID: (id) => `/colaboradore/${id}`,
};

// =======================================================================
// FUNÇÕES DE BUSCA
// =======================================================================

const getToken = () => {
  return localStorage.getItem("accessToken");
};

const apiFetchColaboradores = async () => {
  try {
    const token = getToken();
    
    if (!token) throw new Error("LOGIN_REQUIRED");

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const response = await axios.get(`${API_BASE_URL}${ENDPOINTS.COLABORADORES}`, config);
    
    // Detetive (pode remover depois se quiser)
    console.log("DADOS REAIS DO PYTHON (Lista):", response.data);

    return response.data;

  } catch (err) {
    if (err.message === "LOGIN_REQUIRED") throw new Error("Usuário não autenticado.");
    if (err.response && err.response.status === 401) throw new Error("Sessão expirada. Faça login novamente.");
    
    console.error("Erro API:", err);
    throw new Error("Falha na conexão.");
  }
};

// =======================================================================
// COMPONENTE PRINCIPAL
// =======================================================================
export default function ColaboradoresPage() {
  const navigate = useNavigate();
  const { isMobile, sidebarWidth } = useSidebar();
  const [menuOpen, setMenuOpen] = useState(false);

  const [colaboradores, setColaboradores] = useState([]);
  const [busca, setBusca] = useState("");
  const [cargoFiltro, setCargoFiltro] = useState("");
  const [ordenacao, setOrdenacao] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDados = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiFetchColaboradores();
        if (Array.isArray(data)) {
            setColaboradores(data);
        } else {
            setColaboradores([]); 
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDados();
  }, []); 

  // Função Juíza de Cargo
  const determinarCargoVisual = (colab) => {
      if (colab.recepcionista && colab.recepcionista !== null) return "Recepcionista";
      if (colab.lv_acesso === "supremo") return "Supremo";
      if (colab.lv_acesso === "colaborador") return "Colaborador";
      return colab.cargo || "Indefinido";
  };

  // Filtros
  const colaboradoresFiltrados = colaboradores
    .filter((c) => {
      const nomeReal = c.name_user || c.nome || ""; 
      const cargoVisual = determinarCargoVisual(c);
      
      const matchNome = nomeReal.toLowerCase().includes(busca.toLowerCase());
      const matchCargo = cargoFiltro 
        ? cargoVisual.toLowerCase() === cargoFiltro.toLowerCase() 
        : true;

      return matchNome && matchCargo;
    })
    .sort((a, b) => {
      const nomeA = a.name_user || a.nome || "";
      const nomeB = b.name_user || b.nome || "";
      if (ordenacao === "nomeAZ") return nomeA.localeCompare(nomeB);
      if (ordenacao === "nomeZA") return nomeB.localeCompare(nomeA);
      return 0;
    });

  const handleVisualizar = (id) => {
    navigate(`/admin/colaboradores/${id}`);
  };

  const handleCadastrar = (e) => {
    e.stopPropagation();
    navigate("/colaborator-signin");
  };

  const CargoBadge = ({ cargo }) => {
    const styleMap = {
      "Supremo": "bg-purple-100 text-purple-800 border border-purple-200", 
      "supremo": "bg-purple-100 text-purple-800 border border-purple-200", 
      "Colaborador": "bg-blue-100 text-blue-800 border border-blue-200",
      "colaborador": "bg-blue-100 text-blue-800 border border-blue-200",
      "Admin": "bg-indigo-100 text-indigo-800 border border-indigo-200",
      "Recepcionista": "bg-green-100 text-green-800 border border-green-200",
      "recepcionista": "bg-green-100 text-green-800 border border-green-200",
      "default": "bg-gray-100 text-gray-800 border border-gray-200"
    };
    
    const valor = cargo || "Indefinido";
    const style = styleMap[valor] || styleMap["default"];
    
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${style}`}>
        {valor.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#f8fbff]">
      <SidebarUnificada menuItems={sidebarConfigs.administrador.menuItems} userInfo={sidebarConfigs.administrador.userInfo} isOpen={menuOpen} onOpenChange={setMenuOpen} />
      
      <div className="flex flex-col flex-1 transition-all duration-300 min-w-0" style={{ marginLeft: !isMobile ? `${sidebarWidth}px` : "0", width: !isMobile ? `calc(100% - ${sidebarWidth}px)` : "100%" }}>
        <main className="p-4 sm:p-8 flex flex-col items-center">
          <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm p-6">
            
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
              <h1 className="text-2xl font-semibold text-gray-800">Colaboradores</h1>
              <button onClick={handleCadastrar} className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition w-full sm:w-auto">
                <UserPlus size={18} /> Cadastrar Colaborador
              </button>
            </div>

            {isLoading && <p className="text-gray-500 text-center mb-4 animate-pulse">Carregando dados...</p>}
            
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-center mb-4 text-sm font-medium border border-red-100">{error}</div>}

            <div className="flex flex-col sm:flex-row gap-3 mb-6 items-center justify-between flex-wrap">
              <div className="relative w-full sm:flex-1 sm:min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder="Pesquisar por nome..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-teal-400 outline-none" />
              </div>

              <div className="relative w-full sm:flex-1 sm:min-w-[180px]">
                <select value={cargoFiltro} onChange={(e) => setCargoFiltro(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 appearance-none focus:ring-2 focus:ring-teal-400 outline-none">
                  <option value="">Todos os cargos</option>
                  <option value="supremo">Supremo</option>
                  <option value="colaborador">Colaborador</option>
                  <option value="recepcionista">Recepcionista</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>

              <div className="relative w-full sm:flex-1 sm:min-w-[180px]">
                <select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 appearance-none focus:ring-2 focus:ring-teal-400 outline-none">
                  <option value="">Ordenar por...</option>
                  <option value="nomeAZ">Nome (A–Z)</option>
                  <option value="nomeZA">Nome (Z–A)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3 text-sm text-gray-600 font-medium">Nome</th>
                    <th className="px-4 py-3 text-sm text-gray-600 font-medium">Cargo</th>
                    <th className="px-4 py-3 text-sm text-gray-600 font-medium">Email</th>
                    <th className="px-4 py-3 text-sm text-gray-600 font-medium text-center">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {!isLoading && colaboradoresFiltrados.length > 0 ? (
                    colaboradoresFiltrados.map((colab) => (
                      <tr key={colab.id || colab.id_user || colab._id} className="border-t hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-gray-900 font-medium">{colab.name_user || colab.nome || "Sem Nome"}</td>
                        <td className="px-4 py-3"><CargoBadge cargo={determinarCargoVisual(colab)} /></td>
                        <td className="px-4 py-3 text-gray-600">{colab.email_user || colab.email || "—"}</td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => handleVisualizar(colab.id || colab.id_user || colab._id)} className="px-3 py-1.5 bg-teal-500 text-white text-sm rounded-md hover:bg-teal-600 transition">Visualizar</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4} className="text-center text-gray-500 py-4 italic">{!isLoading && !error ? "Nenhum colaborador encontrado." : ""}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <footer className="text-gray-600 text-sm mt-10 text-center space-y-1">
            <p>📞 Telefone/WhatsApp: (11) 94142-4166</p>
            <p>📧 Unidade São Miguel Paulista: José Aldo Piassi, 165, São Miguel Paulista</p>
          </footer>
        </main>
      </div>
    </div>
  );
}