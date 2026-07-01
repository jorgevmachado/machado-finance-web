import { ActionState ,toErrorState } from '@/app/modules/actions';
import { TCategoryCreate ,TCategoryUpdate } from '@/app/modules/finance';
import {
  CATEGORY_INVALID_DESCRIPTION_MESSAGE ,
  CATEGORY_INVALID_NAME_MESSAGE ,
  CATEGORY_INVALID_TYPE_MESSAGE ,
} from './messages';

export const validateCreatePayload = ({
  name ,
  type ,
  description ,
}: TCategoryCreate): ActionState | null => {
  if (!name || name.length < 3 || name.length > 40) {
    return toErrorState(CATEGORY_INVALID_NAME_MESSAGE);
  }

  if (!type) {
    return toErrorState(CATEGORY_INVALID_TYPE_MESSAGE);
  }

  if (!description || description.length < 3 || description.length > 200) {
    return toErrorState(CATEGORY_INVALID_DESCRIPTION_MESSAGE);
  }

  return null;
};

export const validateUpdatePayload = ({
  name ,
  description ,
}: TCategoryUpdate): ActionState | null => {
  if (name && (name.length < 3 || name.length > 40)) {
    return toErrorState(CATEGORY_INVALID_NAME_MESSAGE);
  }

  if (description && (description.length < 3 || description.length > 200)) {
    return toErrorState(CATEGORY_INVALID_DESCRIPTION_MESSAGE);
  }
  return null;
};