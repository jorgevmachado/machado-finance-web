import { MdAccountBalance ,MdCategory ,MdHome } from 'react-icons/md';
import { HiOutlineCurrencyDollar } from 'react-icons/hi';
import { IoMdPeople } from 'react-icons/io';
import { AiOutlineTransaction } from 'react-icons/ai';

import { TMenuItem } from '@/app/ui/navigation/types';

export const getAuthenticatedMenuItems = (translate: (key: string) => string): Array<TMenuItem> => [
  {
    label: translate('navigation.home'),
    roles: ['USER', 'ADMIN'],
    href: '/home',
    icon: MdHome,
  },
  {
    label: translate('navigation.category'),
    roles: ['USER', 'ADMIN'],
    href: '/category',
    icon: MdCategory,
  },
  {
    label: translate('navigation.transaction'),
    roles: ['USER', 'ADMIN'],
    href: '/transaction',
    icon: AiOutlineTransaction,
  },
  {
    label: translate('navigation.account'),
    roles: ['USER', 'ADMIN'],
    href: '/account',
    icon: MdAccountBalance
  },
  {
    label: translate('navigation.allocation'),
    roles: ['USER', 'ADMIN'],
    href: '/allocation',
    icon: HiOutlineCurrencyDollar,
    children: [
      {
        label: translate('navigation.contribution'),
        roles: ['USER', 'ADMIN'],
        href: '/allocation/contribution',
        icon: IoMdPeople,
      }
    ]
  },
];