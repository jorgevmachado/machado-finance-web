import {
  COMMON_INVALID_DESCRIPTION_MESSAGE,
  COMMON_INVALID_NAME_MESSAGE,
} from './messages';

describe('validator messages', () => {
  it('exports shared validator i18n keys', () => {
    expect(COMMON_INVALID_NAME_MESSAGE).toBe('common.messages.error.name');
    expect(COMMON_INVALID_DESCRIPTION_MESSAGE).toBe('common.messages.error.description');
  });
});
