import React, { useState, useEffect } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom"; // <-- Import do hook de navegação

export default function ProfessoresPage() {
  const navigate = useNavigate(); // <-- Hook do react-router-dom
  const [professores, setProfessores] = useState([]);
  const [busca, setBusca] = useState("");
  const [modalidadeFiltro, setModalidadeFiltro] = useState("");
  const [ordenacao, setOrdenacao] = useState("");

  // 🔹 MOCK: lista inicial
  const mockProfessores = [
    { id: 1, nome: "Ana Souza", modalidade: "Yoga" },
    { id: 2, nome: "Carlos Souza", modalidade: "Pilates" },
    { id: 3, nome: "Samara da Silva", modalidade: "Curso" },
    { id: 4, nome: "Zaymoul el Sayeg", modalidade: "Yoga" },
    { id: 5, nome: "Wandinha Gomes", modalidade: "Pilates" },
  ];

  useEffect(() => {
    // 🔹 No futuro: buscar da API
    /*
    const token = localStorage.getItem("token");
    axios.get("/api/professores", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setProfessores(res.data))
    .catch(err => console.error("Erro ao buscar professores:", err));
    */
    setProfessores(mockProfessores);
  }, []);

  // 🔹 Filtro e ordenação
  const professoresFiltrados = professores
    .filter(
      (p) =>
        p.nome.toLowerCase().includes(busca.toLowerCase()) &&
        (modalidadeFiltro ? p.modalidade === modalidadeFiltro : true)
    )
    .sort((a, b) => {
      if (ordenacao === "nomeAZ") return a.nome.localeCompare(b.nome);
      if (ordenacao === "nomeZA") return b.nome.localeCompare(a.nome);
      return 0;
    });

  // 🔹 Função de navegação
  const handleVisualizar = (id) => {
    navigate(`/colaboradores/${id}`); // <-- Envia para rota dinâmica
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Colaboradores
        </h1>

        {/* 🔹 Barra de Filtros */}
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

          {/* Filtro por modalidade */}
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

          {/* Ordenar */}
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
              {professoresFiltrados.length > 0 ? (
                professoresFiltrados.map((prof) => (
                  <tr
                    key={prof.id}
                    className="border-t hover:bg-gray-50 transition duration-100"
                  >
                    <td className="px-4 py-2 text-gray-800">{prof.nome}</td>
                    <td className="px-4 py-2 text-gray-600">{prof.modalidade}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleVisualizar(prof.id)} // <-- Aqui faz a navegação
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
                    Nenhum professor encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔹 Rodapé */}
      <footer className="text-gray-600 text-sm mt-10 text-center space-y-1">
        <p>📞 Telefone/WhatsApp: (11) 99999-9999</p>
        <p>📧 Email: academia.definepilates@gmail.com</p>
        <p>🕒 Horário: Seg-Sex 8h às 20h | Sáb 8h às 14h</p>
        <p>📍 Rua da Academia Pilates, 123</p>
      </footer>
    </div>
  );
}
