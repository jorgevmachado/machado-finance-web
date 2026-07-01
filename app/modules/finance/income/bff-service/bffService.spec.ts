import { IncomeBffService } from './bffService';

describe('IncomeBffService', () => {
  it('sets domain and pathUrl', () => {
    const service = new IncomeBffService('/api');

    expect(service.domain).toBe('income');
    expect(service.pathUrl).toBe('incomes');
  });

  it('normalizes non-/api baseUrl', () => {
    const service = new IncomeBffService('finance');

    expect(service.baseUrl).toBe('/api/finance');
    expect(service.url).toBe('/api/finance');
  });
});
