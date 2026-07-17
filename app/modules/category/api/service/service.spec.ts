jest.mock('@/app/shared', () => ({
  ApiBaseServiceAbstract: class {
    public url: string;
    public pathUrl: string;
    public config: { headers: Record<string, string> };

    constructor(baseUrl: string, pathUrl: string, token?: string) {
      this.url = baseUrl;
      this.pathUrl = pathUrl;
      this.config = {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      };
    }
  },
}));

import { CategoryService } from './service';

describe('CategoryService', () => {
  it('sets pathUrl to categories', () => {
    const service = new CategoryService('http://api.test');

    expect(service.pathUrl).toBe('finance/categories');
  });

  it('forwards base URL to Http', () => {
    const service = new CategoryService('http://api.test');

    expect(service.url).toBe('http://api.test');
  });

  it('adds bearer token when provided', () => {
    const service = new CategoryService('http://api.test', 'jwt-token');
    const headers = (service.config.headers ?? {}) as Record<string, string>;

    expect(headers.Authorization).toBe('Bearer jwt-token');
  });
});
