import { AccountService } from './service';

describe('AccountService', () => {
  it('sets pathUrl to accounts', () => {
    const service = new AccountService('http://api.test');

    expect(service.pathUrl).toBe('accounts');
  });

  it('forwards base URL to Http', () => {
    const service = new AccountService('http://api.test');

    expect(service.url).toBe('http://api.test');
  });

  it('adds bearer token when provided', () => {
    const service = new AccountService('http://api.test', 'jwt-token');
    const headers = (service.config.headers ?? {}) as Record<string, string>;

    expect(headers.Authorization).toBe('Bearer jwt-token');
  });

  it('calls recalculate endpoint with account identifier', async () => {
    const service = new AccountService('http://api.test');
    const getSpy = jest.spyOn(service, 'get').mockResolvedValue({ id: 'account-1' } as never);

    await service.recalculate('account-1');

    expect(getSpy).toHaveBeenCalledWith('accounts/account-1/recalculate');
  });
});
