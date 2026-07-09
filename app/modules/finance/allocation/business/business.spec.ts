import type { ActionState } from '@/app/modules/actions';

import { AllocationBusiness } from './business';

import type { TAllocation } from '../types';

describe('CategoryBusiness', () => {
  const business = new AllocationBusiness();

  it('exposes initial filters', () => {
    expect(business.INITIAL_FILTERS).toEqual({
      name: undefined,
      is_active: undefined,
      account_id: undefined,
      reference_year: undefined,
    });
  });

  it('exposes initial input filters', () => {
    expect(business.INITIAL_INPUT_FILTERS).toHaveLength(2);
    expect(business.INITIAL_INPUT_FILTERS[0].name).toBe('name');
    expect(business.INITIAL_INPUT_FILTERS[1].name).toBe('reference_year');
  });

  it('normalizes filters', () => {
    expect(
      business.normalizeFilters({
        name: '  groceries  ',
        is_active: false,
      }),
    ).toEqual({
      name: 'groceries',
      is_active: false,
      account_id: undefined,
      reference_year: undefined,
    });
  });

  it('returns undefined values when filters are empty', () => {
    expect(
      business.normalizeFilters({
        name: '   ',
      }),
    ).toEqual({
      name: undefined,
      is_active: undefined,
      account_id: undefined,
      reference_year: undefined,
    });
  });

  it('builds response message from action state', () => {
    const actionState: ActionState = {
      status: 'success',
      type: 'create',
      message: 'ok',
    };

    expect(business.getResponseMessage(actionState)).toBe(
      'allocation.success.create',
    );
  });

  it('finds original category by row item id', () => {

    const allocations: Array<TAllocation> = [
      {
        id: '1' ,
        name: 'Food' ,
        expenses: [],
        name_code: 'food' ,
        is_active: true,
        created_at: new Date() ,
        account_id: 'account_id' ,
        description: 'x' ,
      },
      {
        id: '2' ,
        name: 'Other' ,
        expenses: [],
        name_code: 'other' ,
        is_active: true,
        created_at: new Date() ,
        account_id: 'account_id' ,
        description: 'y' ,
      },
    ];

    expect(business.getOriginal([...allocations], { id: '2' })).toEqual(
      allocations[1],
    );
  });

  it('returns undefined when original category is not found', () => {
    const allocations: Array<TAllocation> = [{
      id: '1' ,
      name: 'Food' ,
      expenses: [],
      name_code: 'food' ,
      is_active: true,
      created_at: new Date() ,
      account_id: 'account_id' ,
      description: 'x' ,
    }] as const;

    expect(
      business.getOriginal(
        [...allocations],
        { id: '999' },
      ),
    ).toBeUndefined();
  });

  it('initializes draft category from existing category', () => {
    expect(
      business.initDraft({
        id: '1',
        name: 'Food',
        account_id: 'account_id',
        description: 'desc',
      } as never),
    ).toEqual({
      name: 'Food',
      account_id: 'account_id',
      description: 'desc',
    });
  });

  it('initializes empty draft category when category is missing', () => {
    expect(business.initDraft()).toEqual({
      name: '',
      account_id: '',
      description: '',
    });
  });
});
