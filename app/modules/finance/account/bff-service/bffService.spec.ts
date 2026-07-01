import { AccountBffService } from './bffService';

describe('AccountBffService', () => {
  it('sets domain and pathUrl', () => {
    const service = new AccountBffService('/api');

    expect(service.domain).toBe('account');
    expect(service.pathUrl).toBe('account');
  });

  it('normalizes non-/api baseUrl', () => {
    const service = new AccountBffService('finance');

    expect(service.baseUrl).toBe('/api/finance');
    expect(service.url).toBe('/api/finance');
  });

  it('calls recalculate endpoint with account identifier', async () => {
    const service = new AccountBffService('/api');
    const getSpy = jest.spyOn(service, 'get').mockResolvedValue({ data: { id: 'account-1' } } as never);

    await service.recalculate('account-1');

    expect(getSpy).toHaveBeenCalledWith('account/account-1/recalculate');
  });
});
