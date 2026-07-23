const mockMe = jest.fn();
const mockClearAuthCookie = jest.fn();
const mockGetAuthTokenExpiration = jest.fn();

jest.mock('../../api/service', () => ({
  authService: () => ({
    me: (...args: Array<unknown>) => mockMe(...args),
  }),
}));

jest.mock('../session', () => ({
  clearAuthCookie: (...args: Array<unknown>) => mockClearAuthCookie(...args),
}));

jest.mock('../../token', () => ({
  getAuthTokenExpiration: (...args: Array<unknown>) =>
    mockGetAuthTokenExpiration(...args),
}));

import {
  getAuthenticatedUser,
  getAuthenticatedUserBootstrap,
} from './service';

describe('server auth service helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAuthenticatedUser', () => {
    it('returns undefined when token is missing', async () => {
      await expect(getAuthenticatedUser(undefined)).resolves.toBeUndefined();
      expect(mockMe).not.toHaveBeenCalled();
    });

    it('returns authenticated user when service succeeds', async () => {
      mockMe.mockResolvedValue({
        id: '1',
        email: 'user@example.com',
        name: 'John Doe',
      });

      const result = await getAuthenticatedUser('jwt-token');

      expect(result).toEqual({
        id: '1',
        email: 'user@example.com',
        name: 'John Doe',
      });
      expect(mockClearAuthCookie).not.toHaveBeenCalled();
    });

    it('clears auth cookie for 401 errors', async () => {
      mockMe.mockRejectedValue({
        statusCode: 401,
        message: 'unauthorized',
      });

      const result = await getAuthenticatedUser('jwt-token');

      expect(result).toBeUndefined();
      expect(mockClearAuthCookie).toHaveBeenCalledTimes(1);
    });

    it('does not clear auth cookie for non-401 errors', async () => {
      mockMe.mockRejectedValue({
        statusCode: 500,
        message: 'server error',
      });

      const result = await getAuthenticatedUser('jwt-token');

      expect(result).toBeUndefined();
      expect(mockClearAuthCookie).not.toHaveBeenCalled();
    });
  });

  describe('getAuthenticatedUserBootstrap', () => {
    it('returns empty bootstrap data when user is not authenticated', async () => {
      await expect(
        getAuthenticatedUserBootstrap(false, 'jwt-token'),
      ).resolves.toEqual({
        initialUser: undefined,
        tokenExpiresAt: undefined,
      });
    });

    it('returns empty bootstrap data when token is missing', async () => {
      await expect(getAuthenticatedUserBootstrap(true)).resolves.toEqual({
        initialUser: undefined,
        tokenExpiresAt: undefined,
      });
    });

    it('returns user and token expiration when authenticated', async () => {
      mockMe.mockResolvedValue({
        id: '1',
        email: 'user@example.com',
        name: 'John Doe',
      });
      mockGetAuthTokenExpiration.mockReturnValue(1234567890);

      const result = await getAuthenticatedUserBootstrap(true, 'jwt-token');

      expect(result).toEqual({
        initialUser: {
          id: '1',
          email: 'user@example.com',
          name: 'John Doe',
        },
        tokenExpiresAt: 1234567890,
      });
      expect(mockGetAuthTokenExpiration).toHaveBeenCalledWith('jwt-token');
    });
  });
});
