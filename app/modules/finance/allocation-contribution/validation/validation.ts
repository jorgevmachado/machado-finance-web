import { ActionState ,toErrorState } from '@/app/modules/actions';

import type { TAllocationContributionCreate ,TAllocationContributionUpdate } from '../types';
import {
  ALLOCATION_CONTRIBUTION_INVALID_DESCRIPTION_MESSAGE,
  ALLOCATION_CONTRIBUTION_INVALID_CONTRIBUTOR_NAME_MESSAGE ,
  ALLOCATION_CONTRIBUTION_INVALID_ALLOCATION_MESSAGE ,
} from './messages';

export const validateCreatePayload = ({
  allocation_id ,
  description ,
  contributor_name
}: TAllocationContributionCreate): ActionState | null => {
  if (!contributor_name || contributor_name.length < 3 || contributor_name.length > 40) {
    return toErrorState(ALLOCATION_CONTRIBUTION_INVALID_CONTRIBUTOR_NAME_MESSAGE);
  }

  if (!allocation_id) {
    return toErrorState(ALLOCATION_CONTRIBUTION_INVALID_ALLOCATION_MESSAGE);
  }

  if (!description || description.length < 3 || description.length > 200) {
    return toErrorState(ALLOCATION_CONTRIBUTION_INVALID_DESCRIPTION_MESSAGE);
  }

  return null;
};

export const validateUpdatePayload = ({
  description,
  contributor_name
}: TAllocationContributionUpdate): ActionState | null => {
  if (contributor_name && (contributor_name.length < 3 || contributor_name.length > 40)) {
    return toErrorState(ALLOCATION_CONTRIBUTION_INVALID_CONTRIBUTOR_NAME_MESSAGE);
  }

  if (description && (description.length < 3 || description.length > 200)) {
    return toErrorState(ALLOCATION_CONTRIBUTION_INVALID_DESCRIPTION_MESSAGE);
  }

  return null;
};