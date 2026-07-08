import { ActionState ,toErrorState } from '@/app/modules/actions';

import type { TIncomeCreate ,TIncomeUpdate } from '../types';
import {
  INCOME_INVALID_DESCRIPTION_MESSAGE,
  INCOME_INVALID_SOURCE_MESSAGE ,
  INCOME_INVALID_ACCOUNT_MESSAGE ,
} from './messages';

export const validateCreatePayload = ({
  source ,
  account_id ,
  description ,
}: TIncomeCreate): ActionState | null => {
  if (!source || source.length < 3 || source.length > 40) {
    return toErrorState(INCOME_INVALID_SOURCE_MESSAGE);
  }

  if (!account_id) {
    return toErrorState(INCOME_INVALID_ACCOUNT_MESSAGE);
  }

  if (!description || description.length < 3 || description.length > 200) {
    return toErrorState(INCOME_INVALID_DESCRIPTION_MESSAGE);
  }

  return null;
};

export const validateUpdatePayload = ({
  source ,
  description
}: TIncomeUpdate): ActionState | null => {
  if (source && (source.length < 3 || source.length > 40)) {
    return toErrorState(INCOME_INVALID_SOURCE_MESSAGE);
  }

  if (description && (description.length < 3 || description.length > 200)) {
    return toErrorState(INCOME_INVALID_DESCRIPTION_MESSAGE);
  }

  return null;
};