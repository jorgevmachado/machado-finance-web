import { buildInputFilterValueMap, createInitialState, INITIAL_PAGINATION } from './business';

describe('paginated-list business', () => {
  it('creates initial state with loading true and empty items', () => {
    const state = createInitialState<{ id: string }>();

    expect(state).toEqual({
      items: [],
      meta: INITIAL_PAGINATION,
      isLoading: true,
      errorMessage: undefined,
    });
  });

  it('builds filter value map by filter name', () => {
    const map = buildInputFilterValueMap([
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        value: 'Jorge',
        placeholder: 'Name',
      },
      {
        name: 'status',
        label: 'Status',
        type: 'autocomplete',
        value: 'ACTIVE',
        placeholder: 'Status',
        options: [
          { key: 'active', value: 'ACTIVE', label: 'Active' },
        ],
      },
    ]);

    expect(map).toEqual({
      name: 'Jorge',
      status: 'ACTIVE',
    });
  });
});
