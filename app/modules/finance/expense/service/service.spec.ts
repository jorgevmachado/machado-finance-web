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
});
