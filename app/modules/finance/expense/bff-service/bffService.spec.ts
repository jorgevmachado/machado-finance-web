import { ExpenseBffService } from './bffService';

describe('ExpenseBffService', () => {
  it('sets domain and pathUrl', () => {
    const service = new ExpenseBffService('/api');

    expect(service.domain).toBe('expense');
    expect(service.pathUrl).toBe('expenses');
  });

  it('normalizes non-/api baseUrl', () => {
    const service = new ExpenseBffService('finance');

    expect(service.baseUrl).toBe('/api/finance');
    expect(service.url).toBe('/api/finance');
  });
});
