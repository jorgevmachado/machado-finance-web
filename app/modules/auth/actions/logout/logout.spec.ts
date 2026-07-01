const mockClearAuthCookie = jest.fn();

jest.mock('../../server/session', () => ({
  clearAuthCookie: (...args: Array<unknown>) => mockClearAuthCookie(...args),
}));

import { logoutAction } from './logout';

describe('logoutAction', () => {
  it('clears auth cookie', async () => {
    await logoutAction();

    expect(mockClearAuthCookie).toHaveBeenCalledTimes(1);
  });
});
