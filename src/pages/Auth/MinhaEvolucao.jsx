import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Pencil,
  User,
  FileText,
  Calendar,
  BookOpen,
  LogOut,
} from "lucide-react";

export default function MinhaEvolucao({ isProfessor = false }) {
  const [data, setData] = useState([
    { name: "Junho", desempenho: 8, fill: "#2196F3" },
    { name: "Julho", desempenho: 12, fill: "#4CAF50" },
    { name: "Agosto", desempenho: 18, fill: "#FF9800" },
    { name: "Setembro", desempenho: 22, fill: "#E91E63" },
  ]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/minha-evolucao"); // futuro endpoint
        if (!res.ok) throw new Error("API indisponível");
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.log(
          "Usando mockup pois API não está disponível",
          error.message
        );
      }
    }
    fetchData();
  }, []);

  const SidebarItem = ({ icon: Icon, text, isActive = false }) => (
    <div
      className={`flex items-center p-3 text-white cursor-pointer transition-colors ${
        isActive ? "bg-blue-600" : "hover:bg-blue-600"
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span>{text}</span>
    </div>
  );

  const HistoryCard = ({ icon: Icon, text, isActive = false }) => (
    <div
      className={`flex flex-col items-center justify-center p-3 w-32 h-20 border-2 rounded-lg cursor-pointer transition-all ${
        isActive
          ? "border-blue-500 bg-blue-50 text-blue-700"
          : "border-gray-300 bg-white text-gray-700 hover:border-blue-300"
      }`}
    >
      {Icon && <Icon className="w-6 h-6 mb-1" />}
      <span className="text-xs text-center">{text}</span>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-56 bg-[#213a52] text-white flex flex-col justify-between fixed h-full shadow-lg">
        <div>
          <h2 className="text-xl font-semibold p-6 border-b border-blue-800">
            Menu
          </h2>
          <div className="mt-4">
            <SidebarItem icon={User} text="Contatos" />
            <SidebarItem icon={Calendar} text="Agenda" />
            <SidebarItem icon={BookOpen} text="Aulas" isActive />
          </div>
        </div>

        <div className="p-4 border-t border-blue-800">
          <div className="flex items-center text-sm">
            <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center mr-2">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold">Aluno</p>
              <p className="text-xs text-gray-300">aluno@email.com</p>
            </div>
          </div>
          <div className="flex items-center mt-3 text-red-400 hover:text-red-300 cursor-pointer text-sm">
            <LogOut className="w-4 h-4 mr-2" />
            <span>Sair</span>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 ml-56 p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Minha Evolução
        </h1>

        <Card className="shadow-xl rounded-lg border-none">
          <CardContent className="flex flex-col md:flex-row p-8 gap-8">
            {/* Perfil */}
            <div className="md:w-1/4 flex flex-col items-start border-r pr-8">
              <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-3xl font-bold">
                <User className="w-16 h-16 text-white" />
              </div>

              <div className="mt-4">
                <p className="text-gray-500 text-sm">Nome completo</p>
                <p className="font-bold text-lg mb-2">Garibalda</p>

                <p className="text-gray-500 text-sm">Email</p>
                <p className="text-gray-800 font-medium mb-2">
                  gari@gmail.com
                </p>

                <p className="text-gray-500 text-sm">Telefone</p>
                <p className="text-gray-800 font-medium">(11) 91234-5678</p>
              </div>

              <div className="mt-4 w-full">
                <p className="text-green-600 font-semibold text-lg">Ativo</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-500 text-sm">Modalidade</p>
                  <p className="font-semibold text-blue-700 text-lg">Pilates</p>
                </div>
                <p className="text-xs text-red-500 mt-2 absolute top-2 right-8 font-semibold">
                  *Próxima reavaliação em 30/09
                </p>
              </div>
            </div>

            {/* Conteúdo principal */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Históricos */}
              <div className="pt-2">
                <h2 className="text-sm font-semibold text-gray-500 mb-3">
                  Históricos
                </h2>
                <div className="flex gap-4">
                  <HistoryCard icon={FileText} text="Histórico de Atestados" />
                  <HistoryCard icon={BookOpen} text="Histórico de Aulas" isActive />
                  <HistoryCard text="Fotos" />
                </div>
              </div>

              {/* Gráfico */}
              <div className="h-64 bg-white rounded-lg p-4 pt-8 shadow-sm border border-gray-200">
                <h2 className="font-bold text-lg mb-2">Desempenho</h2>
                <div className="flex items-center text-xs mb-4 space-x-4">
                  {data.map((entry) => (
                    <span key={entry.name} className="flex items-center">
                      <span
                        className="w-2 h-2 mr-1"
                        style={{ backgroundColor: entry.fill }}
                      ></span>
                      {entry.name}
                    </span>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height="80%">
                  <BarChart
                    data={data}
                    margin={{ top: 0, right: 10, left: -20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} domain={[0, 25]} />
                    <Tooltip />
                    {data.map((entry, index) => (
                      <Bar
                        key={`bar-${index}`}
                        dataKey="desempenho"
                        data={[entry]}
                        fill={entry.fill}
                        radius={[8, 8, 0, 0]}
                        isAnimationActive={false}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Observações */}
              <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 relative">
                {isProfessor && (
                  <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    <Pencil size={18} />
                  </button>
                )}
                <h2 className="font-bold text-lg mb-2">
                  Observações do Instrutor
                </h2>
                <p className="text-sm text-gray-700 mb-4">
                  Postura *melhorada*, core precisa de atenção. Prancha: *30s →
                  50s*, boa evolução na força. Flexibilidade e mobilidade em
                  progresso. Participação *ativa*, atenção nas instruções.
                  Sugestão: reforçar exercícios de *core em casa*.
                </p>

                <h3 className="font-bold text-lg mt-4 mb-2">Feedback rápido</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Você manteve a *postura durante todo o mês*, e sua prancha já
                  chegou a *50 segundos*! Excelente consistência. Continue
                  ativando o *core* em cada exercício para fortalecer ainda mais
                  o tronco.
                </p>

                <h3 className="font-bold text-lg mt-4 mb-2">Características</h3>
                <p className="text-sm text-gray-700">Flexibilidade *(7/10)*</p>
                <p className="text-sm text-gray-700">Postura *(Muito boa)*</p>
                <p className="text-sm text-gray-700">Força *(7/10)*</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
