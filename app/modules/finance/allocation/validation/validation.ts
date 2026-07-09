import { ActionState ,toErrorState } from '@/app/modules/actions';

import type { TAllocationCreate ,TAllocationUpdate } from '../types';
import {
  ALLOCATION_INVALID_DESCRIPTION_MESSAGE,
  ALLOCATION_INVALID_NAME_MESSAGE ,
  ALLOCATION_INVALID_ACCOUNT_MESSAGE ,
} from './messages';

export const validateCreatePayload = ({
  name ,
  account_id ,
  description ,
}: TAllocationCreate): ActionState | null => {
  if (!name || name.length < 3 || name.length > 40) {
    return toErrorState(ALLOCATION_INVALID_NAME_MESSAGE);
  }

  if (!account_id) {
    return toErrorState(ALLOCATION_INVALID_ACCOUNT_MESSAGE);
  }

  if (!description || description.length < 3 || description.length > 200) {
    return toErrorState(ALLOCATION_INVALID_DESCRIPTION_MESSAGE);
  }

  return null;
};

export const validateUpdatePayload = ({
  name ,
  description
}: TAllocationUpdate): ActionState | null => {
  if (name && (name.length < 3 || name.length > 40)) {
    return toErrorState(ALLOCATION_INVALID_NAME_MESSAGE);
  }

  if (description && (description.length < 3 || description.length > 200)) {
    return toErrorState(ALLOCATION_INVALID_DESCRIPTION_MESSAGE);
  }

  return null;
};