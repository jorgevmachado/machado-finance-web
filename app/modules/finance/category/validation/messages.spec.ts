import {
  CATEGORY_DEFAULT_CREATE_ERROR_MESSAGE,
  CATEGORY_DEFAULT_UPDATE_ERROR_MESSAGE,
  CATEGORY_INVALID_DESCRIPTION_MESSAGE,
  CATEGORY_INVALID_NAME_MESSAGE,
  CATEGORY_INVALID_TYPE_MESSAGE,
} from './messages';

describe('category validation messages', () => {
  it('exports expected i18n keys', () => {
    expect(CATEGORY_INVALID_NAME_MESSAGE).toBe('i18n:category.errors.invalidName');
    expect(CATEGORY_INVALID_TYPE_MESSAGE).toBe('i18n:category.errors.invalidType');
    expect(CATEGORY_INVALID_DESCRIPTION_MESSAGE).toBe(
      'i18n:category.errors.invalidDescription',
    );
    expect(CATEGORY_DEFAULT_CREATE_ERROR_MESSAGE).toBe(
      'i18n:category.errors.defaultCreate',
    );
    expect(CATEGORY_DEFAULT_UPDATE_ERROR_MESSAGE).toBe(
      'i18n:category.errors.defaultUpdate',
    );
  });
});
