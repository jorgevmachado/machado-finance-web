import { EExpenseStatus } from './enum';

describe('EExpenseStatus', () => {
  it('exports all expected expense statuses', () => {
    expect(EExpenseStatus.PAID).toBe('PAID');
    expect(EExpenseStatus.PENDING).toBe('PENDING');
    expect(EExpenseStatus.CANCELLED).toBe('CANCELLED');
  });
});
