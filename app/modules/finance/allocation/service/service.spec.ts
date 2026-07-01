import { AllocationService } from './service';

describe('AllocationService', () => {
  it('sets pathUrl to allocations', () => {
    const service = new AllocationService('http://api.test');

    expect(service.pathUrl).toBe('allocations');
  });

  it('forwards base URL to Http', () => {
    const service = new AllocationService('http://api.test');

    expect(service.url).toBe('http://api.test');
  });

  it('adds bearer token when provided', () => {
    const service = new AllocationService('http://api.test', 'jwt-token');
    const headers = (service.config.headers ?? {}) as Record<string, string>;

    expect(headers.Authorization).toBe('Bearer jwt-token');
  });
});
