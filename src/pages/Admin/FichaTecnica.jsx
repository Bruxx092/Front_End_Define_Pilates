// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit, Save, X, Plus, Trash2, AlertCircle, MapPin, Phone, User, Calendar } from "lucide-react";
import axios from "axios"; 

// =======================================================================
// CONFIGURAÇÃO
// =======================================================================

const API_BASE_URL = "";

const ENDPOINTS = {
  COLABORADOR_GET: (id) => `/colaboradore/${id}`,
  COLABORADOR_UPDATE: (id) => `/colaboradore/colaboradores/${id}`,
};

const getToken = () => localStorage.getItem("accessToken");

const formatarDataParaInput = (dataISO) => {
  if (!dataISO) return "";
  return dataISO.split('T')[0]; 
};

// =======================================================================
// INTEGRAÇÃO (BACK-END)
// =======================================================================

const apiFetchColaborador = async (id) => {
  try {
    const token = getToken();
    if (!token) throw new Error("LOGIN_REQUIRED");

    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${API_BASE_URL}${ENDPOINTS.COLABORADOR_GET(id)}`, config);
    
    return response.data;

  } catch (err) {
    if (err.message === "LOGIN_REQUIRED") throw new Error("Usuário não autenticado.");
    if (err.response && err.response.status === 401) throw new Error("Sessão expirada.");
    throw new Error("Erro ao carregar dados.");
  }
};

const apiSaveColaborador = async (id, formState, dadosOriginais) => {
  try {
    const token = getToken();
    if (!token) throw new Error("LOGIN_REQUIRED");

    const config = { headers: { Authorization: `Bearer ${token}` } };

    // 1. LOGICA DE CARGO
    const isRecepcionista = formState.cargo === "Recepcionista";

    // 2. LOGICA DE CONTATOS
    let listaContatos = [];
    if (formState.telefone) {
        const idContatoOriginal = dadosOriginais?.contatos?.[0]?.id_contato;
        listaContatos.push({
            id_contato: idContatoOriginal, 
            tipo_contato: formState.tipoTelefone || "residencial", 
            numero_contato: formState.telefone
        });
    }

    // 3. LOGICA DE ENDEREÇO
    let listaEnderecos = [];
    if (formState.endereco) {
        const idEnderecoOriginal = dadosOriginais?.endereco?.[0]?.id_endereco;
        listaEnderecos.push({
            id_endereco: idEnderecoOriginal,
            tipo_endereco: formState.tipoEndereco || "residencial",
            endereco: formState.endereco,
            cep: formState.cep
        });
    }

    // 4. PACOTE FINAL
    const payload = {
        name_user: formState.nome,
        email_user: formState.email,
        is_recepcionista: isRecepcionista,
        contatos: listaContatos.length > 0 ? listaContatos : undefined,
        endereco: listaEnderecos.length > 0 ? listaEnderecos : undefined,
        senha_user: formState.novaSenha ? formState.novaSenha : undefined
    };

    const response = await axios.patch(
      `${API_BASE_URL}${ENDPOINTS.COLABORADOR_UPDATE(id)}`,
      payload,
      config
    );
    return response.data;

  } catch (err) {
    if (err.response && err.response.status === 422) {
        console.log("Erro 422:", err.response.data);
        throw new Error("Dados inválidos.");
    }
    throw new Error("Não foi possível salvar as alterações.");
  }
};

// =======================================================================
// COMPONENTES VISUAIS
// =======================================================================

const EditableField = ({ label, value, name, onChange, isEditing, type = "text", options = null, placeholder="", icon: Icon }) => {
  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1 flex items-center gap-1">
        {Icon && <Icon size={12} />} {label}
      </label>
      
      {isEditing ? (
        type === "select" ? (
          <div className="relative">
            <select name={name} value={value || ""} onChange={onChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-teal-500 outline-none bg-white appearance-none">
              {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        ) : (
          <input type={type} name={name} value={value || ""} onChange={onChange} placeholder={placeholder} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all" />
        )
      ) : (
        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 text-gray-800 min-h-[42px] flex items-center">
           {type === 'date' && value ? new Date(value).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : (type === 'password' ? '••••••••' : value || <span className="text-gray-400 italic">Não informado</span>)}
        </div>
      )}
    </div>
  );
};

// =======================================================================
// TELA PRINCIPAL
// =======================================================================
export default function FichaColaborador() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [colaboradorDadosOriginais, setColaboradorDadosOriginais] = useState(null); 
  const [formState, setFormState] = useState(null); 
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDados = async () => {
      setIsLoading(true);
      try {
        const data = await apiFetchColaborador(id);
        setColaboradorDadosOriginais(data);

        // Mapeamento
        let tel = "", tipoTel = "residencial";
        if (data.contatos?.[0]) {
            tel = data.contatos[0].numero_contato;
            tipoTel = data.contatos[0].tipo_contato;
        }

        let end = "", cep = "", tipoEnd = "residencial";
        if (data.endereco?.[0]) {
            end = data.endereco[0].endereco;
            cep = data.endereco[0].cep;
            tipoEnd = data.endereco[0].tipo_endereco;
        }

        let cargo = "Colaborador";
        if (data.recepcionista) cargo = "Recepcionista";
        if (data.lv_acesso === "supremo") cargo = "Supremo";

        setFormState({
            nome: data.name_user,
            nascimento: formatarDataParaInput(data.nasc_user),
            cpf: data.num_doc_user,
            email: data.email_user,
            cargo: cargo,
            telefone: tel,
            tipoTelefone: tipoTel,
            estudio: "Estúdio Itaquera", 
            endereco: end,
            cep: cep,
            tipoEndereco: tipoEnd,
            novaSenha: "",
            foto: data.foto_user || "https://cdn-icons-png.flaticon.com/512/847/847969.png"
        });

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) fetchDados();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiSaveColaborador(id, formState, colaboradorDadosOriginais);
      alert("Dados salvos com sucesso!");
      window.location.reload();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center h-screen items-center">Carregando...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error} <br/><button onClick={() => navigate(-1)}>Voltar</button></div>;
  if (!formState) return null;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-600 hover:bg-gray-200 px-4 py-2 rounded-lg">← Voltar</button>
        <div className="flex gap-2">
            {!editMode ? (
                <button onClick={() => setEditMode(true)} className="bg-teal-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition"><Edit size={18}/> Editar</button>
            ) : (
                <>
                    <button onClick={handleSave} disabled={isSaving} className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition disabled:opacity-50"><Save size={18}/> {isSaving ? 'Salvando...' : 'Salvar'}</button>
                    <button onClick={() => window.location.reload()} className="bg-red-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition"><X size={18}/> Cancelar</button>
                </>
            )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-teal-600 h-24 w-full relative">
            <div className="absolute -bottom-12 left-8">
                <img src={formState.foto} className="w-24 h-24 rounded-full border-4 border-white bg-white object-cover shadow-md" alt="Avatar" />
            </div>
        </div>
        
        <div className="pt-16 px-8 pb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">CADASTRO DE COLABORADOR</h1>
            <p className="text-gray-500 mb-8 text-sm">Visualize e edite todas as informações cadastrais.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <EditableField icon={User} label="Nome Completo" name="nome" value={formState.nome} onChange={handleChange} isEditing={editMode} />
                    <EditableField icon={Calendar} label="Data de Nascimento" name="nascimento" value={formState.nascimento} onChange={handleChange} isEditing={editMode} type="date" />
                    
                    <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-1">
                             <EditableField label="Tipo Doc" name="tipoDoc" value="CPF" isEditing={false} />
                        </div>
                        <div className="col-span-2">
                             <EditableField label="Número do CPF" name="cpf" value={formState.cpf} onChange={handleChange} isEditing={false} /> 
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                            <EditableField icon={Phone} label="Número de Contato" name="telefone" value={formState.telefone} onChange={handleChange} isEditing={editMode} type="tel" />
                        </div>
                        <div className="col-span-1">
                            <EditableField label="Tipo" name="tipoTelefone" value={formState.tipoTelefone} onChange={handleChange} isEditing={editMode} type="select" options={["residencial", "comercial", "familiar"]} />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <EditableField label="Email Comercial" name="email" value={formState.email} onChange={handleChange} isEditing={editMode} type="email" />
                    
                    {editMode && (
                        <EditableField label="Nova Senha (Opcional)" name="novaSenha" value={formState.novaSenha} onChange={handleChange} isEditing={true} type="password" placeholder="Deixe em branco para não mudar" />
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <EditableField label="Cargo / Função" name="cargo" value={formState.cargo} onChange={handleChange} isEditing={editMode} type="select" options={["Colaborador", "Recepcionista"]} />
                        <EditableField label="Estúdio Alocado" name="estudio" value={formState.estudio} onChange={handleChange} isEditing={editMode} type="select" options={["Estúdio Itaquera", "Estúdio São Miguel"]} />
                    </div>

                    <EditableField icon={MapPin} label="Endereço (Rua, Nº, Bairro)" name="endereco" value={formState.endereco} onChange={handleChange} isEditing={editMode} />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <EditableField label="CEP (Só números)" name="cep" value={formState.cep} onChange={handleChange} isEditing={editMode} />
                        <EditableField label="Tipo Endereço" name="tipoEndereco" value={formState.tipoEndereco} onChange={handleChange} isEditing={editMode} type="select" options={["residencial", "comercial"]} />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}