import { AllocationContributionService } from './service';

describe('AllocationContributionService', () => {
  it('sets pathUrl to allocation-contributions', () => {
    const service = new AllocationContributionService('http://api.test');

    expect(service.pathUrl).toBe('allocation-contributions');
  });

  it('forwards base URL to Http', () => {
    const service = new AllocationContributionService('http://api.test');

    expect(service.url).toBe('http://api.test');
  });

  it('adds bearer token when provided', () => {
    const service = new AllocationContributionService('http://api.test', 'jwt-token');
    const headers = (service.config.headers ?? {}) as Record<string, string>;

    expect(headers.Authorization).toBe('Bearer jwt-token');
  });
});
