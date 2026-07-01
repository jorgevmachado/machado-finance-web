import { AccountBffService } from '../account';
import { AllocationContributionBffService } from '../allocation-contribution';
import { AllocationBffService } from '../allocation';
import { CategoryBffService } from '../category';
import { IncomeBffService } from '../income';
import { FinanceBffService } from './bffService';

describe('FinanceBffService', () => {
  it('sets domain and root pathUrl', () => {
    const service = new FinanceBffService('/api');

    expect(service.domain).toBe('finance');
    expect(service.pathUrl).toBe('');
  });

  it('normalizes non-/api baseUrl and wires all available child modules', () => {
    const service = new FinanceBffService('finance');

    expect(service.baseUrl).toBe('/api/finance');
    expect(service.url).toBe('/api/finance');
    expect(service.category).toBeInstanceOf(CategoryBffService);
    expect(service.income).toBeInstanceOf(IncomeBffService);
    expect(service.account).toBeInstanceOf(AccountBffService);
    expect(service.allocation).toBeInstanceOf(AllocationBffService);
    expect(service.allocationContribution).toBeInstanceOf(AllocationContributionBffService);
  });
});
