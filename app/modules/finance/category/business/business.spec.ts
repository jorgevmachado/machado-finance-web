import type { ActionState } from '@/app/modules/actions';

import { CategoryBusiness } from './business';

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
    const categories = [
      { id: '1', name: 'Food', type: 'FOOD', description: 'x' },
      { id: '2', name: 'Other', type: 'OTHER', description: 'y' },
    ] as const;

    expect(business.getOriginalCategory([...categories], { id: '2' })).toEqual(
      categories[1],
    );
  });

  it('returns undefined when original category is not found', () => {
    const categories = [{ id: '1', name: 'Food', type: 'FOOD' }] as const;

    expect(
      business.getOriginalCategory(
        [...categories] as unknown as Array<{
          id: string;
          name: string;
          type: string;
          description: string;
        }>,
        { id: '999' },
      ),
    ).toBeUndefined();
  });

  it('initializes draft category from existing category', () => {
    expect(
      business.initDraftCategory({
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
    expect(business.initDraftCategory()).toEqual({
      name: '',
      type: '',
      description: '',
    });
  });
});
