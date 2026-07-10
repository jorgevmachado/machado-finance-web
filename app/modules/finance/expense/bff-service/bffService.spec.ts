import { ExpenseBffService } from './bffService';

describe('ExpenseBffService', () => {
  it('sets domain and pathUrl', () => {
    const service = new ExpenseBffService('/api');

    expect(service.domain).toBe('expense');
    expect(service.pathUrl).toBe('expense');
  });

  it('normalizes non-/api baseUrl', () => {
    const service = new ExpenseBffService('finance');

    expect(service.baseUrl).toBe('/api/finance');
    expect(service.url).toBe('/api/finance');
  });

  it('posts upload payload as multipart to upload endpoint', async () => {
    const service = new ExpenseBffService('/api');
    const postSpy = jest.spyOn(service, 'post').mockResolvedValue([] as never);
    const file = new File(['stub'], 'expense.csv', { type: 'text/csv' });

    await service.upload({
      file,
      bank: 'ITAU',
      allocation_id: 'allocation-1'
    });

    expect(postSpy).toHaveBeenCalledWith('expense/upload', {
      body: expect.any(FormData)
    });
  });
});
