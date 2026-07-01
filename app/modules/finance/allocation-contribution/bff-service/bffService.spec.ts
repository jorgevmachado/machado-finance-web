import { AllocationContributionBffService } from './bffService';

describe('AllocationContributionBffService', () => {
  it('sets domain and pathUrl', () => {
    const service = new AllocationContributionBffService('/api');

    expect(service.domain).toBe('allocation-contributions');
    expect(service.pathUrl).toBe('allocation-contributions');
  });

  it('normalizes non-/api baseUrl', () => {
    const service = new AllocationContributionBffService('finance');

    expect(service.baseUrl).toBe('/api/finance');
    expect(service.url).toBe('/api/finance');
  });
});
