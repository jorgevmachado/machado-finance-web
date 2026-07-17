import { ActionState  } from '../actions';
import type { IValidator } from './types';

export abstract class Validator<T, TDraft, TCreate, TUpdate> implements IValidator<T, TDraft, TCreate, TUpdate> {
  abstract transformCreate(draft: TDraft): TCreate
  abstract transformUpdate(draft: TDraft): TUpdate
  abstract validateCreate(draft: TDraft): ActionState | null
  abstract validateUpdate(draft: TDraft): ActionState | null
  abstract hasEntityChanged(original: T, draft: TDraft): boolean
  
  public isValidName(name?: string, type: ActionState['type'] = 'create'): boolean {
    if (type === 'create') {
      return !(!name || name.length < 3 || name.length > 40);
    }
    
    if (name && type === 'update') {
      return !(name.length < 3 || name.length > 40);
    }

    return true;
  }
  
  public isValidDescription(description?: string, type: ActionState['type'] = 'create'): boolean {
    if (type === 'create') {
      return !(!description || description.length < 3 || description.length > 200);
    }

    if (description && type === 'update') {
      return !(description.length < 3 || description.length > 200);
    }

    return true;

  }

}