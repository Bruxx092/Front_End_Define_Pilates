// @ts-nocheck
import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import { useState } from "react";
import { Card } from "@/components/ui/Planos/card";
import { ButtonPlanos } from "@/components/ui/Planos/buttonPlanos";
import { CheckCircle2, FileText, Download, Eye, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Planos/dialog";
import { useSidebar } from "@/context/SidebarContext";

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

function PlanCard(props) {
  const { name, price, frequency, benefits } = props;
  return (
    <Card className="p-4 sm:p-6 shadow-md border-2 border-blue-200 bg-white">
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-500 mb-1">Plano Atual</p>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{name}</h2>
        <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-2">
          {price}
        </p>
        <p className="text-sm font-medium text-green-600 mt-1">{frequency}</p>
      </div>

      <div className="space-y-3 mt-4 sm:mt-6">
        <p className="text-sm font-semibold text-gray-900 mb-3">
          Benefícios inclusos:
        </p>
        {benefits.map(function (benefit, index) {
          return (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-900 leading-relaxed">
                {benefit}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function PlanOptionCard(props) {
  const { name, price, period, frequency, benefits, isCurrentPlan, onSelect } =
    props;
  return (
    <Card
      className={
        "p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col " +
        (isCurrentPlan ? "border-2 border-blue-400 bg-blue-50" : "")
      }
    >
      {isCurrentPlan && (
        <div className="mb-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs sm:text-sm font-semibold">
            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
            Plano Atual
          </span>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
          {name}
        </h3>
        <p className="text-2xl sm:text-3xl font-bold text-blue-600">{price}</p>
        <p className="text-sm font-medium text-green-600">{frequency}</p>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">{period}</p>
      </div>

      <div className="space-y-2 sm:space-y-2.5 mb-4 sm:mb-6 flex-grow">
        {benefits.map(function (benefit, index) {
          return (
            <div key={index} className="flex items-start gap-2 sm:gap-2.5">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm text-gray-900 leading-relaxed">
                {benefit}
              </span>
            </div>
          );
        })}
      </div>

      <ButtonPlanos
        onClick={onSelect}
        size="lg"
        className={
          "w-full text-sm sm:text-base font-semibold " +
          (isCurrentPlan
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white")
        }
        disabled={isCurrentPlan}
      >
        {isCurrentPlan ? "Plano Ativo" : "Solicitar este plano"}
      </ButtonPlanos>
    </Card>
  );
}

function InvoiceCard(props) {
  const { month, amount, status } = props;
  const config = statusConfig[status];

  return (
    <Card className="p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              {month}
            </h3>
            <p className="text-lg sm:text-xl font-bold text-blue-600 mt-1">
              {amount}
            </p>
          </div>
        </div>

        <span
          className={
            "px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold border-2 flex items-center gap-1 w-fit " +
            config.className
          }
        >
          <span className="text-sm sm:text-lg leading-none">{config.icon}</span>
          {config.label}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2">
        <Dialog>
          <DialogTrigger asChild>
            <ButtonPlanos
              className="flex-1 text-sm sm:text-base font-medium bg-[#1A5276] text-white hover:bg-[#154360] border-[#1A5276]"
              size="lg"
            >
              <Eye className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Visualizar
            </ButtonPlanos>
          </DialogTrigger>
          <DialogContent
            className="max-w-[95vw] sm:max-w-4xl h-[80vh]"
            aria-describedby={undefined}
          >
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">
                Fatura de {month}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 w-full h-full">
              <div className="w-full h-full rounded-lg bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500 text-sm sm:text-base">
                  Visualização da fatura de {month}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <ButtonPlanos
          variant="outline"
          className="flex-1 text-sm sm:text-base font-medium"
          size="lg"
        >
          <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Baixar
        </ButtonPlanos>
      </div>
    </Card>
  );
}

function ChangePlanDialog(props) {
  const { open, onOpenChange, onConfirm, selectedPlan } = props;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-md md:max-w-lg rounded-xl p-4 sm:p-6">
        <DialogHeader className="space-y-2 sm:space-y-3">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
            Solicitar mudança de plano
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {selectedPlan
              ? "Deseja solicitar a troca para o " +
                selectedPlan +
                "? Nossa equipe entrará em contato para confirmar a alteração em até 2 dias úteis."
              : "Sua solicitação será enviada para nossa equipe. Entraremos em contato em até 2 dias úteis para apresentar as opções disponíveis e concluir a alteração."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:gap-3 mt-4 sm:mt-6">
          <ButtonPlanos
            onClick={onConfirm}
            size="lg"
            className="w-full text-sm sm:text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Enviar solicitação
          </ButtonPlanos>
          <ButtonPlanos
            onClick={function () {
              onOpenChange(false);
            }}
            variant="outline"
            size="lg"
            className="w-full text-sm sm:text-base font-medium"
          >
            Cancelar
          </ButtonPlanos>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const Meus_Planos = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlanName, setSelectedPlanName] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const { isMobile, sidebarWidth } = useSidebar();

  const currentPlan = {
    name: "Plano Mensal - 3x semana",
    price: "R$ 89,90/mês",
    frequency: "3 vezes por semana",
    benefits: [
      "Aulas de Pilates 3x na semana",
      "Acesso livre aos equipamentos",
      "Avaliação física mensal",
      "Acompanhamento personalizado",
    ],
  };

  const availablePlans = [
    {
      id: "mensal-1x",
      name: "Plano Mensal - 1x semana",
      price: "R$ 49,90",
      frequency: "1 vez por semana",
      period: "por mês",
      benefits: [
        "Aulas de Pilates 1x na semana",
        "Acesso aos equipamentos",
        "Avaliação física mensal",
      ],
    },
    {
      id: "mensal-2x",
      name: "Plano Mensal - 2x semana",
      price: "R$ 69,90",
      frequency: "2 vezes por semana",
      period: "por mês",
      benefits: [
        "Aulas de Pilates 2x na semana",
        "Acesso livre aos equipamentos",
        "Avaliação física mensal",
        "Acompanhamento personalizado",
      ],
    },
    {
      id: "mensal-3x",
      name: "Plano Mensal - 3x semana",
      price: "R$ 89,90",
      frequency: "3 vezes por semana",
      period: "por mês",
      benefits: [
        "Aulas de Pilates 3x na semana",
        "Acesso livre aos equipamentos",
        "Avaliação física mensal",
        "Acompanhamento personalizado",
      ],
    },
    {
      id: "trimestral-1x",
      name: "Plano Trimestral - 1x semana",
      price: "R$ 129,90",
      frequency: "1 vez por semana",
      period: "a cada 3 meses",
      benefits: [
        "Aulas de Pilates 1x na semana",
        "Acesso aos equipamentos",
        "Avaliação física mensal",
        "5% de desconto",
      ],
    },
    {
      id: "trimestral-2x",
      name: "Plano Trimestral - 2x semana",
      price: "R$ 189,90",
      frequency: "2 vezes por semana",
      period: "a cada 3 meses",
      benefits: [
        "Aulas de Pilates 2x na semana",
        "Acesso livre aos equipamentos",
        "Avaliação física mensal",
        "Acompanhamento personalizado",
        "5% de desconto",
      ],
    },
    {
      id: "trimestral-3x",
      name: "Plano Trimestral - 3x semana",
      price: "R$ 249,90",
      frequency: "3 vezes por semana",
      period: "a cada 3 meses",
      benefits: [
        "Aulas de Pilates 3x na semana",
        "Acesso livre aos equipamentos",
        "Avaliação física mensal",
        "Acompanhamento personalizado",
        "5% de desconto",
        "1 aula particular inclusa",
      ],
    },
    {
      id: "semestral-1x",
      name: "Plano Semestral - 1x semana",
      price: "R$ 239,90",
      frequency: "1 vez por semana",
      period: "a cada 6 meses",
      benefits: [
        "Aulas de Pilates 1x na semana",
        "Acesso aos equipamentos",
        "Avaliação física mensal",
        "10% de desconto",
      ],
    },
    {
      id: "semestral-2x",
      name: "Plano Semestral - 2x semana",
      price: "R$ 349,90",
      frequency: "2 vezes por semana",
      period: "a cada 6 meses",
      benefits: [
        "Aulas de Pilates 2x na semana",
        "Acesso livre aos equipamentos",
        "Avaliação física mensal",
        "Acompanhamento personalizado",
        "10% de desconto",
        "1 aula particular inclusa",
      ],
    },
    {
      id: "semestral-3x",
      name: "Plano Semestral - 3x semana",
      price: "R$ 459,90",
      frequency: "3 vezes por semana",
      period: "a cada 6 meses",
      benefits: [
        "Aulas de Pilates 3x na semana",
        "Acesso livre aos equipamentos",
        "Avaliação física mensal",
        "Acompanhamento personalizado",
        "10% de desconto",
        "2 aulas particulares inclusas",
      ],
    },
    {
      id: "anual-1x",
      name: "Plano Anual - 1x semana",
      price: "R$ 449,90",
      frequency: "1 vez por semana",
      period: "por ano",
      benefits: [
        "Aulas de Pilates 1x na semana",
        "Acesso aos equipamentos",
        "Avaliação física mensal",
        "15% de desconto",
      ],
    },
    {
      id: "anual-2x",
      name: "Plano Anual - 2x semana",
      price: "R$ 649,90",
      frequency: "2 vezes por semana",
      period: "por ano",
      benefits: [
        "Aulas de Pilates 2x na semana",
        "Acesso livre aos equipamentos",
        "Avaliação física mensal",
        "Acompanhamento personalizado",
        "15% de desconto",
        "2 aulas particulares inclusas",
      ],
    },
    {
      id: "anual-3x",
      name: "Plano Anual - 3x semana",
      price: "R$ 849,90",
      frequency: "3 vezes por semana",
      period: "por ano",
      benefits: [
        "Aulas de Pilates 3x na semana",
        "Acesso livre aos equipamentos",
        "Avaliação física mensal",
        "Acompanhamento personalizado",
        "15% de desconto",
        "4 aulas particulares inclusas",
        "Prioridade na reserva de horários",
      ],
    },
  ];

  const invoices = [
    { month: "Outubro 2025", amount: "R$ 89,90", status: "paid" },
    { month: "Setembro 2025", amount: "R$ 89,90", status: "paid" },
    { month: "Agosto 2025", amount: "R$ 89,90", status: "pending" },
  ];

  function handlePlanSelect(planName) {
    setSelectedPlanName(planName);
    setDialogOpen(true);
  }

  function handleChangePlanRequest() {
    setDialogOpen(false);
    setToastVisible(true);
    setTimeout(function () {
      setToastVisible(false);
    }, 4000);
    setSelectedPlanName("");
  }

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
        <main className="flex-1 px-3 sm:px-4 lg:px-6 pt-20 sm:pt-6 lg:py-8 pb-6 sm:pb-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-6 xl:gap-8 max-w-7xl mx-auto">
            <div className="space-y-6 sm:space-y-8">
              <section className="space-y-3 sm:space-y-4">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Plano Atual
                </h2>
                <PlanCard
                  name={currentPlan.name}
                  price={currentPlan.price}
                  frequency={currentPlan.frequency}
                  benefits={currentPlan.benefits}
                />
              </section>

              <section className="space-y-3 sm:space-y-4">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Solicitar mudança de plano
                </h2>
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {availablePlans.map(function (plan) {
                    return (
                      <PlanOptionCard
                        key={plan.id}
                        name={plan.name}
                        price={plan.price}
                        period={plan.period}
                        frequency={plan.frequency}
                        benefits={plan.benefits}
                        isCurrentPlan={plan.name === currentPlan.name}
                        onSelect={function () {
                          handlePlanSelect(plan.name);
                        }}
                      />
                    );
                  })}
                </div>
              </section>
            </div>

            <section className="space-y-4 mt-6 sm:mt-8 lg:mt-0">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Minhas Faturas
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {invoices.map(function (invoice, index) {
                  return (
                    <InvoiceCard
                      key={index}
                      month={invoice.month}
                      amount={invoice.amount}
                      status={invoice.status}
                    />
                  );
                })}
              </div>
            </section>
          </div>
        </main>

        <ChangePlanDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onConfirm={handleChangePlanRequest}
          selectedPlan={selectedPlanName}
        />

        {toastVisible && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom-5 max-w-[90vw] sm:max-w-md">
            <p className="font-semibold text-sm sm:text-base">
              Solicitação enviada com sucesso!
            </p>
            <p className="text-xs sm:text-sm text-green-100 mt-1">
              Nossa equipe confirmará em breve.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Meus_Planos;
