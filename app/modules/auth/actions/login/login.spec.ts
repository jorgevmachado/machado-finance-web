import type { ActionState } from '@/app/shared/actions';

const mockRedirect = jest.fn();
const mockReadLoginPayload = jest.fn();
const mockValidateLoginPayload = jest.fn();
const mockMapLoginError = jest.fn();
const mockLogin = jest.fn();
const mockSetAuthCookie = jest.fn();

jest.mock('next/navigation', () => ({
  redirect: (...args: Array<unknown>) => mockRedirect(...args),
}));

jest.mock('./validation', () => ({
  readLoginPayload: (...args: Array<unknown>) => mockReadLoginPayload(...args),
  validateLoginPayload: (...args: Array<unknown>) =>
    mockValidateLoginPayload(...args),
  mapLoginError: (...args: Array<unknown>) => mockMapLoginError(...args),
}));

jest.mock('../../service', () => ({
  authService: () => ({
    login: (...args: Array<unknown>) => mockLogin(...args),
  }),
}));

jest.mock('../../server/session', () => ({
  setAuthCookie: (...args: Array<unknown>) => mockSetAuthCookie(...args),
}));

import { loginAction } from './login';

describe('loginAction', () => {
  const initialState: ActionState = {
    type: 'other',
    status: 'idle',
    message: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns validation error without calling service', async () => {
    const validationError: ActionState = {
      type: 'other',
      status: 'error',
      message: 'invalid',
    };

    mockReadLoginPayload.mockReturnValue({
      credential: 'user',
      password: 'weak',
    });
    mockValidateLoginPayload.mockReturnValue(validationError);

    const result = await loginAction(initialState, new FormData());

    expect(result).toEqual(validationError);
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockSetAuthCookie).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('logs in, stores cookie and redirects on success', async () => {
    mockReadLoginPayload.mockReturnValue({
      credential: 'user@example.com',
      password: 'Secure@123',
    });
    mockValidateLoginPayload.mockReturnValue(null);
    mockLogin.mockResolvedValue('jwt-token');

    await loginAction(initialState, new FormData());

    expect(mockLogin).toHaveBeenCalledWith({
      credential: 'user@example.com',
      password: 'Secure@123',
    });
    expect(mockSetAuthCookie).toHaveBeenCalledWith('jwt-token');
    expect(mockRedirect).toHaveBeenCalledWith('/home');
  });

  it('maps and returns service errors', async () => {
    const mappedError: ActionState = {
      type: 'other',
      status: 'error',
      message: 'login failed',
    };
    const thrownError = new Error('boom');

    mockReadLoginPayload.mockReturnValue({
      credential: 'user@example.com',
      password: 'Secure@123',
    });
    mockValidateLoginPayload.mockReturnValue(null);
    mockLogin.mockRejectedValue(thrownError);
    mockMapLoginError.mockReturnValue(mappedError);

    const result = await loginAction(initialState, new FormData());

    expect(mockMapLoginError).toHaveBeenCalledWith(thrownError);
    expect(result).toEqual(mappedError);
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
