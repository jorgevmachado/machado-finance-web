import { EBank } from './enum';

describe('EBank', () => {
  it('exports all expected banks', () => {
    expect(EBank.CAIXA).toBe('CAIXA');
    expect(EBank.ITAU).toBe('ITAU');
    expect(EBank.NUBANK).toBe('NUBANK');
  });
});
