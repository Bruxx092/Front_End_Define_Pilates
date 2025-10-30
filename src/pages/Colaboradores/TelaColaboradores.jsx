// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import { useSidebar } from "@/context/SidebarContext";

export default function ColaboradoresPage() {
  const navigate = useNavigate();
  const { isMobile, sidebarWidth } = useSidebar();
  const [menuOpen, setMenuOpen] = useState(false);

  const [colaboradores, setColaboradores] = useState([]);
  const [busca, setBusca] = useState("");
  const [modalidadeFiltro, setModalidadeFiltro] = useState("");
  const [ordenacao, setOrdenacao] = useState("");

  // 🔹 MOCK temporário
  const mockColaboradores = [
    { id: 1, nome: "Ana Souza", modalidade: "Yoga" },
    { id: 2, nome: "Carlos Souza", modalidade: "Pilates" },
    { id: 3, nome: "Samara da Silva", modalidade: "Curso" },
    { id: 4, nome: "Zaymoul el Sayeg", modalidade: "Yoga" },
    { id: 5, nome: "Wandinha Gomes", modalidade: "Pilates" },
  ];

  useEffect(() => {
    setColaboradores(mockColaboradores);
  }, []);

  // 🔹 Filtragem e ordenação
  const colaboradoresFiltrados = colaboradores
    .filter(
      (c) =>
        c.nome.toLowerCase().includes(busca.toLowerCase()) &&
        (modalidadeFiltro ? c.modalidade === modalidadeFiltro : true)
    )
    .sort((a, b) => {
      if (ordenacao === "nomeAZ") return a.nome.localeCompare(b.nome);
      if (ordenacao === "nomeZA") return b.nome.localeCompare(a.nome);
      return 0;
    });

  // 🔹 Ir para ficha técnica
  const handleVisualizar = (id) => {
    navigate(`/colaboradores/${id}`);
  };

  // 🔹 Ir para cadastro de colaborador
  const handleCadastrar = (e) => {
    e.stopPropagation();
    navigate("/colaborator-signin");
  };

  return (
    <div className="flex min-h-screen bg-[#f8fbff]">
      {/* ✅ Sidebar do administrador */}
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
            {/* 🔹 Cabeçalho */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-800">
                Colaboradores
              </h1>
              <button
                onClick={handleCadastrar}
                className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition"
              >
                <UserPlus size={18} />
                Cadastrar Colaborador
              </button>
            </div>

            {/* 🔹 Barra de filtros */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 items-center justify-between">
              {/* Busca */}
              <div className="relative w-full sm:w-1/3">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Pesquisar por nome..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-teal-400 outline-none"
                />
              </div>

              {/* Filtro */}
              <div className="relative w-full sm:w-1/3">
                <select
                  value={modalidadeFiltro}
                  onChange={(e) => setModalidadeFiltro(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 appearance-none focus:ring-2 focus:ring-teal-400 outline-none"
                >
                  <option value="">Filtrar por modalidade</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Pilates">Pilates</option>
                  <option value="Curso">Curso</option>
                </select>
                <Filter className="absolute right-3 top-2.5 text-gray-400" size={18} />
              </div>

              {/* Ordenação */}
              <div className="relative w-full sm:w-1/3">
                <select
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 appearance-none focus:ring-2 focus:ring-teal-400 outline-none"
                >
                  <option value="">Ordenar por...</option>
                  <option value="nomeAZ">Nome (A-Z)</option>
                  <option value="nomeZA">Nome (Z-A)</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>

            {/* 🔹 Tabela */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-2 text-sm text-gray-600 font-medium">Nome</th>
                    <th className="px-4 py-2 text-sm text-gray-600 font-medium">Modalidade</th>
                    <th className="px-4 py-2 text-sm text-gray-600 font-medium text-center">
                      Ficha Técnica
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {colaboradoresFiltrados.length > 0 ? (
                    colaboradoresFiltrados.map((colab) => (
                      <tr
                        key={colab.id}
                        className="border-t hover:bg-gray-50 transition duration-100"
                      >
                        <td className="px-4 py-2 text-gray-800">{colab.nome}</td>
                        <td className="px-4 py-2 text-gray-600">{colab.modalidade}</td>
                        <td className="px-4 py-2 text-center">
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
                      <td colSpan={3} className="text-center text-gray-500 py-4 italic">
                        Nenhum colaborador encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 🔹 Rodapé */}
          <footer className="text-gray-600 text-sm mt-10 text-center space-y-1">
            <p>📞 Telefone/WhatsApp: (11) 94142-4166</p>
            <p>📧 Unidade 1: José Aldo Piassi, 165, São Miguel Paulista</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
 