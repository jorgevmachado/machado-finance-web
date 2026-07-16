import {
  getStringValue,
  INITIAL_ACTION_STATE,
  mapError,
  toErrorState,
  UNAUTHORIZED_ERROR_MESSAGE,
} from './state';

describe('modules/actions state helpers', () => {
  it('exports the expected initial action state', () => {
    expect(INITIAL_ACTION_STATE).toEqual({
      type: 'other',
      status: 'idle',
      message: '',
    });
  });

  it('exports unauthorized message as i18n key', () => {
    expect(UNAUTHORIZED_ERROR_MESSAGE).toBe('i18n:auth.errors.accessDenied');
  });

  it('gets and trims string value from form data', () => {
    const formData = new FormData();
    formData.set('credential', '  user@example.com  ');

    expect(getStringValue(formData, 'credential')).toBe('user@example.com');
  });

  it('returns empty string when value is not a string', () => {
    const formData = new FormData();
    formData.set('file', new File(['x'], 'x.txt'));

    expect(getStringValue(formData, 'file')).toBe('');
  });

  it('creates error state with default type', () => {
    expect(toErrorState('failed')).toEqual({
      type: 'other',
      status: 'error',
      message: 'failed',
    });
  });

  it('creates error state with custom type', () => {
    expect(toErrorState('failed', 'create')).toEqual({
      type: 'create',
      status: 'error',
      message: 'failed',
    });
  });

  it('maps response error message when present', () => {
    expect(
      mapError(
        {
          message: 'custom response error',
          statusCode: 400,
          error: 'bad request',
        },
        'fallback message',
      ),
    ).toEqual(toErrorState('custom response error'));
  });

  it('maps unknown error to default message', () => {
    expect(mapError(undefined, 'fallback message')).toEqual(
      toErrorState('fallback message'),
    );
  });
});
