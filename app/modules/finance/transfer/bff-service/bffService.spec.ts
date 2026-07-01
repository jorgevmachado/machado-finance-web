import { TransferBffService } from './bffService';

describe('TransferBffService', () => {
  it('sets domain and pathUrl', () => {
    const service = new TransferBffService('/api');

    expect(service.domain).toBe('transfer');
    expect(service.pathUrl).toBe('transfers');
  });

  it('normalizes non-/api baseUrl', () => {
    const service = new TransferBffService('finance');

    expect(service.baseUrl).toBe('/api/finance');
    expect(service.url).toBe('/api/finance');
  });
});
