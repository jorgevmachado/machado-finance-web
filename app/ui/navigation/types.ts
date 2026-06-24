import type { IconType } from 'react-icons';

import { RoleEnum } from '@/app/shared';

export type IMenuItem = {
  label: string;
  roles: Array<RoleEnum>;
  href: string;
  icon: IconType;
  children?: Array<IMenuItem>;
}