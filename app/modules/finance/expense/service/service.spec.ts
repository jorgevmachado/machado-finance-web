import { ExpenseService } from './service';

describe('ExpenseService', () => {
  it('sets pathUrl to expenses', () => {
    const service = new ExpenseService('http://api.test');

    expect(service.pathUrl).toBe('expenses');
  });

  it('forwards base URL to Http', () => {
    const service = new ExpenseService('http://api.test');

    expect(service.url).toBe('http://api.test');
  });

  it('adds bearer token when provided', () => {
    const service = new ExpenseService('http://api.test', 'jwt-token');
    const headers = (service.config.headers ?? {}) as Record<string, string>;

    expect(headers.Authorization).toBe('Bearer jwt-token');
  });

  it('posts upload payload as multipart to expenses/upload', async () => {
    const service = new ExpenseService('http://api.test');
    const postSpy = jest.spyOn(service, 'post').mockResolvedValue([] as never);
    const file = new File(['stub'], 'expense.csv', { type: 'text/csv' });

    await service.upload({
      file,
      bank: 'ITAU',
      allocation_id: 'allocation-1',
    });

    expect(postSpy).toHaveBeenCalledWith('expenses/upload', {
      body: expect.any(FormData)
    });
  });
});
