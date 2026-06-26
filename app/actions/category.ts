'use server';

import {
  ActionState ,
  mapError ,
  toErrorState ,
  UNAUTHORIZED_ERROR_MESSAGE ,
} from '@/app/actions/state';
import { createI18nMessage } from '@/app/shared';
import {
  financeService ,TCategory ,
  TCategoryCreate ,
  ECategoryType ,
  TCategoryUpdate ,
} from '@/app/modules/finance';
import { getServerSession } from '@/app/modules/auth/session';
import { isObjectEmpty } from '@/app/utils';


const INVALID_NAME_MESSAGE = createI18nMessage('category.errors.invalidName');
const INVALID_TYPE_MESSAGE = createI18nMessage('category.errors.invalidType');
const INVALID_DESCRIPTION_MESSAGE = createI18nMessage('category.errors.invalidDescription');
const DEFAULT_CREATE_ERROR_MESSAGE = createI18nMessage('category.errors.defaultCreate');


const readCreatePayload = (formData: FormData): TCategoryCreate => {
  return {
    name: formData.get('name') as string,
    type: formData.get('type') as ECategoryType,
    description: formData.get('description') as string,
  };
};

const readUpdatePayload = (formData: FormData, category: TCategory): TCategoryUpdate => {
  const params: TCategoryUpdate = {};
  if (formData.has('name')){
    const name = formData.get('name') as string;
    if (name !== category.name) {
      params.name = name;
    }
  }
  if (formData.has('type')){
    const type = formData.get('type') as ECategoryType;
    if (type !== category.type) {
      params.type = type;
    }
  }
  if (formData.has('description')){
    const description = formData.get('description') as string;
    if (description !== category.description) {
      params.description = description;
    }
  }
  return params;
};



const validateCreatePayload = ({ name, type, description }: TCategoryCreate): ActionState | null => {
  if (!name || name.length < 3 || name.length > 40) {
    return toErrorState(INVALID_NAME_MESSAGE);
  }

  if (!type) {
    return toErrorState(INVALID_TYPE_MESSAGE);
  }
  
  if (!description || description.length < 3 || description.length > 200){
    return toErrorState(INVALID_DESCRIPTION_MESSAGE);
  }

  return null;
};

const validateUpdatePayload = ({ name, description }: TCategoryUpdate): ActionState | null => {
  if (name && (name.length < 3  || name.length > 40)) {
    return toErrorState(INVALID_NAME_MESSAGE);
  }

  if (description && (description.length < 3 || description.length > 200)){
    return toErrorState(INVALID_DESCRIPTION_MESSAGE);
  }
  return null;
};

export async function persistCategoryAction(actionState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return toErrorState(UNAUTHORIZED_ERROR_MESSAGE);
  }
  const category = actionState.item as TCategory;


  if (!category) {
    return await createCategory(session.token, formData);
  }


  return await updateCategory(session.token, category, formData);
}

async function createCategory(token: string, formData: FormData): Promise<ActionState> {
  const payload = readCreatePayload(formData);

  const validationError = validateCreatePayload(payload);

  if (validationError) {
    return validationError;
  }

  try {

    const service = financeService(token);
    await service.category.create(payload);
  } catch (error) {
    return mapError(error, DEFAULT_CREATE_ERROR_MESSAGE);
  }

  return {
    type: 'create',
    status: 'success',
    message: createI18nMessage('category.messages.created'),
  };
}

async function updateCategory(token: string, category: TCategory, formData: FormData): Promise<ActionState> {
  const payload = readUpdatePayload(formData, category);

  const emptyPayload = isObjectEmpty(payload);

  if (!emptyPayload) {
    const validationError = validateUpdatePayload(payload);

    if (validationError) {
      return validationError;
    }

    try {
      const service = financeService(token);
      await service.category.update(category.id, payload);
    } catch (error) {
      return mapError(error, DEFAULT_CREATE_ERROR_MESSAGE);
    }
  }

  return {
    type: 'update',
    status: 'success',
    message: createI18nMessage('category.messages.created'),
  };
}

