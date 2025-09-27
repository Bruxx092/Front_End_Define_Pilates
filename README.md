<pre> src/
├── assets/             # Imagens, ícones, fontes, etc.
├── components/         # Componentes React reutilizáveis (botões, cards, modais, etc.)
│   ├── common/         # Componentes genéricos
│   ├── forms/          # Componentes relacionados a formulários
│   └── layout/         # Componentes de layout (Header, Sidebar, Footer)
├── contexts/           # Contextos React para gerenciamento de estado global (AuthContext, ThemeContext)
├── hooks/              # Custom Hooks React para lógica reutilizável
├── pages/              # Páginas principais da aplicação 
│   ├── Auth/           # Páginas de autenticação (Login, Register, ForgotPassword)
│   ├── Dashboard/      # Dashboard geral e específico por perfil
│   │   ├── AdminDashboard.jsx
│   │   ├── InstructorDashboard.jsx
│   │   ├── ReceptionistDashboard.jsx
│   │   └── StudentDashboard.jsx
│   ├── Students/       # Gestão de alunos (List, Detail, Form)
│   ├── Instructors/    # Gestão de instrutores
│   ├── Studios/        # Gestão de estúdios e agendas
│   ├── Payments/       # Gestão de pagamentos e finanças
│   └── Settings/       # Configurações gerais
├── services/           # Serviços API e integrações
├── styles/             # Arquivos CSS globais e configurações do Tailwind
│   └── index.css
├── utils/              # Funções utilitárias (formatadores de data, validadores)
├── App.jsx             # Componente principal da aplicação
├── main.jsx            # Ponto de entrada da aplicação
├── routes.jsx          # Definição das rotas da aplicação
</pre>
