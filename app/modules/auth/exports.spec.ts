jest.mock('./constants', () => ({
  AUTH_COOKIE_NAME: 'auth-token',
  PASSWORD_PATTERN: /abc/,
  PASSWORD_RULE_MESSAGE: 'i18n:auth.errors.passwordRule',
}));
jest.mock('./enum', () => ({
  EUserRole: { USER: 'USER' },
  EUserStatus: { ACTIVE: 'ACTIVE' },
}));
jest.mock('./pages', () => ({
  LoginPage: () => null,
}));
jest.mock('./provider', () => ({
  UserProvider: () => null,
  useUser: jest.fn(),
}));
jest.mock('./api/service', () => ({
  authService: { login: jest.fn() },
}));
jest.mock('./token', () => ({
  createMockAuthToken: jest.fn(),
  extractAuthToken: jest.fn(),
  getAuthTokenExpiration: jest.fn(),
  isValidAuthToken: jest.fn(),
}));

import * as authModule from './index';

describe('auth module exports', () => {
  it('exports public auth APIs from root index', () => {
    expect(authModule.authService).toBeDefined();
    expect(authModule.createMockAuthToken).toBeDefined();
    expect(authModule.extractAuthToken).toBeDefined();
    expect(authModule.getAuthTokenExpiration).toBeDefined();
    expect(authModule.isValidAuthToken).toBeDefined();
    expect(authModule.UserProvider).toBeDefined();
    expect(authModule.useUser).toBeDefined();
    expect(authModule.LoginPage).toBeDefined();
  });

  it('exports auth constants from root index', () => {
    expect(authModule.PASSWORD_RULE_MESSAGE).toBe('i18n:auth.errors.passwordRule');
    expect(authModule.AUTH_COOKIE_NAME).toBe('auth-token');
  });
});
