import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  FileText,
  ArrowLeft,
  Pencil,
} from "lucide-react";
// import axios from "axios"; // Descomente quando a API estiver pronta

// Componente Checkbox (sem alterações)
const Checkbox = ({ checked, onChange }) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={onChange}
    className="form-checkbox h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
  />
);

// --- DADOS MOCK (Sem a coluna 'profissional') ---
const MOCK_AULAS = [
  {
    id: 1,
    aula: "Pilates Clássico",
    data: "2025-11-01",
    observacoes: "Aluno focou na respiração e controle do core. Boa evolução.",
    status: "Presente",
  },
  {
    id: 2,
    aula: "Pilates Clássico",
    data: "2025-11-03",
    observacoes: "Sentiu um leve desconforto no ombro esquerdo.",
    status: "Presente",
  },
  {
    id: 3,
    aula: "Pilates Aparelhos",
    data: "2025-11-05",
    observacoes: "Não compareceu.",
    status: "Falta",
  },
  {
    id: 4,
    aula: "Pilates Clássico",
    data: "2025-11-08",
    observacoes: "Apresentou atestado médico.",
    status: "Atestado",
  },
];
// --- FIM DOS DADOS MOCK ---

/**
 * Componente que exibe o histórico de aulas de um aluno específico
 * para o instrutor logado.
 *
 * @param {object} props
 * @param {string|number} props.alunoId - O ID do aluno selecionado.
 * @param {string} props.alunoNome - O Nome do aluno selecionado.
 */
export default function HistoricoAulasInstrutorPage({
  alunoId,
  alunoNome = "Aluno Exemplo", // Valor padrão para fins de mock
}) {
  const [aulas, setAulas] = useState([]);
  const [selectedAulas, setSelectedAulas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAula, setEditingAula] = useState(null);
  const [editedObservation, setEditedObservation] = useState("");

  const colorMap = {
    Presente: "bg-green-500 hover:bg-green-600",
    Falta: "bg-red-500 hover:bg-red-600",
    Atestado: "bg-cyan-500 hover:bg-cyan-600",
  };

  // Busca aulas (MOCK)
  const fetchAulas = async (idDoAluno) => {
    setLoading(true);
    // Simula uma chamada de API
    setTimeout(() => {
      const aulasData = MOCK_AULAS.map((aula) => ({
        ...aula,
        statusColor: colorMap[aula.status] || "bg-gray-500",
      }));
      setAulas(aulasData);
      setLoading(false);
    }, 500);

    /*
    // --- CONEXÃO API FUTURA ---
    if (!idDoAluno) {
      console.error("ID do aluno não fornecido!");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      // O endpoint agora busca as aulas do aluno (provavelmente já filtradas para este instrutor no backend)
      const response = await axios.get(`/api/alunos/${idDoAluno}/aulas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const aulasData = response.data.map((aula) => ({
        ...aula,
        statusColor: colorMap[aula.status] || "bg-gray-500",
      }));
      setAulas(aulasData);
    } catch (error) {
      console.error("Erro ao buscar aulas:", error);
    } finally {
      setLoading(false);
    }
    */
  };

  // Atualiza status das aulas selecionadas
  const handleBulkUpdateStatus = async (status) => {
    setAulas((prev) =>
      prev.map((aula) =>
        selectedAulas.includes(aula.id)
          ? { ...aula, status, statusColor: colorMap[status] }
          : aula
      )
    );
    setSelectedAulas([]);

    /*
    // --- CONEXÃO API FUTURA ---
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "/api/aulas/status", 
        { ids: selectedAulas, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
    */
  };

  // --- Funções do Modal ---
  const handleOpenEditModal = (aula) => {
    setEditingAula(aula);
    setEditedObservation(aula.observacoes);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAula(null);
    setEditedObservation("");
  };

  const handleSaveObservation = async () => {
    if (!editingAula) return;

    // Atualização local (Mock)
    setAulas((prev) =>
      prev.map((a) =>
        a.id === editingAula.id
          ? { ...a, observacoes: editedObservation }
          : a
      )
    );
    handleCloseModal();

    /*
    // --- CONEXÃO API FUTURA ---
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/aulas/${editingAula.id}/observacao`,
        { observacoes: editedObservation },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao salvar observação:", error);
    }
    */
  };

  // Funções de seleção
  const handleSelectAll = (e) =>
    setSelectedAulas(e.target.checked ? aulas.map((a) => a.id) : []);

  const handleSelectAula = (id) =>
    setSelectedAulas((prev) =>
      prev.includes(id) ? prev.filter((aulaId) => aulaId !== id) : [...prev, id]
    );

  // Inicialização
  useEffect(() => {
    fetchAulas(alunoId);
  }, [alunoId]);

  const totalPresencas = aulas.filter((a) => a.status === "Presente").length;
  const totalFaltas = aulas.filter((a) => a.status === "Falta").length;

  if (loading) return <p className="p-4">Carregando histórico do aluno...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 mb-4 text-teal-500 hover:text-teal-700"
      >
        <ArrowLeft size={18} /> Voltar para Evolução do Aluno
      </button>

      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Histórico de Aulas - {alunoNome}
      </h1>

      {/* Cards de Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col justify-center items-center p-4 rounded-lg bg-green-100 text-green-800">
          <h2 className="text-xl font-medium mb-1">Total de Presenças</h2>
          <p className="text-4xl sm:text-5xl font-bold">{totalPresencas}</p>
        </div>
        <div className="flex flex-col justify-center items-center p-4 rounded-lg bg-red-100 text-red-800">
          <h2 className="text-xl font-medium mb-1">Total de Faltas</h2>
          <p className="text-4xl sm:text-5xl font-bold">
            {totalFaltas < 10 ? `0${totalFaltas}` : totalFaltas}
          </p>
        </div>
      </div>

      {/* Barra de Ações em Massa */}
      {selectedAulas.length > 0 && (
        <div className="mb-4 p-4 bg-gray-100 rounded-lg flex flex-wrap items-center gap-4">
          <span className="font-medium text-gray-700">
            {selectedAulas.length} {selectedAulas.length > 1 ? "aulas" : "aula"}{" "}
            selecionadas:
          </span>
          <button
            onClick={() => handleBulkUpdateStatus("Presente")}
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md text-white bg-green-500 hover:bg-green-600 shadow-sm"
          >
            <CheckCircle size={16} /> Marcar Presença
          </button>
          <button
            onClick={() => handleBulkUpdateStatus("Falta")}
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md text-white bg-red-500 hover:bg-red-600 shadow-sm"
          >
            <XCircle size={16} /> Marcar Falta
          </button>
          <button
            onClick={() => handleBulkUpdateStatus("Atestado")}
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md text-white bg-cyan-500 hover:bg-cyan-600 shadow-sm"
          >
            <FileText size={16} /> Marcar Atestado
          </button>
        </div>
      )}

      {/* Tabela de Aulas (Sem coluna "Profissional") */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Checkbox
                  checked={
                    aulas.length > 0 && selectedAulas.length === aulas.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aula
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Observações
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {aulas.map((aula) => (
              <tr
                key={aula.id}
                className="hover:bg-gray-50 transition duration-150"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <Checkbox
                    checked={selectedAulas.includes(aula.id)}
                    onChange={() => handleSelectAula(aula.id)}
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                  {aula.aula}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {aula.data}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                  {aula.observacoes || "N/A"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-white ${aula.statusColor}`}
                  >
                    {aula.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <button
                    onClick={() => handleOpenEditModal(aula)}
                    className="text-teal-600 hover:text-teal-800 p-1"
                    title="Editar Observação"
                  >
                    <Pencil size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Editar Observação
            </h3>
            {editingAula && (
              <>
                <p className="mb-1 text-sm">
                  <strong>Aluno:</strong> {alunoNome}
                </p>
                <p className="mb-1 text-sm">
                  <strong>Aula:</strong> {editingAula.aula}
                </p>
                <p className="mb-4 text-sm">
                  <strong>Data:</strong> {editingAula.data}
                </p>
              </>
            )}
            <textarea
              value={editedObservation}
              onChange={(e) => setEditedObservation(e.target.value)}
              className="w-full h-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Digite as observações do instrutor sobre esta aula..."
            />
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveObservation}
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}