// @ts-nocheck

import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  Bell,
  FileText,
  TrendingUp,
  CheckSquare,
  Image,
  LogOut,
} from "lucide-react";

const getCurrentUserInfo = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return {
    name: user.name || "Usuário",
    email: user.email || "usuario@example.com",
    role: user.role || "aluno",
    id: user.id || null,
  };
};

export const sidebarConfigs = {
  administrador: {
    userInfo: getCurrentUserInfo(),
    menuItems: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "/admin/dashboard",
        subItems: null,
      },
      {
        title: "Estudantes",
        icon: Users,
        path: "/admin/estudantes",
        subItems: null,
      },
      {
        title: "Colaboradores",
        icon: Briefcase,
        path: "/admin/colaboradores",
        subItems: null,
      },
      {
        title: "Agenda de Estúdios",
        icon: Calendar,
        path: "/admin/agenda",
        subItems: null,
      },
      {
        title: "Financeiro",
        icon: DollarSign,
        path: "/admin/financas",
        subItems: null,
      },
      {
        title: "Relatórios",
        icon: BarChart3,
        path: "/admin/relatorios",
        subItems: null,
      },
      {
        title: "Alertas",
        icon: Bell,
        path: "/admin/alertas",
        subItems: null,
      },
      {
        title: "Configurações",
        icon: Settings,
        path: "/admin/configuracoes",
        subItems: null,
      },
    ],
  },

  recepcionista: {
    userInfo: getCurrentUserInfo(),
    menuItems: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "/recepcionista/dashboard",
        subItems: null,
      },
      {
        title: "Agendamentos",
        icon: Calendar,
        path: "/recepcionista/agendamentos",
        subItems: null,
      },
      {
        title: "Estudantes",
        icon: Users,
        path: "/recepcionista/estudantes",
        subItems: null,
      },
      {
        title: "Faturas",
        icon: FileText,
        path: "/recepcionista/faturas",
        subItems: null,
      },
      {
        title: "Alertas",
        icon: Bell,
        path: "/recepcionista/alertas",
        subItems: null,
      },
    ],
  },

  instrutor: {
    userInfo: getCurrentUserInfo(),
    menuItems: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "/instrutor/dashboard",
        subItems: null,
      },
      {
        title: "Minhas Aulas",
        icon: Calendar,
        path: "/instrutor/aulas",
        subItems: null,
      },
      {
        title: "Meus Estudantes",
        icon: Users,
        path: "/instrutor/estudantes",
        subItems: null,
      },
      {
        title: "Presença",
        icon: CheckSquare,
        path: "/instrutor/presenca",
        subItems: null,
      },
      {
        title: "Ficha Técnica",
        icon: FileText,
        path: "/instrutor/ficha-tecnica",
        subItems: null,
      },
      {
        title: "Evolução",
        icon: TrendingUp,
        path: "/instrutor/evolucao",
        subItems: null,
      },
    ],
  },

  aluno: {
    userInfo: getCurrentUserInfo(),
    menuItems: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "/aluno/dashboard",
        subItems: null,
      },
      {
        title: "Minhas Aulas",
        icon: Calendar,
        path: "/aluno/minhas-aulas",
        subItems: null,
      },
      {
        title: "Minha Evolução",
        icon: TrendingUp,
        path: "/aluno/minha-evolucao",
        subItems: [
          {
            title: "Histórico de Aulas",
            path: "/aluno/minha-evolucao/historico-aulas",
          },
          {
            title: "Fotos",
            path: "/aluno/minha-evolucao/fotos",
          },
          {
            title: "Atestados",
            path: "/aluno/minha-evolucao/atestados",
          },
        ],
      },
      {
        title: "Meus Planos",
        icon: Briefcase,
        path: "/aluno/planos",
        subItems: null,
      },
      {
        title: "Minhas Faturas",
        icon: FileText,
        path: "/aluno/faturas",
        subItems: null,
      },
    ],
  },

  colaborador: {
    userInfo: getCurrentUserInfo(),
    menuItems: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "/colaborador/dashboard",
        subItems: null,
      },
      {
        title: "Perfil",
        icon: Users,
        path: "/colaborador/perfil",
        subItems: null,
      },
      {
        title: "Documentos",
        icon: FileText,
        path: "/colaborador/documentos",
        subItems: null,
      },
    ],
  },
};

export const useSidebarConfig = (role) => {
  return sidebarConfigs[role] || sidebarConfigs.aluno;
};

export const updateUserInSidebarConfig = (newUserData) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const updatedUser = { ...user, ...newUserData };
  localStorage.setItem("user", JSON.stringify(updatedUser));
};
