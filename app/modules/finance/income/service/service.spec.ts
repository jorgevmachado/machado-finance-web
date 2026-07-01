import { IncomeService } from './service';

describe('IncomeService', () => {
  it('sets pathUrl to income', () => {
    const service = new IncomeService('http://api.test');

    expect(service.pathUrl).toBe('income');
  });

  it('forwards base URL to Http', () => {
    const service = new IncomeService('http://api.test');

    expect(service.url).toBe('http://api.test');
  });

  it('adds bearer token when provided', () => {
    const service = new IncomeService('http://api.test', 'jwt-token');
    const headers = (service.config.headers ?? {}) as Record<string, string>;

    expect(headers.Authorization).toBe('Bearer jwt-token');
  });
});
