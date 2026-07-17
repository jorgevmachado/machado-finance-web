jest.mock('../../actions', () => ({}));
jest.mock('../../validator', () => ({}));

import { BffBaseServiceAbstract } from './bff';

type Entity = { id: string; name: string };
type Draft = { name: string };
type Filter = { name?: string };

const createValidator = () => ({
  validateCreate: jest.fn().mockReturnValue(null),
  validateUpdate: jest.fn().mockReturnValue(null),
  transformCreate: jest.fn((draft: Draft) => ({ ...draft, name: draft.name.trim() })),
  transformUpdate: jest.fn((draft: Draft) => ({ ...draft, name: draft.name.trim() })),
  hasEntityChanged: jest.fn(),
});

class TestBffService extends BffBaseServiceAbstract<Entity, Draft, Draft, Draft, Filter> {
  constructor(
    validator: ReturnType<typeof createValidator>,
    baseUrl?: string,
  ) {
    super('category', 'categories', validator, baseUrl);
  }
}

describe('BffBaseServiceAbstract', () => {
  it('normalizes base url with /api prefix', () => {
    const service = new TestBffService(createValidator(), 'finance');
    const serviceWithApi = new TestBffService(createValidator(), '/api/custom');

    expect(service.baseUrl).toBe('/api/finance');
    expect(serviceWithApi.baseUrl).toBe('/api/custom');
  });

  it('detects response error payloads by statusCode', () => {
    const service = new TestBffService(createValidator());

    expect(service.isResponseError({ statusCode: 400 })).toBe(true);
    expect(service.isResponseError({ id: '1' })).toBe(false);
  });

  it('maps successful and error list responses', async () => {
    const service = new TestBffService(createValidator());
    const getSpy = jest.spyOn(service, 'get')
      .mockResolvedValueOnce([{ id: '1', name: 'Food' }])
      .mockResolvedValueOnce({ statusCode: 500, message: 'boom' });

    await expect(service.list({ name: 'Food' })).resolves.toEqual({
      data: [{ id: '1', name: 'Food' }],
      error: false,
      status: 200,
      message: 'category.messages.success.list',
      responseMessage: 'Ok',
    });
    await expect(service.list({})).resolves.toEqual({
      error: true,
      status: 500,
      message: 'category.messages.error.list',
      responseMessage: 'boom',
    });

    expect(getSpy).toHaveBeenNthCalledWith(1, 'categories?name=Food');
    expect(getSpy).toHaveBeenNthCalledWith(2, 'categories');
  });

  it('builds paginated and detail paths correctly', async () => {
    const service = new TestBffService(createValidator());
    const getSpy = jest.spyOn(service, 'get')
      .mockResolvedValueOnce({
        items: [],
        meta: { current_page: 1, total_pages: 1, total: 0, limit: 12, offset: 0, next_page: null, previous_page: null },
      })
      .mockResolvedValueOnce({ id: '1', name: 'Food' });

    await service.listPaginate({ page: 2, perPage: 20, filters: { name: 'Food' } });
    await service.detail('/1', 'active=true');

    expect(getSpy).toHaveBeenNthCalledWith(1, 'categories?page=2&limit=20&name=Food');
    expect(getSpy).toHaveBeenNthCalledWith(2, 'categories/1?active=true');
  });

  it('uses default perPage when pagination param is omitted', async () => {
    const service = new TestBffService(createValidator());
    const getSpy = jest.spyOn(service, 'get').mockResolvedValue({
      items: [],
      meta: { current_page: 1, total_pages: 1, total: 0, limit: 12, offset: 0, next_page: null, previous_page: null },
    });

    await service.listPaginate({ page: 1, filters: {} });

    expect(getSpy).toHaveBeenCalledWith('categories?page=1&limit=12');
  });

  it('returns validator error on invalid payload and skips network calls', async () => {
    const validator = createValidator();
    validator.validateCreate.mockReturnValueOnce({
      status: 'error',
      type: 'create',
      message: 'category.messages.error.invalid',
    });
    const service = new TestBffService(validator);
    const postSpy = jest.spyOn(service, 'post');

    await expect(service.create({ name: ' invalid ' })).resolves.toEqual({
      error: true,
      status: 400,
      message: 'category.messages.error.invalid',
      responseMessage: 'category.messages.error.invalid',
    });
    expect(postSpy).not.toHaveBeenCalled();
  });

  it('returns validator error on invalid update payload and skips network calls', async () => {
    const validator = createValidator();
    validator.validateUpdate.mockReturnValueOnce({
      status: 'error',
      type: 'update',
      message: 'category.messages.error.invalidUpdate',
    });
    const service = new TestBffService(validator);
    const putSpy = jest.spyOn(service, 'path');

    await expect(service.update('1', { name: ' invalid ' })).resolves.toEqual({
      error: true,
      status: 400,
      message: 'category.messages.error.invalidUpdate',
      responseMessage: 'category.messages.error.invalidUpdate',
    });
    expect(putSpy).not.toHaveBeenCalled();
  });

  it('transforms payload and calls update/create/delete endpoints', async () => {
    const validator = createValidator();
    const service = new TestBffService(validator);
    const postSpy = jest.spyOn(service, 'post').mockResolvedValue({ id: '1', name: 'Food' });
    const putSpy = jest.spyOn(service, 'path').mockResolvedValue({ id: '1', name: 'Updated' });
    const removeSpy = jest.spyOn(service, 'remove').mockResolvedValue({ message: 'ok' });

    await service.create({ name: ' Food ' });
    await service.update('1', { name: ' Updated ' });
    await service.delete('1');

    expect(validator.transformCreate).toHaveBeenCalledWith({ name: ' Food ' });
    expect(validator.transformUpdate).toHaveBeenCalledWith({ name: ' Updated ' });
    expect(postSpy).toHaveBeenCalledWith('categories', { body: { name: 'Food' } });
    expect(putSpy).toHaveBeenCalledWith('categories/1', { body: { name: 'Updated' } });
    expect(removeSpy).toHaveBeenCalledWith('categories/1');
  });
});
