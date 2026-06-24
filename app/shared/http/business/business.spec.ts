import {
  formatUrl,
  getBaseUrl,
  serialize_url,
} from './business';

describe('url utils', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('formatUrl', () => {
    it('formats urls with optional query params', () => {
      expect(formatUrl('http://api.local', 'finance', { name: 'john' })).toBe('http://api.local/finance?name=john');
      expect(formatUrl('http://api.local', '', {})).toBe('http://api.local');
    });
  });

  describe('getBaseUrl', () => {
    it('returns the first configured service base url', () => {
      process.env.API_BASE_URL = 'http://auth.local';

      expect(getBaseUrl()).toBe('http://auth.local');
    });

    it('falls back to the local API url', () => {
      delete process.env.API_BASE_URL;

      expect(getBaseUrl()).toBe('http://127.0.0.1:8000');
    });
  });

  describe('serialize_url', () => {
    it('serializes params only when keys exist', () => {
      expect(serialize_url({ name: 'john', page: '1' })).toBe('name=john&page=1');
      expect(serialize_url({})).toBeUndefined();
    });
  });
});
