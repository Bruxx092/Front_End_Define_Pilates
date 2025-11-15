// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit, Save, X, Plus, Trash2, AlertCircle } from "lucide-react";
// --- API FUTURA: Descomente para usar ---
// import axios from "axios";

// Alterne para 'false' para usar a API real
const USE_MOCKS = true;

const API_BASE_URL = import.meta.env.VITE_API_BASE || "";
const ENDPOINTS = {
  COLABORADOR_POR_ID: (id) => `/api/colaboradores/${id}`,
};

// --- MOCK: "Banco de dados" de Colaboradores ---
const MOCK_COLABORADORES_DB = {
  "1": {
    id: 1,
    nome: "Ana Souza",
    cargo: "Admin", // 'Admin' ou 'Recepcionista'
    email: "ana.souza@admin.com",
    telefone: "(11) 91234-5678",
    estudio: "Itaquera",
    dataAdmissao: "2023-03-15", // Formato ISO para <input type="date">
    status: "Ativo", // 'Ativo' ou 'Inativo'
    permissoes: [
      "Gerenciamento de Agendas",
      "Controle Financeiro",
      "Cadastro de Alunos e Colaboradores",
    ],
    foto: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
  },
  "2": {
    id: 2,
    nome: "Carlos Souza",
    cargo: "Recepcionista",
    email: "carlos@recepcao.com",
    telefone: "(11) 98765-4321",
    estudio: "São Miguel",
    dataAdmissao: "2024-01-10",
    status: "Ativo",
    permissoes: [
      "Gerenciamento de Agendas",
      "Cadastro de Alunos",
    ],
    foto: "https://cdn-icons-png.flaticon.com/512/847/847969.png", // Usando foto genérica
  },
  // Adicione outros mocks conforme o ID
};
/**
 * --- API FUTURA: Obtém o token de autenticação ---
 */
const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Busca os dados de UM colaborador pelo ID.
 */
const apiFetchColaborador = async (id) => {
  if (USE_MOCKS) {
    await new Promise(res => setTimeout(res, 500));
    const data = MOCK_COLABORADORES_DB[id];
    if (data) return data;
    throw new Error("Colaborador não encontrado (mock).");
  }
  
  // --- API REAL ---
  // const token = getToken();
  // const { data } = await axios.get(
  //   `${API_BASE_URL}${ENDPOINTS.COLABORADOR_POR_ID(id)}`,
  //   { headers: { Authorization: `Bearer ${token}` } }
  // );
  // return data;
  
  throw new Error("API real não implementada.");
};

/**
 * Salva (PUT) os dados de um colaborador.
 */
const apiSaveColaborador = async (id, payload) => {
  if (USE_MOCKS) {
    await new Promise(res => setTimeout(res, 1000));
    console.log("MOCK SAVE [Payload]:", payload);
    // Atualiza o mock em memória
    MOCK_COLABORADORES_DB[id] = { ...MOCK_COLABORADORES_DB[id], ...payload };
    return { success: true, data: payload };
  }

  // --- API REAL ---
  // const token = getToken();
  // const { data } = await axios.put(
  //   `${API_BASE_URL}${ENDPOINTS.COLABORADOR_POR_ID(id)}`,
  //   payload,
  //   { headers: { Authorization: `Bearer ${token}` } }
  // );
  // return data;
  
  throw new Error("API real não implementada.");
};

const EditableField = ({ label, value, name, onChange, isEditing, type = "text", options = null }) => {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      {isEditing ? (
        type === "select" ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
          >
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
          />
        )
      ) : (
        <p className="font-medium text-gray-800 break-words">
          {type === 'date' ? (value ? new Date(value + 'T00:00:00').toLocaleDateString('pt-BR') : '—') : value || '—'}
        </p>
      )}
    </div>
  );
};

const EditableList = ({ label, items, name, onUpdate, onAdd, onRemove, isEditing }) => {
  return (
    <div>
      <h3 className="font-semibold text-gray-800 mb-2">{label}</h3>
      {isEditing ? (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={item}
                onChange={(e) => onUpdate(name, index, e.target.value)}
                className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm"
                placeholder="Descreva a permissão..."
              />
              <button
                onClick={() => onRemove(name, index)}
                className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                aria-label="Remover item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            onClick={() => onAdd(name)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            <Plus size={16} /> Adicionar Permissão
          </button>
        </div>
      ) : (
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          {items.length > 0 ? (
            items.map((item, index) => <li key={index}>{item}</li>)
          ) : (
            <li className="italic text-gray-500">Nenhuma permissão definida.</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default function FichaColaborador() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [colaborador, setColaborador] = useState(null); // Dados originais
  const [formState, setFormState] = useState(null); // Dados em edição
  const [editMode, setEditMode] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Busca os dados do colaborador ao carregar
  useEffect(() => {
    const fetchDados = async (colaboradorId) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiFetchColaborador(colaboradorId);
        setColaborador(data);
        setFormState(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchDados(id);
    }
  }, [id]);

  // Handlers do Formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  // Handlers da Lista (Permissões)
  const handleArrayChange = (field, index, value) => {
    const newArray = [...formState[field]];
    newArray[index] = value;
    setFormState({ ...formState, [field]: newArray });
  };

  const handleArrayAddItem = (field) => {
    const newArray = [...formState[field], ""]; // Adiciona item vazio
    setFormState({ ...formState, [field]: newArray });
  };
  
  const handleArrayRemoveItem = (field, index) => {
    const newArray = formState[field].filter((_, i) => i !== index);
    setFormState({ ...formState, [field]: newArray });
  };

  // Handlers dos Botões Principais
  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await apiSaveColaborador(id, formState);
      setColaborador(formState); // Atualiza os dados originais
      setEditMode(false);
      // alert("Salvo com sucesso!"); // Use 'toasts' (sonner) aqui no futuro
    } catch (err) {
      setError("Falha ao salvar: " + err.message);
      // alert("Falha ao salvar!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormState(colaborador); // Restaura para os dados originais
    setEditMode(false);
  };

  // Renderização condicional
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Carregando ficha do colaborador...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-600">
        <AlertCircle size={40} className="mb-2" />
        <p className="font-medium">Erro ao carregar dados!</p>
        <p className="text-sm">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
        >
          ← Voltar
        </button>
      </div>
    );
  }

  if (!formState) return null; // Se 'formState' ainda não carregou

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-10">

      {/* Cabeçalho de Ações */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 max-w-4xl mx-auto gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 w-full sm:w-auto"
        >
          ← Voltar
        </button>

        <div className="flex gap-2 w-full sm:w-auto">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center justify-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition w-full"
            >
              <Edit size={18} />
              Editar Colaborador
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex-1 disabled:bg-gray-400"
              >
                <Save size={18} />
                {isSaving ? "Salvando..." : "Salvar"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex-1"
              >
                <X size={18} />
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Título Atualizado */}
      <h1 className="text-xl font-semibold mb-6 text-gray-800 text-center">
        Ficha do Colaborador
      </h1>

      <div className="bg-white rounded-2xl shadow-sm p-4 md:p-8 max-w-4xl mx-auto border border-gray-200">

        {/* Foto + Dados Pessoais (usando EditableField) */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <img
            src={formState.foto}
            alt={formState.nome}
            className="w-28 h-28 rounded-full border border-gray-300 object-cover"
          />
          
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 w-full">
            <EditableField
              label="Nome completo"
              value={formState.nome}
              name="nome"
              onChange={handleChange}
              isEditing={editMode}
            />
            <EditableField
              label="Cargo"
              value={formState.cargo}
              name="cargo"
              onChange={handleChange}
              isEditing={editMode}
              type="select"
              options={["Admin", "Recepcionista"]}
            />
             <EditableField
              label="Email"
              value={formState.email}
              name="email"
              onChange={handleChange}
              isEditing={editMode}
              type="email"
            />
             <EditableField
              label="Telefone"
              value={formState.telefone}
              name="telefone"
              onChange={handleChange}
              isEditing={editMode}
              type="tel"
            />
            <EditableField
              label="Estúdio"
              value={formState.estudio}
              name="estudio"
              onChange={handleChange}
              isEditing={editMode}
              type="select"
              options={["Itaquera", "São Miguel", "Geral"]} 
            />
             <EditableField
              label="Data de Admissão"
              value={formState.dataAdmissao}
              name="dataAdmissao"
              onChange={handleChange}
              isEditing={editMode}
              type="date"
            />
            <EditableField
              label="Status"
              value={formState.status}
              name="status"
              onChange={handleChange}
              isEditing={editMode}
              type="select"
              options={["Ativo", "Inativo"]}
            />
          </div>
        </div>

        <div className="border-t border-gray-200 my-6"></div>
        <EditableList
          label="Permissões no Sistema"
          items={formState.permissoes}
          name="permissoes"
          onUpdate={handleArrayChange}
          onAdd={handleArrayAddItem}
          onRemove={handleArrayRemoveItem}
          isEditing={editMode}
        />

      </div>
    </div>
  );
}