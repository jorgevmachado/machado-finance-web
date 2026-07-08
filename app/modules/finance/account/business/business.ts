import { ActionState } from '@/app/modules/actions/state';
import { FiltersProps } from '@/app/ds';


import { TAccountFilter, TAccount ,TDraftAccount } from '../types';
import { ACCOUNT_TYPES } from '@/app/modules/finance/account/constants';

export class AccountBusiness {
  public INITIAL_FILTERS: TAccountFilter = {
    name: undefined,
    type: undefined,
    is_active: undefined,
    clean_cache: true,
    reference_year: new Date().getFullYear(),
  };

  public INITIAL_INPUT_FILTERS: FiltersProps['filters'] = [
    {
      name: 'reference_year' ,
      label: 'filters.year' ,
      type: 'number' ,
      value: new Date().getFullYear() ,
      placeholder: 'Year' ,
    },
    {
      name: 'name' ,
      label: 'filters.name' ,
      type: 'text' ,
      value: '' ,
      placeholder: 'account.form.placeholder.name' ,
    } ,
    {
      name: 'type' ,
      label: 'filters.type' ,
      type: 'autocomplete' ,
      value: '' ,
      options: ACCOUNT_TYPES.map((type) => ({
        key: type,
        value: type,
        label: `account.types.${type}`
      })),
      placeholder: 'account.form.placeholder.type' ,
    } ,
    {
      name: 'is_active' ,
      label: 'filters.isActive' ,
      type: 'autocomplete' ,
      value: 'true' ,
      options: [
        { key: 'true', value: 'true', label: 'filters.isActive' },
        { key: 'false', value: 'false', label: 'filters.isInactive' },
      ],
      placeholder: 'form.activePlaceholder' ,
    }
  ];

  public normalizeFilters(filters?: TAccountFilter): TAccountFilter {
    return {
      name: filters?.name?.trim() || undefined,
      type: filters?.type || undefined,
      is_active: filters?.is_active || undefined,
      reference_year: filters?.reference_year || new Date().getFullYear(),
    };
  }

  public getResponseMessage(actionState: ActionState) {
    return `account.${actionState.status}.${actionState.type}`;
  }

  public getOriginalAccount(items: Array<TAccount>, tableItem: unknown): TAccount | undefined {
    const itemId = (tableItem as TAccount)?.id;
    return items?.find((item) => item.id === itemId);
  }

  public initDraftAccount(account?: TAccount): TDraftAccount {
    return {
      name: account?.name || '',
      type: account?.type || '',
      initial_balance: account?.initial_balance || '',
    };
  }

  public filterRelations(account: TAccount): TAccount {
    account.expenses = account?.expenses?.filter((expense) => !expense.parent_id);
    return account;
  }
} 