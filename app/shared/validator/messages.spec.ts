import {
  COMMON_INVALID_DESCRIPTION_MESSAGE,
  COMMON_INVALID_NAME_MESSAGE,
} from './messages';

describe('validator message', () => {
  it('exports shared validator i18n keys', () => {
    expect(COMMON_INVALID_NAME_MESSAGE).toBe('common.message.error.name');
    expect(COMMON_INVALID_DESCRIPTION_MESSAGE).toBe('common.message.error.description');
  });
});
