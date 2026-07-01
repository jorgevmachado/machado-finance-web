import * as authModule from './index';
import * as authActions from './actions';
import * as authServer from './server';

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

  it('exports auth action functions and messages', () => {
    expect(authActions.loginAction).toBeDefined();
    expect(authActions.logoutAction).toBeDefined();
    expect(authActions.readLoginPayload).toBeDefined();
    expect(authActions.validateLoginPayload).toBeDefined();
    expect(authActions.mapLoginError).toBeDefined();
    expect(authActions.readRegisterPayload).toBeDefined();
    expect(authActions.validateRegisterPayload).toBeDefined();
    expect(authActions.DEFAULT_LOGIN_ERROR_MESSAGE).toBeDefined();
    expect(authActions.PASSWORD_RULE_MESSAGE).toBeDefined();
  });

  it('exports auth server helpers', () => {
    expect(authServer.setAuthCookie).toBeDefined();
    expect(authServer.clearAuthCookie).toBeDefined();
    expect(authServer.getServerSession).toBeDefined();
    expect(authServer.getAuthenticatedUser).toBeDefined();
    expect(authServer.getAuthenticatedUserBootstrap).toBeDefined();
  });
});
