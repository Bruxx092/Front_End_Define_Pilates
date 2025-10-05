import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Card, CardContent } from "../../../components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Pencil,
  User,
  FileText,
  BookOpen,
  Image as ImageIcon,
} from "lucide-react";

const CHART_COLORS = [
  "#81C784",
  "#4DB6AC",
  "#4DD0E1",
  "#00BCD4",
];

export default function MinhaEvolucao() {
  const navigate = useNavigate(); 
  const [data, setData] = useState([]);
  const [aluno, setAluno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInstrutor, setIsInstrutor] = useState(false);

  const setMockUserType = () => true; 

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario")) || { id: 1, tipo: "aluno" };
    usuario.tipo = setMockUserType() ? "instrutor" : "aluno";
    localStorage.setItem("usuario", JSON.stringify(usuario));
    setIsInstrutor(usuario.tipo === "instrutor");

    async function fetchData() {
      try {
        const token = localStorage.getItem("token");

        const alunoRes = await fetch(`/api/aluno/${usuario?.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const evolucaoRes = await fetch(`/api/minha-evolucao/${usuario?.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!alunoRes.ok || !evolucaoRes.ok)
          throw new Error("API indisponível");

        const alunoData = await alunoRes.json();
        const evolucaoData = await evolucaoRes.json();

        const normalized = evolucaoData.map((item, index) => ({
          name: item.mes || item.name,
          desempenho: item.valor || item.desempenho,
          fill: CHART_COLORS[index % CHART_COLORS.length],
        }));

        setAluno(alunoData);
        setData(normalized);
      } catch (err) {
        console.warn("Usando mockup pois API não está disponível:", err.message);

        setAluno({
          nome: "Garibalda",
          email: "gari@gmail.com",
          telefone: "(11) 91234-5678",
          modalidade: "Pilates",
          reavaliacao: "30/09",
          observacoes: "Postura melhorada, core precisa de atenção.\nPrancha: 30s → 50s, boa evolução na força.\nFlexibilidade e mobilidade em progresso.",
          feedback: "Você manteve a postura durante todo o mês, e sua prancha já chegou a 50 segundos!",
          caracteristicas: {
            flexibilidade: "7/10",
            postura: "Muito boa",
            forca: "7/10"
          }
        });

        setData([
          { name: "Junho", desempenho: 8, fill: CHART_COLORS[0] },
          { name: "Julho", desempenho: 12, fill: CHART_COLORS[1] },
          { name: "Agosto", desempenho: 18, fill: CHART_COLORS[2] },
          { name: "Setembro", desempenho: 22, fill: CHART_COLORS[3] },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSalvar = () => {
    const dadosParaSalvar = {
      observacoes: document.getElementById("observacoes")?.value,
      feedback: document.getElementById("feedback")?.value,
      caracteristicas: {
        flexibilidade: document.getElementById("flexibilidade")?.value,
        postura: document.getElementById("postura")?.value,
        forca: document.getElementById("forca")?.value,
      }
    };
    console.log("Dados para salvar:", dadosParaSalvar);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-600">Carregando dados...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">Erro: {error}</div>;

  const handleKeyNavigation = (path, e) => {
    if (e.key === "Enter" || e.key === " ") navigate(path);
  };

  return (
    <div className="min-h-screen bg-white md:bg-gray-100 p-2 md:p-8">
      <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 p-4 md:p-0 md:mb-6">Minha Evolução</h1>

      <Card className="shadow-lg md:shadow-xl rounded-none md:rounded-lg border-none">
        <CardContent className="flex flex-col p-0 gap-0">

          {/* Dados pessoais */}
          <div className="flex flex-col sm:flex-row p-4 md:p-6 gap-4 md:gap-8 relative">
            <p className="absolute top-2 right-4 text-xs text-red-600 font-medium">*Próxima reavaliação em {aluno?.reavaliacao}</p>
            <div className="w-full sm:w-auto flex flex-row sm:flex-col gap-4 sm:gap-0 sm:items-start">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-lg bg-gray-300 flex items-center justify-center text-gray-600 mr-4 sm:mr-0 sm:mb-4">
                <User className="w-14 h-14 text-white" />
              </div>
              <div className="flex flex-col justify-center sm:justify-start">
                <p className="text-gray-500 text-sm hidden sm:block">Históricos</p>
                <p className="text-green-600 font-semibold text-base sm:text-lg -mt-1 sm:mt-2">Ativo</p>
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
            {[
              { path: "/historico-atestados", icon: <FileText className="w-5 h-5 text-gray-600 mb-1" />, label: "Histórico de Atestados" },
              { path: "/historico-aulas", icon: <BookOpen className="w-5 h-5 text-gray-600 mb-1" />, label: "Histórico de Aulas" },
              { path: "/fotos", icon: <ImageIcon className="w-5 h-5 text-gray-600 mb-1" />, label: "Fotos" },
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
            {/* Gráfico */}
            <div className="lg:w-1/2 bg-white rounded-lg p-4 shadow-md border border-gray-100 flex flex-col">
              <h2 className="font-semibold text-lg mb-4 text-gray-800">Desempenho</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <YAxis axisLine={false} tickLine={false} domain={[0, 25]} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }} labelStyle={{ fontWeight: 'bold' }} />
                  <Bar dataKey="desempenho" radius={[6, 6, 0, 0]} barSize={30}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Observações */}
            <div className="lg:w-1/2 bg-white rounded-lg shadow-md p-5 border border-gray-100 relative">
              {isInstrutor && (
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-2">
                  <Pencil size={18} />
                </button>
              )}
              <h2 className="font-semibold text-lg mb-2 text-gray-800">Observações do Instrutor</h2>
              {isInstrutor ? (
                <textarea id="observacoes" className="border p-2 w-full h-32" defaultValue={aluno?.observacoes} />
              ) : (
                <p className="text-sm text-gray-700 mb-4 whitespace-pre-wrap">{aluno?.observacoes}</p>
              )}
              <h3 className="font-semibold text-lg mt-4 mb-2 text-gray-800">Feedback rápido</h3>
              {isInstrutor ? (
                <textarea id="feedback" className="border p-2 w-full h-24" defaultValue={aluno?.feedback} />
              ) : (
                <p className="text-sm text-gray-700 mb-4">{aluno?.feedback}</p>
              )}
              <h3 className="font-semibold text-lg mt-4 mb-2 text-gray-800">Características</h3>
              {isInstrutor ? (
                <div className="flex flex-col gap-2">
                  <input id="flexibilidade" type="text" className="border p-2" defaultValue={`Flexibilidade (${aluno?.caracteristicas?.flexibilidade})`} />
                  <input id="postura" type="text" className="border p-2" defaultValue={`Postura (${aluno?.caracteristicas?.postura})`} />
                  <input id="forca" type="text" className="border p-2" defaultValue={`Força (${aluno?.caracteristicas?.forca})`} />
                  <button onClick={handleSalvar} className="mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Salvar</button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-700">Flexibilidade ({aluno?.caracteristicas?.flexibilidade})</p>
                  <p className="text-sm text-gray-700">Postura ({aluno?.caracteristicas?.postura})</p>
                  <p className="text-sm text-gray-700">Força ({aluno?.caracteristicas?.forca})</p>
                </>
              )}
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
