import type { IconType } from 'react-icons';

import { EUserRole } from '@/app/modules';

export type IMenuItem = {
  label: string;
  roles: Array<EUserRole>;
  href: string;
  icon: IconType;
  children?: Array<IMenuItem>;
}