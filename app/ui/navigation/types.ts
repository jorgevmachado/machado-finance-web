import type { IconType } from 'react-icons';

import { EUserRole } from '@/app/modules/auth';

export type TMenuItem = {
  label: string;
  roles: Array<EUserRole>;
  href: string;
  icon: IconType;
  children?: Array<TMenuItem>;
}