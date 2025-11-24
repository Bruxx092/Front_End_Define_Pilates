// @ts-nocheck
import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Planos/card";
import { ButtonPlanos } from "@/components/ui/Planos/buttonPlanos";
import { CheckCircle2, Send, Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Planos/dialog";
import { useSidebar } from "@/context/SidebarContext";
import { planosService } from "@/services/planosService";

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

function ChangePlanDialog(props) {
  const { open, onOpenChange, onConfirm, selectedPlan, isLoading } = props;
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
            className="w-full text-sm sm:text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Enviar solicitação
              </>
            )}
          </ButtonPlanos>
          <ButtonPlanos
            onClick={function () {
              onOpenChange(false);
            }}
            variant="outline"
            size="lg"
            className="w-full text-sm sm:text-base font-medium"
            disabled={isLoading}
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
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [selectedPlanName, setSelectedPlanName] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [currentPlan, setCurrentPlan] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const { isMobile, sidebarWidth } = useSidebar();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const [current, available] = await Promise.all([
        planosService.getCurrentPlan(),
        planosService.getAvailablePlans(),
      ]);
      setCurrentPlan(current);
      setAvailablePlans(available || []);
    } catch (error) {
      console.error("Erro ao carregar planos:", error);
      setToastMessage("Erro ao carregar planos");
      setToastVisible(true);
    } finally {
      setLoading(false);
    }
  };

  function handlePlanSelect(planId, planName) {
    setSelectedPlanId(planId);
    setSelectedPlanName(planName);
    setDialogOpen(true);
  }

  async function handleChangePlanRequest() {
    setRequestLoading(true);
    try {
      await planosService.requestPlanChange(selectedPlanId);
      setDialogOpen(false);
      setToastMessage("Solicitação enviada com sucesso!");
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
      }, 4000);
      setSelectedPlanId("");
      setSelectedPlanName("");
    } catch (error) {
      console.error("Erro ao solicitar mudança de plano:", error);
      setToastMessage("Erro ao enviar solicitação. Tente novamente.");
      setToastVisible(true);
    } finally {
      setRequestLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SidebarUnificada
          menuItems={sidebarConfigs.aluno.menuItems}
          userInfo={sidebarConfigs.aluno.userInfo}
          isOpen={menuOpen}
          onOpenChange={setMenuOpen}
        />
        <div className="flex-1 flex items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
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
          <div className="max-w-7xl mx-auto">
            <div className="space-y-6 sm:space-y-8">
              {currentPlan && (
                <section className="space-y-3 sm:space-y-4">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    Plano Atual
                  </h2>
                  <PlanCard
                    name={currentPlan.name}
                    price={`R$ ${currentPlan.price}`}
                    frequency={currentPlan.frequency}
                    benefits={currentPlan.benefits || []}
                  />
                </section>
              )}

              <section className="space-y-3 sm:space-y-4">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Solicitar mudança de plano
                </h2>
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {availablePlans.map(function (plan) {
                    return (
                      <PlanOptionCard
                        key={plan.id}
                        name={plan.name}
                        price={`R$ ${plan.price}`}
                        period={plan.period}
                        frequency={plan.frequency}
                        benefits={plan.benefits || []}
                        isCurrentPlan={
                          currentPlan && plan.id === currentPlan.id
                        }
                        onSelect={function () {
                          handlePlanSelect(plan.id, plan.name);
                        }}
                      />
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        </main>

        <ChangePlanDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onConfirm={handleChangePlanRequest}
          selectedPlan={selectedPlanName}
          isLoading={requestLoading}
        />

        {toastVisible && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom-5 max-w-[90vw] sm:max-w-md">
            <p className="font-semibold text-sm sm:text-base">{toastMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Meus_Planos;
