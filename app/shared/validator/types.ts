import { ActionState } from '../actions';

export interface IValidator<T, TDraft, TCreate, TUpdate> {
  validateCreate(draft: TDraft): ActionState | null;
  validateUpdate(draft: TDraft): ActionState | null;
  transformCreate(draft: TDraft): TCreate;
  transformUpdate(draft: TDraft): TUpdate;
  hasEntityChanged(original: T, draft: TDraft): boolean
}