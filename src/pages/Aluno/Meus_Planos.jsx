// @ts-nocheck
import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Planos/card";
import { ButtonPlanos } from "@/components/ui/Planos/buttonPlanos";
import { CheckCircle2, Send } from "lucide-react";
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

// --- Componentes Auxiliares ---

function PlanCard({ name, price, frequency, benefits }) {
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
        {benefits && benefits.map((benefit, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm sm:text-base text-gray-900 leading-relaxed">
              {benefit}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function PlanOptionCard({ name, price, period, frequency, benefits, isCurrentPlan, onSelect }) {
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
        {benefits && benefits.map((benefit, index) => (
          <div key={index} className="flex items-start gap-2 sm:gap-2.5">
            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-xs sm:text-sm text-gray-900 leading-relaxed">
              {benefit}
            </span>
          </div>
        ))}
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

function ChangePlanDialog({ open, onOpenChange, onConfirm, selectedPlan, isLoading }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-md md:max-w-lg rounded-xl p-4 sm:p-6">
        <DialogHeader className="space-y-2 sm:space-y-3">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
            Solicitar mudança de plano
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {selectedPlan
              ? `Deseja solicitar a troca para o ${selectedPlan.name}? Nossa equipe entrará em contato para confirmar a alteração em até 2 dias úteis.`
              : "Sua solicitação será enviada para nossa equipe."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:gap-3 mt-4 sm:mt-6">
          <ButtonPlanos
            onClick={onConfirm}
            size="lg"
            disabled={isLoading}
            className="w-full text-sm sm:text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            {isLoading ? "Enviando..." : "Enviar solicitação"}
          </ButtonPlanos>
          <ButtonPlanos
            onClick={() => onOpenChange(false)}
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

// --- Componente Principal ---

const Meus_Planos = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  
  const [isLoadingCurrentPlan, setIsLoadingCurrentPlan] = useState(true);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", desc: "", type: "success" });

  const { isMobile, sidebarWidth } = useSidebar();

  const showToast = (title, desc, type) => {
    // Garante que desc seja sempre uma string para evitar erro de objeto no React
    const safeDesc = typeof desc === 'string' ? desc : JSON.stringify(desc);
    
    setToastMessage({ title, desc: safeDesc, type });
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 4000);
  };

  useEffect(() => {
    const loadData = async () => {
        setIsLoadingCurrentPlan(true);
        setIsLoadingPlans(true);

        try {
            const activePlan = await planosService.getCurrentPlan();
            setCurrentPlan(activePlan);

            const plansData = await planosService.getAvailablePlans();
            const plansMapped = plansData.map(p => ({
                id: p.id_plano || p.id,
                name: p.descricao_plano || p.nome || p.titulo,
                price: `R$ ${p.valor_plano}`,
                frequency: p.modalidade_plano || "Frequência a definir",
                period: p.tipo_plano === 'padrao' ? 'por mês' : 'período definido',
                benefits: [
                    `Aulas: ${p.qtde_aulas_totais || '?'}`,
                    "Acesso aos equipamentos"
                ]
            }));
            setAvailablePlans(plansMapped);

        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            showToast("Erro", "Falha ao carregar informações dos planos.", "error");
        } finally {
            setIsLoadingCurrentPlan(false);
            setIsLoadingPlans(false);
        }
    };

    loadData();
  }, []);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setDialogOpen(true);
  };

  const handleChangePlanRequest = async () => {
    if (!selectedPlan) return;

    setIsSubmitting(true);

    const payload = {
        menssagem: `Quero trocar para o plano ${selectedPlan.name}`,
        tipo_de_solicitacao: "plano",
        acao_solicitacao_plano: "MUDANCA_PLANO",
        acao_solicitacao_aula: null,
        fk_id_aula_referencia: null,
        data_sugerida: null,
        fk_id_novo_plano: selectedPlan.id,
        fk_id_novo_plano_personalizado: null,
    };

    try {
        await planosService.requestPlanChange(payload);
        
        showToast("Solicitação enviada com sucesso!", "Nossa equipe confirmará em breve.", "success");
        setDialogOpen(false);
        setSelectedPlan(null);

    } catch (error) {
        console.error("Erro na solicitação:", error);
        
        // Tratamento seguro da mensagem de erro
        let errorMsg = "Erro desconhecido";
        
        if (error.response?.data?.detail) {
            const detail = error.response.data.detail;
            // Se detail for array (comum no FastAPI), formata ele
            if (Array.isArray(detail)) {
                errorMsg = detail.map(e => e.msg).join(', ');
            } else {
                errorMsg = String(detail);
            }
        } else if (error.message) {
            errorMsg = error.message;
        }

        showToast("Erro na Solicitação", errorMsg, "error");
        setDialogOpen(false); 
    } finally {
        setIsSubmitting(false);
    }
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
        style={{
          marginLeft: !isMobile ? `${sidebarWidth}px` : "0",
          width: !isMobile ? `calc(100% - ${sidebarWidth}px)` : "100%",
        }}
      >
        <main className="flex-1 px-3 sm:px-4 lg:px-6 pt-20 sm:pt-6 lg:py-8 pb-6 sm:pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-6 sm:space-y-8">
              
              <section className="space-y-3 sm:space-y-4">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Plano Atual
                </h2>
                
                {isLoadingCurrentPlan ? (
                    <div className="p-6 bg-white rounded-lg shadow border border-gray-200 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                    </div>
                ) : currentPlan ? (
                    <PlanCard
                      name={currentPlan.name}
                      price={currentPlan.price}
                      frequency={currentPlan.frequency}
                      benefits={currentPlan.benefits}
                    />
                ) : (
                    <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200 text-yellow-800">
                        Você ainda não possui um plano ativo. Escolha um abaixo para começar!
                    </div>
                )}
              </section>

              <section className="space-y-3 sm:space-y-4">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Solicitar mudança de plano
                </h2>
                
                {isLoadingPlans ? (
                    <div className="text-center py-8 text-gray-500">Carregando planos disponíveis...</div>
                ) : (
                    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {availablePlans.map((plan) => (
                        <PlanOptionCard
                        key={plan.id}
                        name={plan.name}
                        price={plan.price}
                        period={plan.period}
                        frequency={plan.frequency}
                        benefits={plan.benefits}
                        isCurrentPlan={currentPlan && currentPlan.name === plan.name}
                        onSelect={() => handlePlanSelect(plan)}
                        />
                    ))}
                    </div>
                )}
              </section>
            </div>
          </div>
        </main>

        <ChangePlanDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onConfirm={handleChangePlanRequest}
          selectedPlan={selectedPlan}
          isLoading={isSubmitting}
        />

        {toastVisible && (
          <div className={`fixed bottom-4 right-4 px-4 py-3 sm:px-6 sm:py-4 rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom-5 max-w-[90vw] sm:max-w-md text-white ${toastMessage.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
            <p className="font-semibold text-sm sm:text-base">
              {toastMessage.title}
            </p>
            <p className="text-xs sm:text-sm text-green-100 mt-1">
              {toastMessage.desc}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Meus_Planos;