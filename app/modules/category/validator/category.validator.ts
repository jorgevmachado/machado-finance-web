import {
  ActionState ,
  COMMON_INVALID_DESCRIPTION_MESSAGE ,
  COMMON_INVALID_NAME_MESSAGE ,
  toErrorState ,
  Validator ,
} from '@/app/shared';

import type {
  TCategory ,
  TCategoryCreate ,
  TCategoryDraft ,
  TCategoryUpdate,
} from '../types';
import { isObjectEmpty } from '@/app/utils';

export class CategoryValidator extends Validator<TCategory, TCategoryDraft ,TCategoryCreate ,TCategoryUpdate> {
  validateCreate({ name ,description }: TCategoryDraft): ActionState | null {
    if (!this.isValidName(name ,'create')) {
      return toErrorState(COMMON_INVALID_NAME_MESSAGE, 'create');
    }

    if (!this.isValidDescription(description ,'create')) {
      return toErrorState(COMMON_INVALID_DESCRIPTION_MESSAGE, 'create');
    }

    return null;
  }

  validateUpdate({ name ,description }: TCategoryDraft): ActionState | null {
    if (!this.isValidName(name ,'update')) {
      return toErrorState(COMMON_INVALID_NAME_MESSAGE, 'update');
    }

    if (!this.isValidDescription(description ,'update')) {
      return toErrorState(COMMON_INVALID_DESCRIPTION_MESSAGE, 'update');
    }
    return null;
  }

  transformCreate({ name ,description }: TCategoryDraft): TCategoryCreate {
    return {
      name: name ?? '' ,
      description: description ?? '' ,
    };
  }

  transformUpdate({ name ,description }: TCategoryDraft): TCategoryUpdate {
    return {
      name ,
      description ,
    };
  }

  hasEntityChanged(original: TCategory, draft: TCategoryDraft): boolean {
    const payload: TCategoryUpdate = {};
    if (original.name !== draft.name) {
      payload.name = draft.name;
    }
    if (original.description !== draft.description) {
      payload.description = draft.description;
    }
    return !isObjectEmpty(payload);
  }
}