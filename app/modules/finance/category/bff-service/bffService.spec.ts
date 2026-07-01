import { CategoryBffService } from './bffService';

describe('CategoryBffService', () => {
  it('sets domain and pathUrl', () => {
    const service = new CategoryBffService('/api');

    expect(service.domain).toBe('category');
    expect(service.pathUrl).toBe('category');
  });

  it('normalizes non-/api baseUrl', () => {
    const service = new CategoryBffService('finance');

    expect(service.baseUrl).toBe('/api/finance');
    expect(service.url).toBe('/api/finance');
  });
});
