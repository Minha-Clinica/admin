export const menuItems = [
   {
      text: 'Usuários',
      icon: 'https://mf-planejados.s3.amazonaws.com/icon_adm_dark.svg',
      to: '/users/list',
      permissions: ['administrador'],
   },
   {
      text: 'Empresas',
      icon: '/icons/enterprise.png',
      to: '/organization/list',
      permissions: ['administrador'],
   },
   {
      text: 'Agenda',
      icon: '/icons/agenda_icon.png',
      to: '/calendar',
      permissions: ['profissional', 'administrador'],
   },
   {
      text: 'Sessões',
      icon: 'https://minhaclinicatrindade.s3.amazonaws.com/video_conferencia.png',
      to: '/consultation',
      permissions: ['profissional', 'administrador', 'paciente'],
   },
   {
      text: 'Meus Pacientes',
      icon: '/icons/user-2.png',
      to: '/patients',
      permissions: ['profissional', 'administrador'],
   },
   // {
   //    text: 'Pagamentos',
   //    icon: 'https://mf-planejados.s3.amazonaws.com/Icon_financeiro.svg',
   //    to: '/',
   //    permissions: ['profissional', 'administrador', 'paciente'],
   // },
   // {
   //    text: 'Contratos',
   //    icon: '/icons/contract_icon.png',
   //    to: '/',
   //    permissions: ['profissional', 'administrador', 'paciente'],
   // },
   {
      text: 'Planos',
      icon: '/icons/plan_payment.png',
      to: '/assignmentPlan',
      permissions: ['profissional', 'administrador'],
   },
   {
      text: 'Ajuda',
      icon: 'https://mf-planejados.s3.amazonaws.com/Icon_mkt.svg',
      to: '/tasks/list',
      permissions: ['profissional', 'administrador', 'paciente'],
   },
];