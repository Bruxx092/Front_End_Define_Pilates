import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit, Save, X } from "lucide-react";

export default function FichaTecnica() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [colaborador, setColaborador] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formState, setFormState] = useState({});

  useEffect(() => {
    const mockData = {
      id: 1,
      nome: "Ana Souza",
      cref: "012345-G/SP",
      modalidade: "Pilates e Fisioterapeuta",
      email: "AnaSouzaPilates@academia.pilates.com",
      telefone: "(11) 91234-5678",
      horariosFixos: [
        "Segunda a Sexta – 07h às 12h",
        "Terça e Quinta – 18h às 20h",
      ],
      formacao: [
        "Graduação em Educação Física – USP",
        "Pós-graduação em Fisioterapia e Reabilitação Esportiva",
        "Certificação Internacional em Pilates (Pilates Method Alliance)",
      ],
      experiencia: [
        "8 anos de experiência em Pilates (Solo e Aparelhos)",
        "Especialista em reabilitação de lesões e melhora da postura",
        "Atende alunos de níveis iniciante ao avançado",
      ],
      foto: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
    };

    setColaborador(mockData);
    setFormState(mockData);
  }, [id]);

  if (!colaborador) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Carregando ficha técnica...
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formState[field]];
    newArray[index] = value;
    setFormState({ ...formState, [field]: newArray });
  };

  const handleSave = () => {
    setColaborador(formState);
    setEditMode(false);
    // Aqui você pode enviar para API via axios
    // axios.put(`/api/colaboradores/${id}`, formState)
  };

  const handleCancel = () => {
    setFormState(colaborador);
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      {/* Botões de ação */}
      <div className="flex justify-between items-center mb-6 max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
        >
          ← Voltar
        </button>

        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition"
          >
            <Edit size={18} />
            Editar Colaborador
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              <Save size={18} />
              Salvar
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              <X size={18} />
              Cancelar
            </button>
          </div>
        )}
      </div>

      <h1 className="text-xl font-semibold mb-6 text-gray-800 text-center">
        Ficha Técnica
      </h1>

      <div className="bg-white rounded-2xl shadow-sm p-6 max-w-4xl mx-auto border border-gray-200">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <img
            src={formState.foto}
            alt={formState.nome}
            className="w-28 h-28 rounded-full border border-gray-300 object-cover"
          />

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-2 text-gray-700">
            <div>
              <p className="text-sm text-gray-500">Nome completo</p>
              {editMode ? (
                <input
                  name="nome"
                  value={formState.nome}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                />
              ) : (
                <p className="font-medium">{formState.nome}</p>
              )}

              <p className="text-sm text-gray-500 mt-2">CREF</p>
              {editMode ? (
                <input
                  name="cref"
                  value={formState.cref}
                  onChange={handleChange}
                  className="w1-full border border-gray-300 rounded px-2 py-1"
                />
              ) : (
                <p className="font-medium">{formState.cref}</p>
              )}

              <p className="text-sm text-gray-500 mt-2">Modalidade</p>
              {editMode ? (
                <input
                  name="modalidade"
                  value={formState.modalidade}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                />
              ) : (
                <p className="font-medium">{formState.modalidade}</p>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500">Horários Fixos</p>
              {formState.horariosFixos.map((h, i) =>
                editMode ? (
                  <input
                    key={i}
                    value={h}
                    onChange={(e) =>
                      handleArrayChange("horariosFixos", i, e.target.value)
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1 mb-1"
                  />
                ) : (
                  <p key={i} className="font-medium">
                    {h}
                  </p>
                )
              )}

              <p className="text-sm text-gray-500 mt-2">Telefone Comercial</p>
              {editMode ? (
                <input
                  name="telefone"
                  value={formState.telefone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                />
              ) : (
                <p className="font-medium">{formState.telefone}</p>
              )}

              <p className="text-sm text-gray-500 mt-2">Email</p>
              {editMode ? (
                <input
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-2 py-1 break-all"
                />
              ) : (
                <p className="font-medium break-all">{formState.email}</p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 my-4"></div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Formação</h3>
          {editMode ? (
            formState.formacao.map((f, i) => (
              <input
                key={i}
                value={f}
                onChange={(e) => handleArrayChange("formacao", i, e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 mb-1"
              />
            ))
          ) : (
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              {formState.formacao.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-gray-300 my-4"></div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Experiência</h3>
          {editMode ? (
            formState.experiencia.map((e, i) => (
              <input
                key={i}
                value={e}
                onChange={(e) =>
                  handleArrayChange("experiencia", i, e.target.value)
                }
                className="w-full border border-gray-300 rounded px-2 py-1 mb-1"
              />
            ))
          ) : (
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              {formState.experiencia.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
