import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { BffBaseServiceAbstract } from '../bff-service';

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

type TTestFilter = {
  name?: string;
}


class TestBffService extends BffBaseServiceAbstract<TTest, TTestCreate, TTestUpdate, TTestFilter> {
  constructor(baseUrl?: string) {
    super( 'test-domain',  'test-path-url',baseUrl);
    (this.get as unknown) = mockGet;
    (this.post as unknown) = mockPost;
    (this.path as unknown) = mockPath;
    (this.remove as unknown) = mockRemove;
  }
}

// ─── constructor ──────────────────────────────────────────────────────────────

describe('BffBaseServiceAbstract', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPost.mockReset();
    mockPath.mockReset();
    mockRemove.mockReset();
  });

  it('sets domain correctly', () => {
    const service = new TestBffService('http://api');
    expect(service.domain).toBe('test-domain');
  });

  it('sets pathUrl correctly', () => {
    const service = new TestBffService('http://api');
    expect(service.pathUrl).toBe('test-path-url');
  });

  it('sets baseUrl correctly', () => {
    const service = new TestBffService('/api');
    expect(service.baseUrl).toBe('/api');
  });

  it('uses default baseUrl when not provided', () => {
    const service = new TestBffService();
    expect(service.baseUrl).toBe('/api');
  });

  describe('isResponseError', () => {
    it('returns true when response has statusCode', () => {
      const service = new TestBffService('test');

      expect(
        service.isResponseError({ statusCode: 404, message: 'Not found' } as never),
      ).toBe(true);
    });

    it('returns false when response is a valid data object', () => {
      const service = new TestBffService('http://api');

      expect(service.isResponseError({ id: '1', name: 'name' })).toBe(false);
    });
  });

  describe('validateResponse', () => {
    it('returns error when response has statusCode 404', () => {
      const service = new TestBffService('test');
      const response = { statusCode: 404, message: 'Not found' } as never;
      const i18nMessageSuccess = 'test.success';
      const i18nMessageError = 'test.error';
      const result = service.validateResponse(response, i18nMessageSuccess, i18nMessageError);
      expect(result.error).toBeTruthy();
      expect(result.status).toBe(404);
      expect(result.message).toBe('Not found');
      expect(result.i18nMessageSuccess).toBe(i18nMessageSuccess);
      expect(result.i18nMessageError).toBe(i18nMessageError);
    });

    it('returns successfully when response is a valid data object', () => {
      const service = new TestBffService('http://api');
      const response = { id: '1', name: 'name' };
      const i18nMessageSuccess = 'test.success';
      const i18nMessageError = 'test.error';

      const result = service.validateResponse(response, i18nMessageSuccess, i18nMessageError);
      expect(result.data).toEqual(response);
      expect(result.error).toBeFalsy();
      expect(result.status).toBe(200);
      expect(result.message).toBe('OK');
      expect(result.i18nMessageSuccess).toBe(i18nMessageSuccess);
      expect(result.i18nMessageError).toBe(i18nMessageError);
    });
  });

  describe('list', () => {
    it('calls list with correct parameters and returns validated response', async () => {
      const service = new TestBffService('http://api');
      const expectedResponse = {
        data: [{ id: '1', name: 'Entity 1' }],
        error: false,
        status: 200,
        message: 'OK',
        i18nMessageError: 'custom.list.error',
        i18nMessageSuccess: 'custom.list.success',
      };

      const getSpy = jest
        .spyOn(service, 'get')
        .mockResolvedValueOnce(expectedResponse.data);

      const filters = { name: 'test' };
      const result = await service.list({
        filters,
        i18nMessageError: expectedResponse.i18nMessageError,
        i18nMessageSuccess: expectedResponse.i18nMessageSuccess,
      });

      expect(getSpy).toHaveBeenCalledWith('test-path-url?name=test', undefined);
      expect(result.data).toBe(expectedResponse.data);
      expect(result.error).toBeFalsy();
      expect(result.status).toBe(expectedResponse.status);
      expect(result.message).toBe(expectedResponse.message);
      expect(result.i18nMessageError).toBe(expectedResponse.i18nMessageError);
      expect(result.i18nMessageSuccess).toBe(expectedResponse.i18nMessageSuccess);
    });

    it('calls list without i18nMessage and returns validated response', async () => {
      const service = new TestBffService('http://api');
      const expectedResponse = {
        data: [{ id: '1', name: 'Entity 1' }],
        error: false,
        status: 200,
        message: 'OK',
        i18nMessageError: 'test-domain.list.error',
        i18nMessageSuccess: 'test-domain.list.success',
      };
      const getSpy = jest
        .spyOn(service, 'get')
        .mockResolvedValueOnce(expectedResponse.data);

      const filters = { name: 'test' };
      const result = await service.list({ filters });

      expect(getSpy).toHaveBeenCalledWith('test-path-url?name=test', undefined);
      expect(result.data).toBe(expectedResponse.data);
      expect(result.error).toBeFalsy();
      expect(result.status).toBe(expectedResponse.status);
      expect(result.message).toBe(expectedResponse.message);
      expect(result.i18nMessageError).toBe(expectedResponse.i18nMessageError);
      expect(result.i18nMessageSuccess).toBe(expectedResponse.i18nMessageSuccess);
    });
  });

  describe('list_paginate', () => {
    it('calls list paginate with correct parameters and returns validated response', async () => {
      const service = new TestBffService('http://api');
      const perPage = 10;
      const expectedResponse = {
        data: {
          meta: {
            total: 1,
            limit: perPage,
            offset: 0,
            next_page: undefined,
            previous_page: undefined,
            total_pages: 1,
            current_page: 1
          },
          items: [{ id: '1', name: 'Entity 1' }],

        },
        error: false,
        status: 200,
        message: 'OK',
        i18nMessageError: 'custom.list.error',
        i18nMessageSuccess: 'custom.list.success',
      };
      const getSpy = jest
        .spyOn(service, 'get')
        .mockResolvedValueOnce(expectedResponse.data);

      const filters = { name: 'test' };
      const result = await service.list_paginate({
        page: 1,
        filters,
        perPage,
        i18nMessageError: expectedResponse.i18nMessageError,
        i18nMessageSuccess: expectedResponse.i18nMessageSuccess,
      });

      expect(getSpy).toHaveBeenCalledWith(`test-path-url?page=1&limit=${perPage}&name=test`,undefined);
      expect(result.data).toBe(expectedResponse.data);
      expect(result.error).toBeFalsy();
      expect(result.status).toBe(expectedResponse.status);
      expect(result.message).toBe(expectedResponse.message);
      expect(result.i18nMessageError).toBe(expectedResponse.i18nMessageError);
      expect(result.i18nMessageSuccess).toBe(expectedResponse.i18nMessageSuccess);
    });

    it('calls list without i18nMessages and perPage and and returns validated response', async () => {
      const service = new TestBffService('http://api');
      const expectedResponse = {
        data: {
          meta: {
            total: 1,
            limit: 12,
            offset: 0,
            next_page: undefined,
            previous_page: undefined,
            total_pages: 1,
            current_page: 1
          },
          items: [{ id: '1', name: 'Entity 1' }],

        },
        error: false,
        status: 200,
        message: 'OK',
        i18nMessageError: 'test-domain.list.error',
        i18nMessageSuccess: 'test-domain.list.success',
      };
      const getSpy = jest
        .spyOn(service, 'get')
        .mockResolvedValueOnce(expectedResponse.data);

      const filters = { name: 'test' };
      const result = await service.list_paginate({ page: 1, filters });

      expect(getSpy).toHaveBeenCalledWith('test-path-url?page=1&limit=12&name=test', undefined);
      expect(result.data).toBe(expectedResponse.data);
      expect(result.error).toBeFalsy();
      expect(result.status).toBe(expectedResponse.status);
      expect(result.message).toBe(expectedResponse.message);
      expect(result.i18nMessageError).toBe(expectedResponse.i18nMessageError);
      expect(result.i18nMessageSuccess).toBe(expectedResponse.i18nMessageSuccess);
    });
  });

  describe('detail', () => {
    it('calls detail with correct identifier and returns validated response', async () => {
      const service = new TestBffService('http://api');
      const identifier = '1';
      const expectedResponse = {
        data: { id: '1', name: 'Entity 1' },
        error: false,
        status: 200,
        message: 'OK',
        i18nMessageError: 'custom.detail.error',
        i18nMessageSuccess: 'custom.detail.success',
      };
      const getSpy = jest
        .spyOn(service, 'get')
        .mockResolvedValueOnce(expectedResponse.data);

      const result = await service.detail({
        identifier,
        i18nMessageError: expectedResponse.i18nMessageError,
        i18nMessageSuccess: expectedResponse.i18nMessageSuccess
      });

      expect(getSpy).toHaveBeenCalledWith(`test-path-url/${identifier}`, undefined);
      expect(result.data).toBe(expectedResponse.data);
      expect(result.error).toBeFalsy();
      expect(result.status).toBe(expectedResponse.status);
      expect(result.message).toBe(expectedResponse.message);
      expect(result.i18nMessageError).toBe(expectedResponse.i18nMessageError);
      expect(result.i18nMessageSuccess).toBe(expectedResponse.i18nMessageSuccess);
    });

    it('calls detail without i18nMessages and returns validated response', async () => {
      const service = new TestBffService('http://api');
      const identifier = '1';
      const expectedResponse = {
        data: { id: '1', name: 'Entity 1' },
        error: false,
        status: 200,
        message: 'OK',
        i18nMessageError: 'test-domain.detail.error',
        i18nMessageSuccess: 'test-domain.detail.success',
      };
      const getSpy = jest
        .spyOn(service, 'get')
        .mockResolvedValueOnce(expectedResponse.data);

      const result = await service.detail({ identifier });

      expect(getSpy).toHaveBeenCalledWith(`test-path-url/${identifier}`, undefined);
      expect(result.data).toBe(expectedResponse.data);
      expect(result.error).toBeFalsy();
      expect(result.status).toBe(expectedResponse.status);
      expect(result.message).toBe(expectedResponse.message);
      expect(result.i18nMessageError).toBe(expectedResponse.i18nMessageError);
      expect(result.i18nMessageSuccess).toBe(expectedResponse.i18nMessageSuccess);
    });
  });

  describe('create', () => {
    it('calls create with correct payload and returns validated response', async () => {
      const service = new TestBffService('http://api');
      const payload: TTestCreate = {
        name: 'New Entity',
      };
      const expectedResponse = {
        data: { id: '1', name: payload.name },
        error: false,
        status: 200,
        message: 'OK',
        i18nMessageError: 'custom.create.error',
        i18nMessageSuccess: 'custom.create.success',
      };
      const postSpy = jest
        .spyOn(service, 'post')
        .mockResolvedValueOnce(expectedResponse.data);

      const result = await service.create({
        payload,
        i18nMessageError: expectedResponse.i18nMessageError,
        i18nMessageSuccess: expectedResponse.i18nMessageSuccess
      });

      expect(postSpy).toHaveBeenCalledWith('test-path-url', { body: payload });
      expect(result.data).toBe(expectedResponse.data);
      expect(result.error).toBeFalsy();
      expect(result.status).toBe(expectedResponse.status);
      expect(result.message).toBe(expectedResponse.message);
      expect(result.i18nMessageError).toBe(expectedResponse.i18nMessageError);
      expect(result.i18nMessageSuccess).toBe(expectedResponse.i18nMessageSuccess);
    });

    it('calls create without i18nMessages and and returns validated response', async () => {
      const service = new TestBffService('http://api');
      const payload: TTestCreate = {
        name: 'New Entity',
      };
      const expectedResponse = {
        data: { id: '1', name: payload.name },
        error: false,
        status: 200,
        message: 'OK',
        i18nMessageError: 'test-domain.create.error',
        i18nMessageSuccess: 'test-domain.create.success',
      };
      const postSpy = jest
        .spyOn(service, 'post')
        .mockResolvedValueOnce(expectedResponse.data);

      const result = await service.create({ payload });

      expect(postSpy).toHaveBeenCalledWith('test-path-url', { body: payload });
      expect(result.data).toBe(expectedResponse.data);
      expect(result.error).toBeFalsy();
      expect(result.status).toBe(expectedResponse.status);
      expect(result.message).toBe(expectedResponse.message);
      expect(result.i18nMessageError).toBe(expectedResponse.i18nMessageError);
      expect(result.i18nMessageSuccess).toBe(expectedResponse.i18nMessageSuccess);
    });
  });

  describe('update', () => {
    it('calls update with correct params and payload and returns validated response', async () => {
      const service = new TestBffService('http://api');
      const identifier = '1';
      const payload: TTestUpdate = {
        name: 'Update Entity',
      };
      const expectedResponse = {
        data: { id: identifier, name: payload.name },
        error: false,
        status: 200,
        message: 'OK',
        i18nMessageError: 'custom.update.error',
        i18nMessageSuccess: 'custom.update.success',
      };
      const pathSpy = jest
        .spyOn(service, 'path')
        .mockResolvedValueOnce(expectedResponse.data);

      const result = await service.update({
        payload,
        identifier,
        i18nMessageError: expectedResponse.i18nMessageError,
        i18nMessageSuccess: expectedResponse.i18nMessageSuccess
      });

      expect(pathSpy).toHaveBeenCalledWith(`test-path-url/${identifier}`, { body: payload });
      expect(result.data).toBe(expectedResponse.data);
      expect(result.error).toBeFalsy();
      expect(result.status).toBe(expectedResponse.status);
      expect(result.message).toBe(expectedResponse.message);
      expect(result.i18nMessageError).toBe(expectedResponse.i18nMessageError);
      expect(result.i18nMessageSuccess).toBe(expectedResponse.i18nMessageSuccess);
    });

    it('calls update without i18nMessages and and returns validated response', async () => {
      const service = new TestBffService('http://api');
      const identifier = '1';
      const payload: TTestUpdate = {
        name: 'Update Entity',
      };
      const expectedResponse = {
        data: { id: identifier, name: payload.name },
        error: false,
        status: 200,
        message: 'OK',
        i18nMessageError: 'test-domain.update.error',
        i18nMessageSuccess: 'test-domain.update.success',
      };
      const pathSpy = jest
        .spyOn(service, 'path')
        .mockResolvedValueOnce(expectedResponse.data);

      const result = await service.update({ payload, identifier });

      expect(pathSpy).toHaveBeenCalledWith(`test-path-url/${identifier}`, { body: payload });
      expect(result.data).toBe(expectedResponse.data);
      expect(result.error).toBeFalsy();
      expect(result.status).toBe(expectedResponse.status);
      expect(result.message).toBe(expectedResponse.message);
      expect(result.i18nMessageError).toBe(expectedResponse.i18nMessageError);
      expect(result.i18nMessageSuccess).toBe(expectedResponse.i18nMessageSuccess);
    });
  });

  describe('delete', () => {
    it('calls delete with correct identifier and returns validated response', async () => {
      const service = new TestBffService('http://api');
      const identifier = '1';
      const expectedResponse = {
        data: { message: 'Deleted Successfully!' },
        error: false,
        status: 200,
        message: 'OK',
        i18nMessageError: 'custom.delete.error',
        i18nMessageSuccess: 'custom.delete.success',
      };
      const removeSpy = jest
        .spyOn(service, 'remove')
        .mockResolvedValueOnce(expectedResponse.data);

      const result = await service.delete({
        identifier,
        i18nMessageError: expectedResponse.i18nMessageError,
        i18nMessageSuccess: expectedResponse.i18nMessageSuccess
      });

      expect(removeSpy).toHaveBeenCalledWith(`test-path-url/${identifier}`, undefined);
      expect(result.data).toBe(expectedResponse.data);
      expect(result.error).toBeFalsy();
      expect(result.status).toBe(expectedResponse.status);
      expect(result.message).toBe(expectedResponse.message);
      expect(result.i18nMessageError).toBe(expectedResponse.i18nMessageError);
      expect(result.i18nMessageSuccess).toBe(expectedResponse.i18nMessageSuccess);
    });

    it('calls delete without i18nMessages and returns validated response', async () => {
      const service = new TestBffService('http://api');
      const identifier = '1';
      const expectedResponse = {
        data: { message: 'Deleted Successfully!' },
        error: false,
        status: 200,
        message: 'OK',
        i18nMessageError: 'test-domain.delete.error',
        i18nMessageSuccess: 'test-domain.delete.success',
      };
      const removeSpy = jest
        .spyOn(service, 'remove')
        .mockResolvedValueOnce(expectedResponse.data);

      const result = await service.delete({ identifier });

      expect(removeSpy).toHaveBeenCalledWith(`test-path-url/${identifier}`, undefined);
      expect(result.data).toBe(expectedResponse.data);
      expect(result.error).toBeFalsy();
      expect(result.status).toBe(expectedResponse.status);
      expect(result.message).toBe(expectedResponse.message);
      expect(result.i18nMessageError).toBe(expectedResponse.i18nMessageError);
      expect(result.i18nMessageSuccess).toBe(expectedResponse.i18nMessageSuccess);
    });
  });

  describe('bff_get', () => {
    it('returns success response when bff_get succeeds', async () => {
      const service = new TestBffService('http://api');

      const expectedResponse = {
        data: [{ id: '1', name: 'Test Name' }],
        error: false,
        status: 200,
        message: 'OK',
        i18nMessageError: 'test-domain.get.error',
        i18nMessageSuccess: 'test-domain.get.success',
      };

      const getSpy = jest
        .spyOn(service, 'get')
        .mockResolvedValueOnce(expectedResponse.data);

      const response = await service.bff_get();

      expect(getSpy).toHaveBeenCalledWith('test-path-url', undefined);
      expect(response.data).toBe(expectedResponse.data);
      expect(response.error).toBeFalsy();
      expect(response.status).toBe(expectedResponse.status);
      expect(response.message).toBe(expectedResponse.message);
      expect(response.i18nMessageError).toBe(expectedResponse.i18nMessageError);
      expect(response.i18nMessageSuccess).toBe(expectedResponse.i18nMessageSuccess);
    });

    it('returns success response with param when bff_get succeeds', async () => {
      const service = new TestBffService('http://api');
      const expectedResponse = {
        data: { id: '1', name: 'Test Name' },
        error: false,
        status: 200,
        message: 'OK',
        i18nMessageError: 'test-domain.get.error',
        i18nMessageSuccess: 'test-domain.get.success',
      };
      const getSpy = jest
        .spyOn(service, 'get')
        .mockResolvedValueOnce(expectedResponse.data);

      const response = await service.bff_get({ param: '1' });

      expect(getSpy).toHaveBeenCalledWith('test-path-url/1', undefined);
      expect(response.data).toBe(expectedResponse.data);
      expect(response.error).toBeFalsy();
      expect(response.status).toBe(expectedResponse.status);
      expect(response.message).toBe(expectedResponse.message);
      expect(response.i18nMessageError).toBe(expectedResponse.i18nMessageError);
      expect(response.i18nMessageSuccess).toBe(expectedResponse.i18nMessageSuccess);
    });

    it('returns success response with param has / when bff_get succeeds', async () => {
      const service = new TestBffService('http://api');
      const expectedResponse = {
        data: { id: '1', name: 'Test Name' },
        error: false,
        status: 200,
        message: 'OK',
        i18nMessageError: 'test-domain.get.error',
        i18nMessageSuccess: 'test-domain.get.success',
      };
      const getSpy = jest
        .spyOn(service, 'get')
        .mockResolvedValueOnce(expectedResponse.data);

      const response = await service.bff_get({ param: '/1' });

      expect(getSpy).toHaveBeenCalledWith('test-path-url/1', undefined);
      expect(response.data).toBe(expectedResponse.data);
      expect(response.error).toBeFalsy();
      expect(response.status).toBe(expectedResponse.status);
      expect(response.message).toBe(expectedResponse.message);
      expect(response.i18nMessageError).toBe(expectedResponse.i18nMessageError);
      expect(response.i18nMessageSuccess).toBe(expectedResponse.i18nMessageSuccess);
    });

    it('returns success response with param and queryString when bff_get succeeds', async () => {
      const service = new TestBffService('http://api');
      const expectedResponse = {
        data: { id: '1', name: 'Test Name' },
        error: false,
        status: 200,
        message: 'OK',
        i18nMessageError: 'test-domain.get.error',
        i18nMessageSuccess: 'test-domain.get.success',
      };
      const getSpy = jest
        .spyOn(service, 'get')
        .mockResolvedValueOnce(expectedResponse.data);

      const response = await service.bff_get({ param:'/search',  queryString: 'name=Name' });

      expect(getSpy).toHaveBeenCalledWith('test-path-url/search?name=Name', undefined);
      expect(response.data).toBe(expectedResponse.data);
      expect(response.error).toBeFalsy();
      expect(response.status).toBe(expectedResponse.status);
      expect(response.message).toBe(expectedResponse.message);
      expect(response.i18nMessageError).toBe(expectedResponse.i18nMessageError);
      expect(response.i18nMessageSuccess).toBe(expectedResponse.i18nMessageSuccess);
    });
  });

  describe('bff_path', () => {
    it('returns success response when bff_path succeeds', async () => {
      const service = new TestBffService('http://api');
      const identifier = '1';
      const payload: TTestUpdate = { name: 'Updated Name' };
      const expectedResponse = {
        data: { id: identifier, name: payload.name },
        error: false,
        status: 200,
        message: 'OK',
        i18nMessageError: 'test-domain.path.error',
        i18nMessageSuccess: 'test-domain.path.success',
      };
      const pathSpy = jest
        .spyOn(service, 'path')
        .mockResolvedValueOnce(expectedResponse.data);
      const config = { body: payload };
      const response = await service.bff_path({ param: identifier, config });

      expect(pathSpy).toHaveBeenCalledWith(`test-path-url/${identifier}`, config);
      expect(response.data).toBe(expectedResponse.data);
      expect(response.error).toBeFalsy();
      expect(response.status).toBe(expectedResponse.status);
      expect(response.message).toBe(expectedResponse.message);
      expect(response.i18nMessageError).toBe(expectedResponse.i18nMessageError);
      expect(response.i18nMessageSuccess).toBe(expectedResponse.i18nMessageSuccess);
    });

    it('returns success response with param has / when bff_path  succeeds', async () => {
      const service = new TestBffService('http://api');
      const identifier = '/1';
      const payload: TTestUpdate = { name: 'Updated Name' };
      const expectedResponse = {
        data: { id: identifier, name: payload.name },
        error: false,
        status: 200,
        message: 'OK',
        i18nMessageError: 'test-domain.path.error',
        i18nMessageSuccess: 'test-domain.path.success',
      };
      const pathSpy = jest
        .spyOn(service, 'path')
        .mockResolvedValueOnce(expectedResponse.data);
      const config = { body: payload };
      const response = await service.bff_path({ param: identifier, config });

      expect(pathSpy).toHaveBeenCalledWith('test-path-url/1', config);
      expect(response.data).toBe(expectedResponse.data);
      expect(response.error).toBeFalsy();
      expect(response.status).toBe(expectedResponse.status);
      expect(response.message).toBe(expectedResponse.message);
      expect(response.i18nMessageError).toBe(expectedResponse.i18nMessageError);
      expect(response.i18nMessageSuccess).toBe(expectedResponse.i18nMessageSuccess);
    });
  });

  describe('bff_post', () => {
    it('returns success response when bff_post succeeds', async () => {
      const service = new TestBffService('http://api');
      const payload: TTestCreate = { name: 'Created Name' };
      const expectedResponse = {
        data: { id: '1', name: payload.name },
        error: false,
        status: 200,
        message: 'OK',
        i18nMessageError: 'test-domain.post.error',
        i18nMessageSuccess: 'test-domain.post.success',
      };
      const postSpy = jest
        .spyOn(service, 'post')
        .mockResolvedValueOnce(expectedResponse.data);
      const config = { body: payload };
      const response = await service.bff_post({ config });

      expect(postSpy).toHaveBeenCalledWith('test-path-url', config);
      expect(response.data).toBe(expectedResponse.data);
      expect(response.error).toBeFalsy();
      expect(response.status).toBe(expectedResponse.status);
      expect(response.message).toBe(expectedResponse.message);
      expect(response.i18nMessageError).toBe(expectedResponse.i18nMessageError);
      expect(response.i18nMessageSuccess).toBe(expectedResponse.i18nMessageSuccess);
    });

    it('returns success response with param has / when bff_post  succeeds', async () => {
      const service = new TestBffService('http://api');
      const payload: TTestCreate = { name: 'Created Name' };
      const expectedResponse = {
        data: { id: '1', name: payload.name },
        error: false,
        status: 200,
        message: 'OK',
        i18nMessageError: 'test-domain.post.error',
        i18nMessageSuccess: 'test-domain.post.success',
      };
      const postSpy = jest
        .spyOn(service, 'post')
        .mockResolvedValueOnce(expectedResponse.data);
      const config = { body: payload };
      const response = await service.bff_post({ param: '/create', config });

      expect(postSpy).toHaveBeenCalledWith('test-path-url/create', config);
      expect(response.data).toBe(expectedResponse.data);
      expect(response.error).toBeFalsy();
      expect(response.status).toBe(expectedResponse.status);
      expect(response.message).toBe(expectedResponse.message);
      expect(response.i18nMessageError).toBe(expectedResponse.i18nMessageError);
      expect(response.i18nMessageSuccess).toBe(expectedResponse.i18nMessageSuccess);
    });

    it('returns success response when bff_post is called without params', async () => {
      const service = new TestBffService('http://api');
      const expectedResponse = {
        data: { id: '1', name: 'Created Name' },
        error: false,
        status: 200,
        message: 'OK',
        i18nMessageError: 'test-domain.post.error',
        i18nMessageSuccess: 'test-domain.post.success',
      };
      const postSpy = jest
        .spyOn(service, 'post')
        .mockResolvedValueOnce(expectedResponse.data);

      const response = await service.bff_post();

      expect(postSpy).toHaveBeenCalledWith('test-path-url', undefined);
      expect(response.data).toBe(expectedResponse.data);
      expect(response.error).toBeFalsy();
      expect(response.status).toBe(expectedResponse.status);
      expect(response.message).toBe(expectedResponse.message);
      expect(response.i18nMessageError).toBe(expectedResponse.i18nMessageError);
      expect(response.i18nMessageSuccess).toBe(expectedResponse.i18nMessageSuccess);
    });
  });

  describe('bff_remove', () => {
    it('returns success response when bff_remove succeeds', async () => {
      const service = new TestBffService('http://api');
      const identifier = '1';
      const expectedResponse = {
        data: { id: '1', name: 'Name' },
        error: false,
        status: 200,
        message: 'OK',
        i18nMessageError: 'test-domain.remove.error',
        i18nMessageSuccess: 'test-domain.remove.success',
      };
      const removeSpy = jest
        .spyOn(service, 'remove')
        .mockResolvedValueOnce(expectedResponse.data);
      const response = await service.bff_remove({ param: identifier });

      expect(removeSpy).toHaveBeenCalledWith(`test-path-url/${identifier}`, undefined);
      expect(response.data).toBe(expectedResponse.data);
      expect(response.error).toBeFalsy();
      expect(response.status).toBe(expectedResponse.status);
      expect(response.message).toBe(expectedResponse.message);
      expect(response.i18nMessageError).toBe(expectedResponse.i18nMessageError);
      expect(response.i18nMessageSuccess).toBe(expectedResponse.i18nMessageSuccess);
    });

    it('returns success response with param has / when bff_remove  succeeds', async () => {
      const service = new TestBffService('http://api');
      const identifier = '/1';
      const expectedResponse = {
        data: { id: '1', name: 'Name' },
        error: false,
        status: 200,
        message: 'OK',
        i18nMessageError: 'test-domain.remove.error',
        i18nMessageSuccess: 'test-domain.remove.success',
      };
      const removeSpy = jest
        .spyOn(service, 'remove')
        .mockResolvedValueOnce(expectedResponse.data);
      const response = await service.bff_remove({ param: identifier });

      expect(removeSpy).toHaveBeenCalledWith('test-path-url/1', undefined);
      expect(response.data).toBe(expectedResponse.data);
      expect(response.error).toBeFalsy();
      expect(response.status).toBe(expectedResponse.status);
      expect(response.message).toBe(expectedResponse.message);
      expect(response.i18nMessageError).toBe(expectedResponse.i18nMessageError);
      expect(response.i18nMessageSuccess).toBe(expectedResponse.i18nMessageSuccess);
    });

    it('returns success response when bff_remove is called without params', async () => {
      const service = new TestBffService('http://api');
      const expectedResponse = {
        data: { id: '1', name: 'Name' },
        error: false,
        status: 200,
        message: 'OK',
        i18nMessageError: 'test-domain.remove.error',
        i18nMessageSuccess: 'test-domain.remove.success',
      };
      const removeSpy = jest
        .spyOn(service, 'remove')
        .mockResolvedValueOnce(expectedResponse.data);
      const response = await service.bff_remove();

      expect(removeSpy).toHaveBeenCalledWith('test-path-url', undefined);
      expect(response.data).toBe(expectedResponse.data);
      expect(response.error).toBeFalsy();
      expect(response.status).toBe(expectedResponse.status);
      expect(response.message).toBe(expectedResponse.message);
      expect(response.i18nMessageError).toBe(expectedResponse.i18nMessageError);
      expect(response.i18nMessageSuccess).toBe(expectedResponse.i18nMessageSuccess);
    });
  });
});