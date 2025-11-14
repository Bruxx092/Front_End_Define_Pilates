// @ts-nocheck
import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import { useState } from "react";
import { Card } from "@/components/ui/Planos/card";
import { ButtonPlanos } from "@/components/ui/Planos/buttonPlanos";
import { FileText, Download, Eye, Filter } from "lucide-react";
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

const Faturas = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isMobile, sidebarWidth } = useSidebar();
  const [activeFilter, setActiveFilter] = useState("all"); // Add this state

  const invoices = [
    { month: "Outubro 2025", amount: "R$ 390,00", status: "paid" },
    { month: "Setembro 2025", amount: "R$ 390,00", status: "paid" },
    { month: "Agosto 2025", amount: "R$ 390,00", status: "pending" },
    { month: "Julho 2025", amount: "R$ 390,00", status: "paid" },
    { month: "Junho 2025", amount: "R$ 390,00", status: "paid" },
    { month: "Maio 2025", amount: "R$ 390,00", status: "overdue" },
  ];

  const filters = [
    { id: "all", label: "Todas" },
    { id: "paid", label: "Pagas" },
    { id: "pending", label: "Em aberto" },
    { id: "overdue", label: "Vencidas" },
  ];

  const filteredInvoices = invoices.filter(
    (invoice) => activeFilter === "all" || invoice.status === activeFilter
  );

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
          <div className="max-w-4xl mx-auto">
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    Minhas Faturas
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    Visualize e gerencie todas as suas faturas mensais.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeFilter === filter.id
                          ? "bg-[#1A5276] text-white"
                          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredInvoices.map((invoice, index) => (
                  <InvoiceCard
                    key={index}
                    month={invoice.month}
                    amount={invoice.amount}
                    status={invoice.status}
                  />
                ))}

                {filteredInvoices.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      Nenhuma fatura encontrada para o filtro selecionado.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Faturas;
