// @ts-nocheck
import React, { useState } from "react";
import {
  Calendar,
  Clock,
  TrendingUp,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  User,
  Award,
  AlertCircle,
  CheckCircle,
  DollarSign,
  LineChart,
  Receipt,
  FileText,
  Eye,
  Download,
  ArrowRight,
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import Sidebar from "@/components/layout/Sidebar/SidebarUnificada";
import { useNavigate } from "react-router-dom";

const DashboardEstudante = () => {
  const navigate = useNavigate();
  const { sidebarWidth = 300, isMobile = false } = useSidebar();
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [activeTab, setActiveTab] = useState("agenda");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const contentStyle = {
    marginLeft: isMobile ? 0 : sidebarWidth,
    width: isMobile ? "100%" : `calc(100% - ${sidebarWidth}px)`,
    paddingBottom: "2rem",
  };

  const menuItems = [
    { title: "Dashboard", icon: TrendingUp, path: "/aluno/dashboard" },
    { title: "Minhas Aulas", icon: Calendar, path: "/aluno/minhas-aulas" },
    { title: "Minha Evolução", icon: LineChart, path: "/aluno/minha-evolucao" },
    { title: "Meus Planos", icon: CreditCard, path: "/aluno/planos" },
    { title: "Minhas Faturas", icon: Receipt, path: "/aluno/faturas" },
  ];

  const userInfo = {
    name: "Maria Silva",
    email: "aluno@gmail.com",
  };

  const studentName = "Maria Silva";
  const nextClass = {
    day: "Hoje",
    time: "14:00",
    type: "Pilates",
    instructor: "Prof. João Santos",
    studio: "Estúdio Central",
  };

  const planStatus = {
    name: "Plano Mensal - 3x semana",
    price: "R$ 390,00/mês",
    frequency: "3 vezes por semana",
    type: "Mensal",
    status: "ativo",
    dueDate: "05/11/2025",
    daysUntilDue: 14,
  };

  // Fatura mais recente
  const currentInvoice = {
    month: "Novembro 2025",
    amount: "R$ 390,00",
    status: "pending", // paid, pending, overdue
    dueDate: "05/11/2025",
    issueDate: "01/11/2025",
  };

  const statusConfig = {
    paid: {
      label: "Pago",
      className: "bg-green-100 text-green-700 border-green-200",
      icon: "✓",
    },
    pending: {
      label: "Em aberto",
      className: "bg-yellow-100 text-yellow-700 border-yellow-200",
      icon: "○",
    },
    overdue: {
      label: "Vencido",
      className: "bg-red-100 text-red-700 border-red-200",
      icon: "!",
    },
  };

  const schedule = [
    {
      day: "Seg",
      date: "20/10",
      time: "14:00",
      type: "Pilates",
      instructor: "Prof. João",
      studio: "Estúdio Itaquera",
    },
    {
      day: "Qua",
      date: "22/10",
      time: "14:00",
      type: "Pilates",
      instructor: "Prof. João",
      studio: "Estúdio Itaquera",
    },
    {
      day: "Sex",
      date: "24/10",
      time: "10:00",
      type: "Yoga",
      instructor: "Profa. Ana",
      studio: "Estúdio Itaquera",
    },
  ];

  const evolution = [
    {
      date: "15/10/2025",
      instructor: "Prof. João Santos",
      note: "Excelente progresso na postura! Continue focando na respiração durante os exercícios.",
      photos: 2,
    },
    {
      date: "01/10/2025",
      instructor: "Profa. Ana Costa",
      note: "Maior flexibilidade observada. Parabéns pelo empenho!",
      photos: 1,
    },
    {
      date: "15/09/2025",
      instructor: "Prof. João Santos",
      note: "Início do acompanhamento. Foco em fortalecer o core e melhorar equilíbrio.",
      photos: 3,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "ativo":
        return "bg-green-50 border-green-200 text-green-800";
      case "vencendo":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "expirado":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        menuItems={menuItems}
        userInfo={userInfo}
        isOpen={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />
      <div className="flex-1 transition-all duration-500" style={contentStyle}>
        <div
          className="text-white p-4 sm:p-6 shadow-md pt-16 sm:pt-6"
          style={{ backgroundColor: "#406882" }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white flex items-center justify-center">
                  <User size={24} style={{ color: "#406882" }} />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">
                    Olá, {studentName}!
                  </h1>
                  <p className="text-xs sm:text-sm opacity-90">
                    Bem-vinda ao seu espaço
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white border-opacity-20">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Clock size={24} className="text-white" />
                  <div>
                    <p className="text-xs sm:text-sm opacity-90">
                      Próxima aula
                    </p>
                    <p className="text-base sm:text-lg font-semibold">
                      {nextClass.day} às {nextClass.time}
                    </p>
                    <p className="text-xs sm:text-sm opacity-90">
                      {nextClass.type} - {nextClass.instructor}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white border-opacity-20">
                <div className="flex items-center gap-2 sm:gap-3">
                  <CreditCard size={24} className="text-white" />
                  <div>
                    <p className="text-xs sm:text-sm opacity-90">
                      Plano {planStatus.type}
                    </p>
                    <p className="text-base sm:text-lg font-semibold">
                      Status: Ativo
                    </p>
                    <p className="text-xs sm:text-sm opacity-90">
                      Vence em {planStatus.daysUntilDue} dias
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-2 sm:px-4 mt-4">
          <div className="flex justify-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: "agenda", label: "Agenda", icon: Calendar },
              { id: "evolucao", label: "Evolução", icon: TrendingUp },
              { id: "planos", label: "Planos", icon: CreditCard },
              { id: "faturas", label: "Faturas", icon: Receipt },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-6 py-2 rounded-lg font-medium text-sm sm:text-base transition-all whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab.id
                      ? "text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  style={
                    activeTab === tab.id ? { backgroundColor: "#406882" } : {}
                  }
                >
                  <Icon size={16} className="flex-shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4">
          {activeTab === "agenda" && (
            <div className="space-y-3">
              <div className="flex flex-col items-center sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
                  Minha Agenda
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedWeek(selectedWeek - 1)}
                    className="p-2 bg-white rounded-lg shadow-sm"
                    style={{ color: "#406882" }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-sm sm:text-base font-semibold text-gray-700 min-w-[100px] sm:min-w-[180px] text-center">
                    Semana Atual
                  </span>
                  <button
                    onClick={() => setSelectedWeek(selectedWeek + 1)}
                    className="p-2 bg-white rounded-lg shadow-sm"
                    style={{ color: "#406882" }}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="grid gap-2 sm:gap-4">
                {schedule.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm hover:shadow-md transition-shadow border-l-4"
                    style={{ borderLeftColor: "#406882" }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 sm:mb-3">
                          <div
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: "#406882" }}
                          >
                            <div className="text-center">
                              <div className="text-xs">{item.day}</div>
                              <div className="text-lg sm:text-xl">
                                {item.date.split("/")[0]}
                              </div>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                              {item.type}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600">
                              {item.instructor}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock size={16} />
                            <span className="text-sm sm:text-base">
                              {item.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Award size={16} />
                            <span className="text-sm sm:text-base">
                              {item.studio}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "evolucao" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Minha Evolução
              </h2>
              <div className="space-y-4">
                {evolution.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                        style={{ backgroundColor: "#406882" }}
                      >
                        <TrendingUp size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-base font-semibold text-gray-500">
                            {item.date}
                          </span>
                          {item.photos > 0 && (
                            <button
                              onClick={() =>
                                navigate("/aluno/minha-evolucao/fotos")
                              }
                              className="text-sm px-3 py-1 rounded-full text-white hover:opacity-90 transition-opacity flex items-center gap-2"
                              style={{ backgroundColor: "#1A5276" }}
                            >
                              <span>
                                {item.photos}{" "}
                                {item.photos === 1 ? "foto" : "fotos"}
                              </span>
                              <ChevronRight size={16} />
                            </button>
                          )}
                        </div>
                        <p className="text-base text-gray-600 mb-2">
                          {item.instructor}
                        </p>
                        <p className="text-lg text-gray-800 leading-relaxed">
                          {item.note}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "planos" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Meu Plano
              </h2>
              <div
                className={`rounded-xl p-6 shadow-sm border-2 ${getStatusColor(
                  planStatus.status
                )}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                      <CreditCard size={28} style={{ color: "#406882" }} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{planStatus.name}</h3>
                      <p className="text-base mt-1">{planStatus.price}</p>
                      <p className="text-sm text-green-600">
                        {planStatus.frequency}
                      </p>
                    </div>
                  </div>
                  <CheckCircle size={32} className="text-green-600" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-white bg-opacity-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">
                      Data de vencimento
                    </p>
                    <p className="text-xl font-semibold">
                      {planStatus.dueDate}
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Dias restantes</p>
                    <p className="text-xl font-semibold">
                      {planStatus.daysUntilDue} dias
                    </p>
                  </div>
                </div>

                <button
                  className="w-full mt-6 py-4 text-white rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity shadow-md"
                  style={{ backgroundColor: "#1A5276" }}
                  onClick={() => navigate("/aluno/planos")}
                >
                  Ver Todos os Planos
                </button>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mt-4">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    size={24}
                    className="text-blue-600 flex-shrink-0 mt-1"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-blue-900 mb-2">
                      Informação
                    </h4>
                    <p className="text-base text-blue-800">
                      Para alterar seu plano, acesse a página Meus Planos
                      através do botão acima ou pelo menu lateral.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "faturas" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Fatura Atual
              </h2>

              {/* Card da Fatura Atual */}
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#406882" }}
                    >
                      <FileText className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                        {currentInvoice.month}
                      </h3>
                      <p
                        className="text-xl sm:text-2xl font-bold mt-1"
                        style={{ color: "#406882" }}
                      >
                        {currentInvoice.amount}
                      </p>
                    </div>
                  </div>

                  <span
                    className={
                      "px-3 py-2 rounded-lg text-sm font-semibold border-2 flex items-center gap-2 w-fit " +
                      statusConfig[currentInvoice.status].className
                    }
                  >
                    <span className="text-lg leading-none">
                      {statusConfig[currentInvoice.status].icon}
                    </span>
                    {statusConfig[currentInvoice.status].label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">
                      Emissão
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-gray-800">
                      {currentInvoice.issueDate}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">
                      Vencimento
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-gray-800">
                      {currentInvoice.dueDate}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-semibold text-sm sm:text-base hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "#1A5276" }}
                  >
                    <Eye className="h-5 w-5" />
                    Visualizar
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-white border-2 font-semibold text-sm sm:text-base hover:bg-gray-50 transition-colors"
                    style={{ borderColor: "#406882", color: "#406882" }}
                  >
                    <Download className="h-5 w-5" />
                    Baixar
                  </button>
                </div>
              </div>

              {/* Botão Ver Todas as Faturas */}
              <button
                onClick={() => navigate("/aluno/faturas")}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-white border-2 font-semibold text-lg hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
                style={{ borderColor: "#406882", color: "#406882" }}
              >
                <Receipt className="h-6 w-6" />
                Ver Todas as Faturas
                <ArrowRight className="h-5 w-5" />
              </button>

              {/* Informação adicional */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    size={24}
                    className="text-blue-600 flex-shrink-0 mt-1"
                  />
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">
                      Histórico Completo
                    </h4>
                    <p className="text-sm sm:text-base text-blue-800">
                      Acesse todas as suas faturas anteriores, visualize
                      detalhes e faça download dos documentos através da página
                      completa de faturas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardEstudante;
