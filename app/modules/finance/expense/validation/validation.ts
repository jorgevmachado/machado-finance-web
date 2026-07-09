import { ActionState ,toErrorState } from '@/app/modules/actions';

import type { TExpenseCreate ,TExpenseUpdate } from '../types';
import {
  EXPENSE_INVALID_DESCRIPTION_MESSAGE,
  EXPENSE_INVALID_PAYEE_MESSAGE ,
  EXPENSE_INVALID_ALLOCATION_MESSAGE ,
  EXPENSE_INVALID_CATEGORY_MESSAGE
} from './messages';

export const validateCreatePayload = ({
  payee ,
  category_id,
  allocation_id ,
  description ,
}: TExpenseCreate): ActionState | null => {
  if (!payee || payee.length < 3 || payee.length > 40) {
    return toErrorState(EXPENSE_INVALID_PAYEE_MESSAGE);
  }

  if (!category_id) {
    return toErrorState(EXPENSE_INVALID_CATEGORY_MESSAGE);
  }

  if (!allocation_id) {
    return toErrorState(EXPENSE_INVALID_ALLOCATION_MESSAGE);
  }

  if (!description || description.length < 3 || description.length > 200) {
    return toErrorState(EXPENSE_INVALID_DESCRIPTION_MESSAGE);
  }

  return null;
};

export const validateUpdatePayload = ({
  payee ,
  description
}: TExpenseUpdate): ActionState | null => {
  if (payee && (payee.length < 3 || payee.length > 40)) {
    return toErrorState(EXPENSE_INVALID_PAYEE_MESSAGE);
  }

  if (description && (description.length < 3 || description.length > 200)) {
    return toErrorState(EXPENSE_INVALID_DESCRIPTION_MESSAGE);
  }

  return null;
};