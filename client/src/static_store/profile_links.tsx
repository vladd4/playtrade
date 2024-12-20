import { PackageSearch, ShoppingBag, WalletCards } from 'lucide-react';

export const profile_links = [
  {
    label: 'Гаманець',
    href: '/profile/wallet',
    icon: <WalletCards color="#fff" />,
  },
  {
    label: 'Покупки',
    href: '/profile/purchases',
    icon: <ShoppingBag color="#fff" />,
  },
  {
    label: 'Мої товари',
    href: '/profile/products',
    icon: <PackageSearch color="#fff" />,
  },
];
