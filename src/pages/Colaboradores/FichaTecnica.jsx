import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function FichaTecnica() {
  const { id } = useParams();
  const navigate = useNavigate(); // <-- hook para navegar
  const [colaborador, setColaborador] = useState(null);

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
  }, [id]);

  if (!colaborador) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Carregando ficha técnica...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      {/* Botão Voltar */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
      >
        ← Voltar
      </button>

      <h1 className="text-xl font-semibold mb-6 text-gray-800">Ficha Técnica</h1>

      <div className="bg-white rounded-2xl shadow-sm p-6 max-w-4xl mx-auto border border-gray-200">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <img
            src={colaborador.foto}
            alt={colaborador.nome}
            className="w-28 h-28 rounded-full border border-gray-300 object-cover"
          />

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-2 text-gray-700">
            <div>
              <p className="text-sm text-gray-500">Nome completo</p>
              <p className="font-medium">{colaborador.nome}</p>

              <p className="text-sm text-gray-500 mt-2">CREF</p>
              <p className="font-medium">{colaborador.cref}</p>

              <p className="text-sm text-gray-500 mt-2">Modalidade</p>
              <p className="font-medium">{colaborador.modalidade}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Horários Fixos</p>
              <p className="font-medium">{colaborador.horariosFixos[0]}</p>
              <p className="font-medium">{colaborador.horariosFixos[1]}</p>

              <p className="text-sm text-gray-500 mt-2">Telefone Comercial</p>
              <p className="font-medium">{colaborador.telefone}</p>

              <p className="text-sm text-gray-500 mt-2">Email</p>
              <p className="font-medium break-all">{colaborador.email}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 my-4"></div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Formação</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            {colaborador.formacao.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>

        <div className="border-t border-gray-300 my-4"></div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Experiência</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            {colaborador.experiencia.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
