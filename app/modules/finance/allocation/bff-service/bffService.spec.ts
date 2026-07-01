import { AllocationBffService } from './bffService';

describe('AllocationBffService', () => {
  it('sets domain and pathUrl', () => {
    const service = new AllocationBffService('/api');

    expect(service.domain).toBe('allocation');
    expect(service.pathUrl).toBe('allocations');
  });

  it('normalizes non-/api baseUrl', () => {
    const service = new AllocationBffService('finance');

    expect(service.baseUrl).toBe('/api/finance');
    expect(service.url).toBe('/api/finance');
  });
});
