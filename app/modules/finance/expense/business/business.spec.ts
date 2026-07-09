import type { ActionState } from '@/app/modules/actions';

import type { TCategory } from '../../category';
import type { TAllocation } from '../../allocation';

import type { TExpense } from '../types';

import { ExpenseBusiness } from './business';

describe('ExpenseBusiness', () => {
  const business = new ExpenseBusiness();

  it('exposes initial filters', () => {
    expect(business.INITIAL_FILTERS).toEqual({
      payee: undefined,
      category_id: undefined,
      allocation_id: undefined,
      reference_year: undefined,
      reference_month: undefined,
    });
  });

  it('exposes initial input filters', () => {
    expect(business.INITIAL_INPUT_FILTERS).toHaveLength(2);
    expect(business.INITIAL_INPUT_FILTERS[0].name).toBe('payee');
    expect(business.INITIAL_INPUT_FILTERS[1].name).toBe('reference_year');
    expect(business.INITIAL_INPUT_FILTERS[1].name).toBe('reference_month');
  });

  it('normalizes filters', () => {
    expect(
      business.normalizeFilters({
        payee: '  groceries  ',
        category_id: 'category-id',
        allocation_id: 'category-id',
        reference_year: 2022,
        reference_month: 1,
      }),
    ).toEqual({
      payee: 'groceries',
      category_id: 'category-id',
      allocation_id: 'category-id',
      reference_year: 2022,
      reference_month: 1,
    });
  });

  it('returns undefined values when filters are empty', () => {
    expect(
      business.normalizeFilters({
        payee: '   ',
        category_id: undefined,
      }),
    ).toEqual({
      payee: undefined,
      category_id: undefined,
    });
  });

  it('builds response message from action state', () => {
    const actionState: ActionState = {
      status: 'success',
      type: 'create',
      message: 'ok',
    };

    expect(business.getResponseMessage(actionState)).toBe(
      'expense.success.create',
    );
  });

  it('finds original expense by row item id', () => {

    const category: TCategory = {
      id: 'category_id' ,
      name: 'category' ,
      name_code: 'category' ,
      finance_id: 'finance_id' ,
      created_at: new Date() ,
      description: '' ,
    };

    const allocation: TAllocation = {
      id: 'allocation_id' ,
      name: 'allocation' ,
      name_code: 'allocation' ,
      is_active: true ,
      expenses: [] ,
      account_id: 'account_id' ,
      created_at: new Date() ,
      description: 'Some Description' ,
    };

    const expenses: Array<TExpense> = [
      {
        id: '1' ,
        payee: 'Expense 1' ,
        months: [] ,
        category: category,
        allocation: allocation,
        description: 'x' ,
        created_at: new Date() ,
      },
      {
        id: '2' ,
        payee: 'Expense 2' ,
        months: [] ,
        category: category,
        allocation: allocation,
        description: 'y' ,
        created_at: new Date() ,
      },
    ];

    expect(business.getOriginal([...expenses], { id: '2' })).toEqual(
      expenses[1],
    );
  });

  it('returns undefined when original expense is not found', () => {

    const category: TCategory = {
      id: 'category_id' ,
      name: 'category' ,
      name_code: 'category' ,
      finance_id: 'finance_id' ,
      created_at: new Date() ,
      description: '' ,
    };

    const allocation: TAllocation = {
      id: 'allocation_id' ,
      name: 'allocation' ,
      name_code: 'allocation' ,
      is_active: true ,
      expenses: [] ,
      account_id: 'account_id' ,
      created_at: new Date() ,
      description: 'Some Description' ,
    };

    const expenses: Array<TExpense> = [{
      id: '1' ,
      payee: 'Expense 1' ,
      months: [] ,
      category: category,
      allocation: allocation,
      description: 'x' ,
      created_at: new Date() ,
    }] as const;

    expect(
      business.getOriginal(
        [...expenses],
        { id: '999' },
      ),
    ).toBeUndefined();
  });

  it('initializes draft expense from existing category', () => {
    expect(
      business.initDraft(2026,{
        id: '1',
        payee: 'Expense 1',
      } as never),
    ).toEqual({
      payee: 'Expense 1',
      category_id: '',
      description: '',
      allocation_id: '',
      reference_year: 2026,
    });
  });

  it('initializes empty draft category when expense is missing', () => {
    expect(business.initDraft(2026)).toEqual({
      payee: '',
      category_id: '',
      description: '',
      allocation_id: '',
      reference_year: 2026,
    });
  });
});
