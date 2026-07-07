import { EMonthStatus } from './enum';

describe('EMonthStatus', () => {
  it('exports all expected expense statuses', () => {
    expect(EMonthStatus.PAID).toBe('PAID');
    expect(EMonthStatus.PENDING).toBe('PENDING');
    expect(EMonthStatus.CANCELLED).toBe('CANCELLED');
  });
});
