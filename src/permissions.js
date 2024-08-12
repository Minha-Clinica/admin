export const menuItems = [
   {
      text: 'Usuários',
      icon: '/icons/user_mult.png',
      to: '/users/list',
      permissions: ['administrador'],
   },
   {
      text: 'Empresas',
      icon: '/icons/settings.png',
      to: '/organization/list',
      permissions: ['administrador'],
   },
   {
      text: 'Agenda',
      icon: '/icons/agenda.png',
      to: '/calendar',
      permissions: ['profissional', 'administrador'],
   },
   {
      text: 'Sessões',
      icon: '/icons/email.png',
      to: '/consultation',
      permissions: ['profissional', 'administrador', 'paciente'],
   },
   {
      text: 'Meus Pacientes',
      icon: '/icons/app.png',
      to: '/patients',
      permissions: ['profissional', 'administrador'],
   },
   {
      text: 'Ajuda',
      icon: '/icons/help.png',
      to: '/tasks/list',
      permissions: ['profissional', 'administrador', 'paciente'],
   },
];