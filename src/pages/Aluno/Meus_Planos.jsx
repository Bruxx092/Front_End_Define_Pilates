import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";

const Meus_Planos = () => {
  return (
    <div className="flex min-h-screen">
      <SidebarUnificada
        menuItems={sidebarConfigs.aluno.menuItems}
        userInfo={sidebarConfigs.aluno.userInfo}
      />

      <main className="flex-1 ml-[280px] md:ml-[72px] transition-all duration-300 p-6 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6">Meus Planos</h1>
      </main>
    </div>
  );
};

export default Meus_Planos;
