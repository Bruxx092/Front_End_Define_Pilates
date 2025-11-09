// Atualização: removido bloco de "Carregando dados..." e paginação sempre renderiza
// Basta substituir pelo seu componente completo.

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
import { User, FileText, BookOpen, Image as ImageIcon } from "lucide-react";

import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import { useSidebar } from "@/context/SidebarContext";

const CHART_COLORS = ["#81C784", "#4DB6AC", "#4DD0E1", "#00BCD4"];
const API_BASE = import.meta.env.VITE_API_BASE || "";

export default function MinhaEvolucao() {
  const navigate = useNavigate();
  const { isMobile, sidebarWidth } = useSidebar();
  const [menuOpen, setMenuOpen] = useState(false);

  const [data, setData] = useState([]);
  const [aluno, setAluno] = useState(null);

  const [error, setError] = useState(null);

  const { alunoId: alunoIdParam } = useParams();
  const usuarioStorage = JSON.parse(localStorage.getItem("usuario") || "null");

  const [observacoes, setObservacoes] = useState("");
  const [feedback, setFeedback] = useState("");
  const [caracteristicas, setCaracteristicas] = useState([
    { id: "flexibilidade", label: "Flexibilidade", value: "" },
    { id: "postura", label: "Postura", value: "" },
    { id: "forca", label: "Força", value: "" },
  ]);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function fetchData() {
      setError(null);
      try {
        const token = localStorage.getItem("token") || "";
        const alunoId = alunoIdParam || (usuarioStorage && usuarioStorage.id) || null;
        if (!alunoId) throw new Error("ID do aluno não encontrado.");

        const headers = { Authorization: token ? `Bearer ${token}` : "" };
        const [alunoRes, evolucaoRes] = await Promise.all([
          fetch(`${API_BASE}/api/aluno/${alunoId}`, {
            headers,
            signal: controller.signal,
          }),
          fetch(`${API_BASE}/api/minha-evolucao/${alunoId}`, {
            headers,
            signal: controller.signal,
          }),
        ]);

        if (!alunoRes.ok) throw new Error("Erro ao buscar aluno.");
        if (!evolucaoRes.ok) throw new Error("Erro ao buscar evolução.");

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
          {
            id: "flexibilidade",
            label: "Flexibilidade",
            value: alunoData?.caracteristicas?.flexibilidade || "",
          },
          {
            id: "postura",
            label: "Postura",
            value: alunoData?.caracteristicas?.postura || "",
          },
          {
            id: "forca",
            label: "Força",
            value: alunoData?.caracteristicas?.forca || "",
          },
        ];

        if (Array.isArray(alunoData?.caracteristicas?.extras)) {
          alunoData.caracteristicas.extras.forEach((extra, idx) => {
            if (initialCaracteristicas.length < 6) {
              initialCaracteristicas.push({
                id: `extra_${idx}`,
                label: `Característica ${initialCaracteristicas.length + 1}`,
                value: extra,
              });
            }
          });
        }

        setCaracteristicas(initialCaracteristicas);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.warn("Erro buscando API:", err.message);
        setError(err.message);
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

  const handleKeyNavigation = (path, e) => {
    if (e.key === "Enter" || e.key === " ") navigate(path);
  };

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
        style={{ marginLeft: !isMobile ? `${sidebarWidth}px` : "0", width: !isMobile ? `calc(100% - ${sidebarWidth}px)` : "100%" }}
      >
        <main className="flex-1 p-2 md:p-8">
          <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 p-4 md:p-0 md:mb-6">
            Minha Evolução
          </h1>

          {error && (
            <div className="text-center text-red-500 mb-4 font-medium">Erro: {error}</div>
          )}

          <Card className="shadow-lg md:shadow-xl rounded-none md:rounded-lg border-none">
            <CardContent className="flex flex-col p-0 gap-0">

              <div className="flex flex-col sm:flex-row p-4 md:p-6 gap-4 md:gap-8 relative">
                <p className="absolute top-2 right-4 text-xs text-red-600 font-medium">
                  *Próxima reavaliação em {aluno?.reavaliacao || "—"}
                </p>

                <div className="w-full sm:w-auto flex flex-row sm:flex-col gap-4 sm:gap-0">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-lg bg-gray-300 flex items-center justify-center text-gray-600">
                    <User className="w-14 h-14 text-white" />
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-3 text-sm">
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-gray-500 text-xs">Nome completo</p>
                    <p className="font-semibold text-gray-900">{aluno?.nome}</p>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-gray-500 text-xs">Modalidade</p>
                    <p className="font-semibold text-gray-900">{aluno?.modalidade}</p>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-gray-500 text-xs">Email</p>
                    <p className="text-gray-800">{aluno?.email}</p>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-gray-500 text-xs">Telefone</p>
                    <p className="text-gray-800">{aluno?.telefone}</p>
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4 md:px-8 md:pb-8 border-t pt-4 flex flex-wrap gap-3 justify-center sm:justify-start">
                {[
                  {
                    path: "/aluno/historico-atestados",
                    icon: <FileText className="w-5 h-5 text-gray-600 mb-1" />,
                    label: "Histórico de Atestados",
                  },
                  {
                    path: "/aluno/historico-aulas",
                    icon: <BookOpen className="w-5 h-5 text-gray-600 mb-1" />,
                    label: "Histórico de Aulas",
                  },
                  {
                    path: "/aluno/fotos",
                    icon: <ImageIcon className="w-5 h-5 text-gray-600 mb-1" />,
                    label: "Fotos",
                  },
                ].map((btn, i) => (
                  <div
                    key={i}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(btn.path)}
                    onKeyDown={(e) => handleKeyNavigation(btn.path, e)}
                    className="flex flex-col items-center p-3 w-28 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                  >
                    {btn.icon}
                    <span className="text-xs text-center text-gray-700">
                      {btn.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col lg:flex-row p-4 md:p-8 gap-6 bg-gray-50 md:bg-white border-t">
                <div className="lg:w-1/2 bg-white rounded-lg p-4 shadow-md border">
                  <h2 className="font-semibold text-lg mb-4 text-gray-800 text-center">
                    Desempenho
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                      <YAxis axisLine={false} tickLine={false} domain={yDomain} tick={{ fontSize: 12, fill: "#6B7280" }} />
                      <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "4px" }} labelStyle={{ fontWeight: "bold" }} />
                      <Bar dataKey="desempenho" radius={[6, 6, 0, 0]} barSize={30}>
                        {data.map((entry, index) => (
                          <Cell key={index} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="lg:w-1/2 bg-white rounded-lg shadow-md p-5 border">
                  <h2 className="font-semibold text-lg mb-2 text-gray-800">Observações</h2>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {observacoes || "Nenhuma observação registrada."}
                  </p>

                  <h3 className="font-semibold text-lg mt-4 mb-2 text-gray-800">Feedback</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {feedback || "Nenhum feedback registrado."}
                  </p>

                  <h3 className="font-semibold text-lg mt-4 mb-2 text-gray-800">Características</h3>
                  {caracteristicas.map((char) => (
                    <p key={char.id} className="text-sm text-gray-700">
                      {char.label}: <b>{char.value || "—"}</b>
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}