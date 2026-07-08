import type { ActionState } from '@/app/modules/actions';

import { CategoryBusiness } from './business';

import type { TCategory } from '../types';
import { ECategoryType } from '../enum';

describe('CategoryBusiness', () => {
  const business = new CategoryBusiness();

  it('exposes initial filters', () => {
    expect(business.INITIAL_FILTERS).toEqual({
      name: undefined,
      type: undefined,
    });
  });

  it('exposes initial input filters', () => {
    expect(business.INITIAL_INPUT_FILTERS).toHaveLength(2);
    expect(business.INITIAL_INPUT_FILTERS[0].name).toBe('name');
    expect(business.INITIAL_INPUT_FILTERS[1].name).toBe('type');
  });

  it('normalizes filters', () => {
    expect(
      business.normalizeFilters({
        name: '  groceries  ',
        type: 'FOOD',
      }),
    ).toEqual({
      name: 'groceries',
      type: 'FOOD',
    });
  });

  it('returns undefined values when filters are empty', () => {
    expect(
      business.normalizeFilters({
        name: '   ',
        type: undefined,
      }),
    ).toEqual({
      name: undefined,
      type: undefined,
    });
  });

  it('builds response message from action state', () => {
    const actionState: ActionState = {
      status: 'success',
      type: 'create',
      message: 'ok',
    };

    expect(business.getResponseMessage(actionState)).toBe(
      'category.success.create',
    );
  });

  it('finds original category by row item id', () => {

    const categories: Array<TCategory> = [
      {
        id: '1' ,
        name: 'Food' ,
        type: ECategoryType.FOOD,
        name_code: 'food' ,
        created_at: new Date() ,
        finance_id: 'finance_id' ,
        description: 'x' ,
      },
      {
        id: '2' ,
        name: 'Other' ,
        type: ECategoryType.OTHER,
        name_code: 'other' ,
        created_at: new Date() ,
        finance_id: 'finance_id' ,
        description: 'y' ,
      },
    ];

    expect(business.getOriginal([...categories], { id: '2' })).toEqual(
      categories[1],
    );
  });

  it('returns undefined when original category is not found', () => {
    const categories: Array<TCategory> = [{
      id: '1',
      name: 'Food',
      type: ECategoryType.FOOD,
      name_code: 'food' ,
      created_at: new Date() ,
      finance_id: 'finance_id' ,
      description: 'x' ,
    }] as const;

    expect(
      business.getOriginal(
        [...categories],
        { id: '999' },
      ),
    ).toBeUndefined();
  });

  it('initializes draft category from existing category', () => {
    expect(
      business.initDraft({
        id: '1',
        name: 'Food',
        type: 'FOOD',
        description: 'desc',
      } as never),
    ).toEqual({
      name: 'Food',
      type: 'FOOD',
      description: 'desc',
    });
  });

  it('initializes empty draft category when category is missing', () => {
    expect(business.initDraft()).toEqual({
      name: '',
      type: '',
      description: '',
    });
  });
});
