import { TransferService } from './service';

describe('TransferService', () => {
  it('sets pathUrl to transfers', () => {
    const service = new TransferService('http://api.test');

    expect(service.pathUrl).toBe('transfers');
  });

  it('forwards base URL to Http', () => {
    const service = new TransferService('http://api.test');

    expect(service.url).toBe('http://api.test');
  });

  it('adds bearer token when provided', () => {
    const service = new TransferService('http://api.test', 'jwt-token');
    const headers = (service.config.headers ?? {}) as Record<string, string>;

    expect(headers.Authorization).toBe('Bearer jwt-token');
  });
});
