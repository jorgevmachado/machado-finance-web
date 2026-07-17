import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { ApiBaseServiceAbstract } from './service';

const mockGet = jest.fn<(...args: Array<unknown>) => Promise<unknown>>();
const mockPost = jest.fn<(...args: Array<unknown>) => Promise<unknown>>();
const mockPath = jest.fn<(...args: Array<unknown>) => Promise<unknown>>();
const mockRemove = jest.fn<(...args: Array<unknown>) => Promise<unknown>>();

// ─── Concrete subclass for testing ───────────────────────────────────────────

type TTest = {
  id: string;
  name: string;
}

type TTestCreate = {
  name: string;
}

type TTestUpdate = {
  name?: string
}


class TestService extends ApiBaseServiceAbstract<TTest, TTestCreate, TTestUpdate> {
  constructor(baseUrl: string, pathUrl: string, token?: string) {
    super(baseUrl, pathUrl, token);
    (this.get as unknown) = mockGet;
    (this.post as unknown) = mockPost;
    (this.path as unknown) = mockPath;
    (this.remove as unknown) = mockRemove;
  }
}

// ─── constructor ──────────────────────────────────────────────────────────────

describe('BaseServiceAbstract', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPost.mockReset();
    mockPath.mockReset();
    mockRemove.mockReset();
  });

  it('sets pathUrl correctly', () => {
    const service = new TestService('http://api.test', 'entity');
    expect(service.pathUrl).toBe('entity');
  });

  it('does not add Authorization header when no token is provided', () => {
    const service = new TestService('http://api.test', 'entity');
    // config.headers should be an empty object when no token
    const headers = (service.config.headers ?? {}) as Record<string, string>;
    expect(headers['Authorization']).toBeUndefined();
  });

  it('adds a Bearer Authorization header when a token is provided', () => {
    const token = 'my-jwt-token';
    const service = new TestService('http://api.test', 'entity', token);
    const headers = (service.config.headers ?? {}) as Record<string, string>;
    expect(headers['Authorization']).toBe(`Bearer ${token}`);
  });

  it('inherits the base url from Http', () => {
    const service = new TestService('http://api.test', 'entity');
    expect(service.url).toBe('http://api.test');
  });

  describe('list', () => {
    it('should call get with correct URL and params for list paginate', async () => {
      const service = new TestService('http://api.test', 'entity');
      const expected = {
        items: [{ id: '1', name: 'Entity 1' }],
        meta: {
          total: 1,
          limit: 1,
          offset: 0,
          next_page: undefined,
          previous_page: undefined,
          total_pages: 1,
          current_page: 1
        }
      };
      mockGet.mockResolvedValue(expected);
      const result = await service.list({ page: 1 });
      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith('entity', { params: { page: 1 } });
      expect(result).toEqual(expected);
    });

    it('should call get with correct URL and params for list not paginate', async () => {
      const service = new TestService('http://api.test', 'entity');
      const expected = [{ id: '1', name: 'Entity 1' }];
      mockGet.mockResolvedValue(expected);
      const result = await service.list({ });
      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith('entity', { params: {  } });
      expect(result).toEqual(expected);
    });

    it('should call get with correct URL and not params for list not paginate', async () => {
      const service = new TestService('http://api.test', 'entity');
      const expected = [{ id: '1', name: 'Entity 1' }];
      mockGet.mockResolvedValue(expected);
      const result = await service.list();
      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith('entity', { });
      expect(result).toEqual(expected);
    });
  });

  describe('detail', () => {
    it('should call get with correct URL and params for detail', async () => {
      const service = new TestService('http://api.test', 'entity');
      const expected = { id: '1', name: 'Entity 1' };
      mockGet.mockResolvedValue(expected);
      const result = await service.detail('param');
      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith('entity/param', {});
      expect(result).toEqual(expected);
    });

    it('should call get with params when detail receives query params', async () => {
      const service = new TestService('http://api.test', 'entity');
      const expected = { id: '1', name: 'Entity 1' };
      mockGet.mockResolvedValue(expected);

      const result = await service.detail('param', { include: 'all' });

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith('entity/param', { params: { include: 'all' } });
      expect(result).toEqual(expected);
    });
  });

  describe('create', () => {
    it('should call post with correct URL and body for create', async () => {
      const service = new TestService('http://api.test', 'entity');
      mockPost.mockResolvedValue({ success: true });
      const mockBody = { id: '1', name: 'New Entity' };
      const result = await service.create(mockBody);
      expect(mockPost).toHaveBeenCalledTimes(1);
      expect(mockPost).toHaveBeenCalledWith('entity', { body: mockBody });
      expect(result).toEqual({ success: true });
    });
  });

  describe('update', () => {
    it('should call put with correct URL and body for update', async () => {
      const service = new TestService('http://api.test', 'entity');
      mockPath.mockResolvedValue({ success: true });
      const mockBody = { name: 'New Entity' };
      const result = await service.update('param', mockBody);
      expect(mockPath).toHaveBeenCalledTimes(1);
      expect(mockPath).toHaveBeenCalledWith('entity/param', { body: mockBody });
      expect(result).toEqual({ success: true });
    });
  });

  describe('delete', () => {
    it('should call delete with correct URL and params for delete', async () => {
      const service = new TestService('http://api.test', 'entity');
      const expected = { message: 'Deleted Successfully!' };
      mockRemove.mockResolvedValue(expected);
      const result = await service.delete('param');
      expect(mockRemove).toHaveBeenCalledTimes(1);
      expect(mockRemove).toHaveBeenCalledWith('entity/param');
      expect(result).toEqual(expected);
    });
  });
});
