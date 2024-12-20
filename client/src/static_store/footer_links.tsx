import { Mail, SquareMenu, UserRound } from 'lucide-react';

export const footer_links = [
  {
    label: 'Каталог',
    href: '/',
    icon: <SquareMenu size={32} />,
  },
  {
    label: 'Повідомлення',
    href: '/messages',
    icon: <Mail size={32} />,
  },
  {
    label: 'Мій кабінет',
    href: '/profile',
    icon: <UserRound size={32} />,
  },
];
