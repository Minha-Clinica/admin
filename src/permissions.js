export const menuItems = [
   {
      text: 'Usuários',
      icon: 'https://mf-planejados.s3.amazonaws.com/icon_adm_dark.svg',
      to: '/users/list',
      permissions: ['Terapeuta', 'Admin', 'Paciente'],
   },
   {
      text: 'Empresa',
      icon: '/icons/enterprise.png',
      to: '/organization/list',
      permissions: ['Terapeuta', 'Admin', 'Paciente'],
   },
   {
      text: 'Agenda',
      icon: '/icons/agenda_icon.png',
      to: '/calendar',
      permissions: ['Terapeuta', 'Admin', 'Paciente'],
   },
   {
      text: 'Buscar Terapeuta',
      icon: '/icons/localized_icon.png',
      to: '/searchProfissional',
      permissions: ['Terapeuta', 'Admin', 'Paciente'],
   },
   {
      text: 'Consultas',
      icon: 'https://minhaclinicatrindade.s3.amazonaws.com/video_conferencia.png',
      to: '/consultation',
      permissions: ['Terapeuta', 'Admin', 'Paciente'],
   },
   {
      text: 'Pagamentos',
      icon: 'https://mf-planejados.s3.amazonaws.com/Icon_financeiro.svg',
      to: '/',
      permissions: ['Terapeuta', 'Admin', 'Paciente'],
   },
   {
      text: 'Contratos',
      icon: '/icons/contract_icon.png',
      to: '/',
      permissions: ['Terapeuta', 'Admin', 'Paciente'],
   },
   {
      text: 'Planos',
      icon: '/icons/plan_payment.png',
      to: '/assignmentPlan',
      permissions: ['Terapeuta', 'Admin', 'Paciente'],
   },
   {
      text: 'Ajuda',
      icon: 'https://mf-planejados.s3.amazonaws.com/Icon_mkt.svg',
      to: '/tasks/list',
      permissions: ['Terapeuta', 'Admin', 'Paciente'],
   },
];