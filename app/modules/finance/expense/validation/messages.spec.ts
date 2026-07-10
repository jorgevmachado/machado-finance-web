import {
  EXPENSE_DEFAULT_CREATE_ERROR_MESSAGE ,
  EXPENSE_DEFAULT_UPDATE_ERROR_MESSAGE ,
  EXPENSE_INVALID_PAYEE_MESSAGE ,
  EXPENSE_INVALID_DESCRIPTION_MESSAGE ,
  EXPENSE_INVALID_CATEGORY_MESSAGE ,
  EXPENSE_INVALID_ALLOCATION_MESSAGE ,
  EXPENSE_DEFAULT_UPLOAD_ERROR_MESSAGE ,
  EXPENSE_INVALID_BANK_MESSAGE ,
} from './messages';

describe('account validation messages', () => {
  it('exports expected i18n keys', () => {
    expect(EXPENSE_INVALID_BANK_MESSAGE).toBe('i18n:expense.errors.invalidBank');
    expect(EXPENSE_INVALID_PAYEE_MESSAGE).toBe('i18n:expense.errors.invalidPayee');
    expect(EXPENSE_INVALID_CATEGORY_MESSAGE).toBe('i18n:category.errors.invalidCategory');
    expect(EXPENSE_INVALID_ALLOCATION_MESSAGE).toBe('i18n:allocation.errors.invalidAllocation');
    expect(EXPENSE_INVALID_DESCRIPTION_MESSAGE).toBe(
      'i18n:expense.errors.invalidDescription',
    );
    expect(EXPENSE_DEFAULT_CREATE_ERROR_MESSAGE).toBe(
      'i18n:expense.errors.defaultCreate',
    );
    expect(EXPENSE_DEFAULT_UPDATE_ERROR_MESSAGE).toBe(
      'i18n:expense.errors.defaultUpdate',
    );
    expect(EXPENSE_DEFAULT_UPLOAD_ERROR_MESSAGE).toBe(
      'i18n:expense.errors.defaultUpload',
    );
  });
});
