import { ECategoryType } from './enum';

describe('ECategoryType', () => {
  it('exports all expected category types', () => {
    expect(ECategoryType.FOOD).toBe('FOOD');
    expect(ECategoryType.OTHER).toBe('OTHER');
    expect(ECategoryType.STUDIES).toBe('STUDIES');
    expect(ECategoryType.UTILITY).toBe('UTILITY');
    expect(ECategoryType.HEALTH).toBe('HEALTH');
    expect(ECategoryType.PERSONAL).toBe('PERSONAL');
    expect(ECategoryType.TRANSPORT).toBe('TRANSPORT');
    expect(ECategoryType.ENTERTAINMENT).toBe('ENTERTAINMENT');
    expect(ECategoryType.GOVERNMENT_FEES).toBe('GOVERNMENT_FEES');
  });
});
