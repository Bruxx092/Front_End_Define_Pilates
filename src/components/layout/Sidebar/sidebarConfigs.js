// @ts-nocheck
import {
  Briefcase,
  GraduationCap,
  Calendar,
  LayoutDashboard,
  DollarSign,
  CreditCard,
  Phone,
  CheckSquare,
  FileText,
  LineChart,
  Users,
  Receipt,
  TrendingUp,
} from "lucide-react";

export const sidebarConfigs = {
  administrador: {
    menuItems: [
      {
        title: "Colaboradores",
        icon: Briefcase,
        path: "/administrador/colaboradores",
      },
      {
        title: "Estudantes",
        icon: GraduationCap,
        path: "/administrador/estudantes",
      },
      {
        title: "Agenda dos Estúdios",
        icon: Calendar,
        path: "/administrador/agenda",
      },
      {
        title: "Painel Geral dos Alunos",
        icon: LayoutDashboard,
        path: "/administrador/painel-alunos",
      },
      {
        title: "Finanças",
        icon: DollarSign,
        path: "/administrador/financas",
      },
    ],
    userInfo: {
      name: "Administrador",
      email: "administrador@email.com",
    },
  },

  admmaster: {
    menuItems: [
      {
        title: "Colaboradores",
        icon: Briefcase,
        path: "/admmaster/colaboradores",
      },
      {
        title: "Estudantes",
        icon: GraduationCap,
        path: "/admmaster/estudantes",
      },
      {
        title: "Agenda dos Estúdios",
        icon: Calendar,
        path: "/admmaster/agenda",
      },
      {
        title: "Painel Geral dos Alunos",
        icon: LayoutDashboard,
        path: "/admmaster/painel-alunos",
      },
      {
        title: "Finanças",
        icon: DollarSign,
        path: "/admmaster/financas",
      },
      {
        title: "Planos & Pagamentos",
        icon: CreditCard,
        path: "/admmaster/planos-pagamentos",
      },
      {
        title: "Contatos / Reagendamentos",
        icon: Phone,
        path: "/admmaster/contatos-reagendamentos",
      },
      {
        title: "Registro de Faltas / Presenças",
        icon: CheckSquare,
        path: "/admmaster/registro-faltas",
      },
      {
        title: "Fichas de Evolução",
        icon: FileText,
        path: "/admmaster/fichas-evolucao",
      },
    ],
    userInfo: {
      name: "Administrador Master",
      email: "admmaster@email.com",
    },
  },

  aluno: {
    menuItems: [
      {
        title: "Dashboard",
        icon: TrendingUp, 
        path: "/aluno/dashboard",
      },
      {
        title: "Minhas Aulas",
        icon: Calendar,
        path: "/aluno/minhas-aulas",
      },
      {
        title: "Minha Evolução",
        icon: LineChart,
        path: "/aluno/minha-evolucao",
      },
      {
        title: "Meus Planos",
        icon: CreditCard,
        path: "/aluno/planos",
      },
      {
        title: "Minhas Faturas",
        icon: Receipt,
        path: "/aluno/faturas",
      },
    ],
    userInfo: {
      name: "Aluno",
      email: "aluno@gmail.com",
    },
  },

  instrutor: {
    menuItems: [
      {
        title: "Minha Agenda",
        icon: Calendar,
        path: "/instrutor/agenda",
      },
      {
        title: "Meus Alunos",
        icon: Users,
        path: "/instrutor/alunos",
      },
      {
        title: "Registro de Faltas / Presenças",
        icon: CheckSquare,
        path: "/instrutor/registro",
      },
      {
        title: "Fichas de Evolução",
        icon: FileText,
        path: "/instrutor/Evolucao-Aluno",
      },
    ],
    userInfo: {
      name: "Instrutor",
      email: "instrutor@email.com",
    },
  },

  recepcionista: {
    menuItems: [
      {
        title: "Estudantes",
        icon: Users,
        path: "/recepcionista/estudantes",
      },
      {
        title: "Agenda dos Estúdios",
        icon: Calendar,
        path: "/recepcionista/agenda",
      },
      {
        title: "Planos & Pagamentos",
        icon: CreditCard,
        path: "/recepcionista/planos-pagamentos",
      },
      {
        title: "Contatos / Reagendamentos",
        icon: Phone,
        path: "/recepcionista/contatos-reagendamentos",
      },
    ],
    userInfo: {
      name: "Recepcionista",
      email: "recepcionista@email.com",
    },
  },
};

export default sidebarConfigs;
