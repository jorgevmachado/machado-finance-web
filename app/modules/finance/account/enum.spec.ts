import { EAccountType } from './enum';

describe('EAccountType', () => {
  it('exports all expected account types', () => {
    expect(EAccountType.PIX).toBe('PIX');
    expect(EAccountType.BANK).toBe('BANK');
    expect(EAccountType.CASH).toBe('CASH');
    expect(EAccountType.OTHER).toBe('OTHER');
    expect(EAccountType.INVESTMENT).toBe('INVESTMENT');
    expect(EAccountType.ACCOUNT_DEBIT).toBe('ACCOUNT_DEBIT');
  });
});
