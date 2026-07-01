import { EAllocationType } from './enum';

describe('EAllocationType', () => {
  it('exports all expected allocation types', () => {
    expect(EAllocationType.OTHER).toBe('OTHER');
    expect(EAllocationType.HOUSE).toBe('HOUSE');
    expect(EAllocationType.FAMILY).toBe('FAMILY');
    expect(EAllocationType.PERSONAL).toBe('PERSONAL');
  });
});
