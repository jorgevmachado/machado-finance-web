import { ActionState ,toErrorState } from '@/app/modules/actions';

import type { TAccountCreate ,TAccountUpdate } from '../types';
import {
  ACCOUNT_INVALID_INITIAL_BALANCE_MESSAGE ,
  ACCOUNT_INVALID_NAME_MESSAGE ,
  ACCOUNT_INVALID_TYPE_MESSAGE ,
} from './messages';

export const validateCreatePayload = ({
  name ,
  type ,
  initial_balance ,
}: TAccountCreate): ActionState | null => {
  if (!name || name.length < 3 || name.length > 40) {
    return toErrorState(ACCOUNT_INVALID_NAME_MESSAGE);
  }

  if (!type) {
    return toErrorState(ACCOUNT_INVALID_TYPE_MESSAGE);
  }

  if (initial_balance && (initial_balance < 0 || initial_balance > 1000000)) {
    return toErrorState(ACCOUNT_INVALID_INITIAL_BALANCE_MESSAGE);
  }

  return null;
};

export const validateUpdatePayload = ({
  name ,
  initial_balance ,
}: TAccountUpdate): ActionState | null => {
  if (name && (name.length < 3 || name.length > 40)) {
    return toErrorState(ACCOUNT_INVALID_NAME_MESSAGE);
  }

  if (initial_balance && (initial_balance < 0 || initial_balance > 1000000)) {
    return toErrorState(ACCOUNT_INVALID_INITIAL_BALANCE_MESSAGE);
  }

  return null;
};