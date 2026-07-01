const mockGetBaseUrl = jest.fn();
const mockAuthServiceConstructor = jest.fn();

jest.mock('@/app/shared', () => ({
  getBaseUrl: (...args: Array<unknown>) => mockGetBaseUrl(...args),
}));

jest.mock('./service', () => ({
  AuthService: function AuthServiceMock(...args: Array<unknown>) {
    return mockAuthServiceConstructor(...args);
  },
}));

import { authService } from './index';

describe('authService factory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetBaseUrl.mockReturnValue('http://api.test');
    mockAuthServiceConstructor.mockImplementation(
      (baseUrl: string, token?: string) => ({
        baseUrl,
        token,
      }),
    );
  });

  it('creates AuthService without token', () => {
    const result = authService();

    expect(mockGetBaseUrl).toHaveBeenCalledTimes(1);
    expect(mockAuthServiceConstructor).toHaveBeenCalledWith(
      'http://api.test',
      undefined,
    );
    expect(result).toEqual({
      baseUrl: 'http://api.test',
      token: undefined,
    });
  });

  it('creates AuthService with token', () => {
    const result = authService('jwt-token');

    expect(mockAuthServiceConstructor).toHaveBeenCalledWith(
      'http://api.test',
      'jwt-token',
    );
    expect(result).toEqual({
      baseUrl: 'http://api.test',
      token: 'jwt-token',
    });
  });
});
