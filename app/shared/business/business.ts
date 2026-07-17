import { TEntity } from '@/app/shared';

import { ActionState } from '@/app/shared/actions';

import { type FiltersProps } from '@/app/ds';

export abstract class Business<TFilter, TEntityProps extends TEntity> {
  public i18nKey: string;

  public INITIAL_FILTERS: TFilter = {} as TFilter;

  public INITIAL_INPUT_FILTERS: FiltersProps['filters'] = [];

  protected constructor(
    i18nKey: string,
    filters?: TFilter,
    inputFilters?: FiltersProps['filters']
  ) {
    if (inputFilters) {
      this.INITIAL_INPUT_FILTERS = inputFilters;
    }
    if (filters) {
      this.INITIAL_FILTERS = filters;
    }
    this.i18nKey = i18nKey;
  }

  public getResponseMessage(actionState: ActionState) {
    return `${this.i18nKey}.messages.${actionState.status}.${actionState.type}`;
  }

  public getOriginal(items: Array<TEntityProps>, tableItem: unknown): TEntityProps | undefined {
    const itemId = (tableItem as TEntityProps)?.id;
    return items?.find((item) => item.id === itemId);
  }

}