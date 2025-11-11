// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Content/card";
import { Button } from "@/components/ui/Content/button";
import { Input } from "@/components/ui/Content/input";
import { Calendar, Search, Plus, Upload, X, ArrowLeft } from "lucide-react";
import axios from "axios";

export default function AtestadoPage() {
  const [atestados, setAtestados] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [selectedAtestado, setSelectedAtestado] = useState(null);

  const [novaDataConsulta, setNovaDataConsulta] = useState("");
  const [novaQtdDias, setNovaQtdDias] = useState("");
  const [novoCodigoDoenca, setNovoCodigoDoenca] = useState("");
  const [novoMedico, setNovoMedico] = useState("");
  const [novaFoto, setNovaFoto] = useState(null);

  const [isInstrutor, setIsInstrutor] = useState(false);

  const token = localStorage.getItem("token"); // JWT do usuário logado

  // Busca o usuário logado para determinar se é instrutor
  const fetchUsuarioLogado = async () => {
    try {
      const response = await axios.get("/api/usuario", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usuario = response.data;
      setIsInstrutor(usuario.tipo === "instrutor");
    } catch (err) {
      console.error("Erro ao buscar usuário logado:", err);
      setIsInstrutor(false);
    }
  };

  // Busca os atestados via API
  const fetchAtestados = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/atestados", {
        headers: { Authorization: `Bearer ${token}` },
        params: { inicio: startDate, fim: endDate },
      });
      const data = response.data.map((item) => ({
        ...item,
        color: item.status === "Aprovado" ? "text-green-500" : "text-red-500",
      }));
      setAtestados(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar os atestados.");
    } finally {
      setLoading(false);
    }
  };

  // Envia um novo atestado (aluno)
  const handleEnviarAtestado = async () => {
    try {
      const formData = new FormData();
      formData.append("date", novaDataConsulta);
      formData.append("dias", novaQtdDias);
      formData.append("codigoDoenca", novoCodigoDoenca);
      formData.append("medico", novoMedico);
      if (novaFoto) formData.append("foto", novaFoto);

      await axios.post("/api/atestados", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      handleCloseAddModal();
      fetchAtestados();
    } catch (err) {
      console.error(err);
      alert("Falha ao enviar atestado");
    }
  };

  // Inicialização
  useEffect(() => {
    fetchUsuarioLogado();

    // Definir período inicial: mês vigente
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = now;
    setStartDate(firstDay.toISOString().split("T")[0]);
    setEndDate(lastDay.toISOString().split("T")[0]);
  }, []);

  // Buscar atestados sempre que datas mudarem
  useEffect(() => {
    if (startDate && endDate) fetchAtestados();
  }, [startDate, endDate]);

  const parseDate = (dateString) => new Date(dateString);

  const handleFilter = () => {
    if (!startDate || !endDate) {
      setSearchActive(false);
      return;
    }
    fetchAtestados();
    setSearchActive(true);
  };

  const handleOpenAtestado = (atestado) => {
    setSelectedAtestado(atestado);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAtestado(null);
  };

  const handleOpenAddModal = () => setModalAddOpen(true);
  const handleCloseAddModal = () => {
    setModalAddOpen(false);
    setNovaDataConsulta("");
    setNovaQtdDias("");
    setNovoCodigoDoenca("");
    setNovoMedico("");
    setNovaFoto(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 mb-4 text-teal-500 hover:text-teal-700"
      >
        <ArrowLeft size={18} /> Voltar
      </button>

      <h1 className="text-2xl font-normal text-gray-800 mb-6">
        Histórico de Atestados
      </h1>

      {!isInstrutor && (
        <div className="mb-6">
          <Button
            className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6"
            onClick={handleOpenAddModal}
          >
            Enviar novo atestado
          </Button>
        </div>
      )}

      {/* Filtro */}
      <Card className="mb-6 shadow-sm border-gray-200">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center">
          <h2 className="text-sm font-medium text-gray-700 w-full sm:w-auto sm:text-nowrap">
            Filtrar por período:
          </h2>
          <div className="relative w-full sm:w-1/3">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="pl-8"
            />
            <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <div className="relative w-full sm:w-1/3">
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="pl-8"
            />
            <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <Button
            onClick={handleFilter}
            className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 flex items-center justify-center gap-2"
          >
            <Search className="h-4 w-4" /> Buscar
          </Button>
        </CardContent>
      </Card>

      {/* Lista de atestados */}
      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <h2 className="text-lg font-normal text-gray-800 mb-4">
            {searchActive
              ? `Resultados da busca (${atestados.length})`
              : "Últimos envios"}
          </h2>

          <Card className="shadow-sm border-gray-200">
            <CardContent className="p-0 overflow-x-auto">
              {atestados.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {atestados.map((atestado) => (
                    <li
                      key={atestado.id}
                      role="button"
                      tabIndex={0}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 hover:bg-gray-50 transition duration-150 cursor-pointer"
                      onClick={() => handleOpenAtestado(atestado)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleOpenAtestado(atestado);
                        }
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <span
                          className={`${atestado.color} text-lg leading-none`}
                        >
                          &bull;
                        </span>
                        <span className="text-gray-700 font-medium">
                          {atestado.date}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {atestado.status}
                        </span>
                      </div>
                      <Plus className="h-5 w-5 text-gray-400 hover:text-teal-500 mt-2 sm:mt-0" />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="p-4 text-gray-500">
                  Nenhum atestado encontrado no período.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Modal detalhes */}
      {modalOpen && selectedAtestado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={handleCloseModal}
            >
              <X />
            </button>
            <h2 className="text-xl font-semibold mb-4">Detalhes do Atestado</h2>
            <p>
              <strong>Data:</strong> {selectedAtestado.date}
            </p>
            <p>
              <strong>Status:</strong> {selectedAtestado.status}
            </p>
            <p>
              <strong>Código da Doença:</strong> {selectedAtestado.codigoDoenca}
            </p>
            <p>
              <strong>Médico:</strong>{" "}
              {selectedAtestado.medico || "Não informado"}
            </p>
            <p>
              <strong>Foto:</strong>{" "}
              {selectedAtestado.fotoUrl ? (
                <img
                  src={selectedAtestado.fotoUrl}
                  alt="Atestado"
                  className="max-w-full rounded mt-2"
                />
              ) : (
                "Sem imagem"
              )}
            </p>
          </div>
        </div>
      )}

      {/* Modal adicionar (apenas aluno) */}
      {modalAddOpen && !isInstrutor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={handleCloseAddModal}
            >
              <X />
            </button>
            <h2 className="text-xl font-semibold mb-4">Enviar Novo Atestado</h2>
            <Input
              type="date"
              value={novaDataConsulta}
              onChange={(e) => setNovaDataConsulta(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Quantidade de dias de licença"
              value={novaQtdDias}
              onChange={(e) => setNovaQtdDias(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Código da doença"
              value={novoCodigoDoenca}
              onChange={(e) => setNovoCodigoDoenca(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Médico que atendeu"
              value={novoMedico}
              onChange={(e) => setNovoMedico(e.target.value)}
            />
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <label className="cursor-pointer flex items-center gap-2 bg-gray-200 px-3 py-2 rounded">
                <Upload className="h-4 w-4" /> Enviar foto
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNovaFoto(e.target.files[0])}
                  className="hidden"
                />
              </label>
              {novaFoto && (
                <span className="text-sm truncate max-w-xs">
                  {novaFoto.name}
                </span>
              )}
            </div>
            <Button
              className="w-full bg-teal-500 hover:bg-teal-600 text-white"
              onClick={handleEnviarAtestado}
            >
              Enviar Atestado
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
