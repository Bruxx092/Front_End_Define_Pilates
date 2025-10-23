// @ts-nocheck
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/Content/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Pencil, User, FileText, BookOpen, Image as ImageIcon, Plus } from "lucide-react";

import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import { useSidebar } from "@/context/SidebarContext";

const CHART_COLORS = ["#81C784", "#4DB6AC", "#4DD0E1", "#00BCD4"];
const API_BASE = import.meta.env.VITE_API_BASE || "";

export default function MinhaEvolucao() {
  const navigate = useNavigate();
  const { isMobile, sidebarWidth } = useSidebar();
  const [menuOpen, setMenuOpen] = useState(false);

  const [data, setData] = useState([
    { name: "Janeiro", desempenho: 0, fill: CHART_COLORS[0] },
    { name: "Fevereiro", desempenho: 0, fill: CHART_COLORS[1] },
  ]);
  const [aluno, setAluno] = useState({
    nome: "—",
    email: "—",
    telefone: "—",
    modalidade: "—",
    ativo: true,
    reavaliacao: "—",
    observacoes: "",
    feedback: "",
    caracteristicas: { flexibilidade: "", postura: "", forca: "", extras: [] },
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isInstrutor, setIsInstrutor] = useState(false);

  const { alunoId: alunoIdParam } = useParams();
  const usuarioStorage = JSON.parse(localStorage.getItem("usuario") || "null");

  const [observacoes, setObservacoes] = useState(aluno.observacoes);
  const [feedback, setFeedback] = useState(aluno.feedback);
  const [caracteristicas, setCaracteristicas] = useState([
    { id: "flexibilidade", label: "Flexibilidade", value: aluno.caracteristicas.flexibilidade },
    { id: "postura", label: "Postura", value: aluno.caracteristicas.postura },
    { id: "forca", label: "Força", value: aluno.caracteristicas.forca },
  ]);

  useEffect(() => {
    const usuario = usuarioStorage || { id: null, tipo: "aluno" };
    setIsInstrutor(usuario.tipo === "instrutor");
  }, []);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token") || "";
        const alunoId = alunoIdParam || (usuarioStorage && usuarioStorage.id) || null;
        if (!alunoId) return; // apenas não faz nada se não houver ID

        const headers = { Authorization: token ? `Bearer ${token}` : "" };
        const [alunoRes, evolucaoRes] = await Promise.all([
          fetch(`${API_BASE}/api/aluno/${alunoId}`, { headers, signal: controller.signal }),
          fetch(`${API_BASE}/api/minha-evolucao/${alunoId}`, { headers, signal: controller.signal }),
        ]);

        if (!alunoRes.ok) return;
        if (!evolucaoRes.ok) return;

        const alunoData = await alunoRes.json();
        const evolucaoData = await evolucaoRes.json();

        const normalized = (Array.isArray(evolucaoData) ? evolucaoData : []).map((item, index) => ({
          name: item.mes || item.name || `#${index + 1}`,
          desempenho: typeof item.valor !== "undefined" ? item.valor : item.desempenho || 0,
          fill: CHART_COLORS[index % CHART_COLORS.length],
        }));

        if (!mounted) return;

        setAluno(alunoData);
        setData(normalized);
        setObservacoes(alunoData?.observacoes || "");
        setFeedback(alunoData?.feedback || "");

        const initialCaracteristicas = [
          { id: "flexibilidade", label: "Flexibilidade", value: alunoData?.caracteristicas?.flexibilidade || "" },
          { id: "postura", label: "Postura", value: alunoData?.caracteristicas?.postura || "" },
          { id: "forca", label: "Força", value: alunoData?.caracteristicas?.forca || "" },
        ];

        if (Array.isArray(alunoData?.caracteristicas?.extras)) {
          alunoData.caracteristicas.extras.forEach((extra, idx) => {
            if (initialCaracteristicas.length < 6) {
              initialCaracteristicas.push({ id: `extra_${idx}`, label: `Característica ${initialCaracteristicas.length + 1}`, value: extra });
            }
          });
        }

        setCaracteristicas(initialCaracteristicas);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.warn("Erro buscando API:", err.message);
        setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [alunoIdParam, usuarioStorage]);

  const yDomain = useMemo(() => {
    if (!data || data.length === 0) return [0, "auto"];
    const values = data.map((d) => Number(d.desempenho) || 0);
    const max = Math.max(...values, 1);
    return [0, Math.ceil(max / 5) * 5 + 5];
  }, [data]);

  const handleSalvar = async () => {
    if (!isInstrutor) {
      alert("Apenas instrutores podem salvar alterações.");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token") || "";
      const alunoId = alunoIdParam || (usuarioStorage && usuarioStorage.id);
      if (!alunoId) throw new Error("ID do aluno não disponível.");

      const payload = {
        observacoes,
        feedback,
        caracteristicas: {
          flexibilidade: caracteristicas[0].value,
          postura: caracteristicas[1].value,
          forca: caracteristicas[2].value,
          extras: caracteristicas.slice(3).map(c => c.value),
        },
      };

      const res = await fetch(`${API_BASE}/api/aluno/${alunoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => null);
        throw new Error(`Falha ao salvar: ${res.status} ${errText || res.statusText}`);
      }

      const updated = await res.json();
      setAluno(updated);
      setObservacoes(updated.observacoes || "");
      setFeedback(updated.feedback || "");

      const updatedCaracteristicas = [
        { id: "flexibilidade", label: "Flexibilidade", value: updated?.caracteristicas?.flexibilidade || "" },
        { id: "postura", label: "Postura", value: updated?.caracteristicas?.postura || "" },
        { id: "forca", label: "Força", value: updated?.caracteristicas?.forca || "" },
      ];

      if (Array.isArray(updated?.caracteristicas?.extras)) {
        updated.caracteristicas.extras.forEach((extra, idx) => {
          if (updatedCaracteristicas.length < 6) {
            updatedCaracteristicas.push({ id: `extra_${idx}`, label: `Característica ${updatedCaracteristicas.length + 1}`, value: extra });
          }
        });
      }

      setCaracteristicas(updatedCaracteristicas);
      alert("Salvo com sucesso.");
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert(`Erro ao salvar: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCharChange = (index) => (e) => {
    setCaracteristicas((prev) => {
      const newChars = [...prev];
      newChars[index].value = e.target.value;
      return newChars;
    });
  };

  const handleAddCaracteristica = () => {
    if (caracteristicas.length >= 6) return;
    setCaracteristicas((prev) => [
      ...prev,
      { id: `extra_${prev.length}`, label: `Característica ${prev.length + 1}`, value: "" },
    ]);
  };

  const handleKeyNavigation = (path, e) => {
    if (e.key === "Enter" || e.key === " ") navigate(path);
  };

  const podeEditar = isInstrutor;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarUnificada
        menuItems={sidebarConfigs.aluno.menuItems}
        userInfo={sidebarConfigs.aluno.userInfo}
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
        <main className="flex-1 p-2 md:p-8">
          <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 p-4 md:p-0 md:mb-6">
            Minha Evolução
          </h1>

          <Card className="shadow-lg md:shadow-xl rounded-none md:rounded-lg border-none">
            <CardContent className="flex flex-col p-0 gap-0">
              {/* Dados pessoais */}
              <div className="flex flex-col sm:flex-row p-4 md:p-6 gap-4 md:gap-8 relative">
                <p className="absolute top-2 right-4 text-xs text-red-600 font-medium">
                  *Próxima reavaliação em {aluno?.reavaliacao || "—"}
                </p>
                <div className="w-full sm:w-auto flex flex-row sm:flex-col gap-4 sm:gap-0 sm:items-start">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-lg bg-gray-300 flex items-center justify-center text-gray-600 mr-4 sm:mr-0 sm:mb-4">
                    <User className="w-14 h-14 text-white" />
                  </div>
                  <div className="flex flex-col justify-center sm:justify-start">
                    <p className="text-gray-500 text-sm hidden sm:block">Históricos</p>
                    <p className="text-green-600 font-semibold text-base sm:text-lg -mt-1 sm:mt-2">
                      {aluno?.ativo === false ? "Inativo" : "Ativo"}
                    </p>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-3 text-sm mt-0 sm:mt-1">
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-gray-500 text-xs sm:text-sm">Nome completo</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{aluno?.nome}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-gray-500 text-xs sm:text-sm">Modalidade</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{aluno?.modalidade}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-gray-500 text-xs sm:text-sm">Email</p>
                    <p className="text-gray-800 text-sm sm:text-base">{aluno?.email}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-gray-500 text-xs sm:text-sm">Telefone</p>
                    <p className="text-gray-800 text-sm sm:text-base">{aluno?.telefone}</p>
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="px-4 pb-4 md:px-8 md:pb-8 border-t pt-4 flex flex-wrap gap-3 justify-center sm:justify-start">
                {[{ path: "/aluno/historico-atestados", icon: <FileText className="w-5 h-5 text-gray-600 mb-1" />, label: "Histórico de Atestados" },
                  { path: "/aluno/historico-aulas", icon: <BookOpen className="w-5 h-5 text-gray-600 mb-1" />, label: "Histórico de Aulas" },
                  { path: "/aluno/fotos", icon: <ImageIcon className="w-5 h-5 text-gray-600 mb-1" />, label: "Fotos" },
                ].map((btn, i) => (
                  <div
                    key={i}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(btn.path)}
                    onKeyDown={(e) => handleKeyNavigation(btn.path, e)}
                    className="flex flex-col items-center p-3 w-28 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-150"
                  >
                    {btn.icon}
                    <span className="text-xs text-center text-gray-700">{btn.label}</span>
                  </div>
                ))}
              </div>

              {/* Gráfico e observações */}
              <div className="flex flex-col lg:flex-row p-4 md:p-8 gap-6 bg-gray-50 md:bg-white border-t">
                <div className="lg:w-1/2 bg-white rounded-lg p-4 shadow-md border border-gray-100 flex items-center justify-center">
                  <div className="w-full">
                    <h2 className="font-semibold text-lg mb-4 text-gray-800 text-center">Desempenho</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={data} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                        <YAxis axisLine={false} tickLine={false} domain={yDomain} tick={{ fontSize: 12, fill: "#6B7280" }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "4px" }}
                          labelStyle={{ fontWeight: "bold" }}
                        />
                        <Bar dataKey="desempenho" radius={[6, 6, 0, 0]} barSize={30}>
                          {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill || CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="lg:w-1/2 bg-white rounded-lg shadow-md p-5 border border-gray-100 relative">
                  {podeEditar && (
                    <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-2" title="Editar">
                      <Pencil size={18} />
                    </button>
                  )}
                  <h2 className="font-semibold text-lg mb-2 text-gray-800">Observações do Instrutor</h2>

                  {podeEditar ? (
                    <textarea id="observacoes" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} className="border p-2 w-full h-32" />
                  ) : (
                    <p className="text-sm text-gray-700 mb-4 whitespace-pre-wrap">{aluno?.observacoes}</p>
                  )}

                  <h3 className="font-semibold text-lg mt-4 mb-2 text-gray-800">Feedback rápido</h3>
                  {podeEditar ? (
                    <textarea id="feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} className="border p-2 w-full h-24" />
                  ) : (
                    <p className="text-sm text-gray-700 mb-4">{aluno?.feedback}</p>
                  )}

                  <h3 className="font-semibold text-lg mt-4 mb-2 text-gray-800">Características</h3>
                  {podeEditar ? (
                    <div className="flex flex-col gap-2">
                      {caracteristicas.map((char, idx) => (
                        <input
                          key={char.id}
                          type="text"
                          className="border p-2"
                          value={char.value}
                          placeholder={char.label}
                          onChange={handleCharChange(idx)}
                        />
                      ))}
                      {caracteristicas.length < 6 && (
                        <button onClick={handleAddCaracteristica} className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded w-28">
                          <Plus size={16} /> Adicionar
                        </button>
                      )}
                      <button onClick={handleSalvar} className={`mt-3 ${saving ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-2 rounded`} disabled={saving}>
                        {saving ? "Salvando..." : "Salvar"}
                      </button>
                    </div>
                  ) : (
                    <>
                      {caracteristicas.map((char) => (
                        <p key={char.id} className="text-sm text-gray-700">{char.label} ({char.value || "—"})</p>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
