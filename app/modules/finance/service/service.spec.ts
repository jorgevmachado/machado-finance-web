import { AccountService } from '../account';
import { AllocationContributionService } from '../allocation-contribution';
import { AllocationService } from '../allocation';
import { CategoryService } from '../category';
import { IncomeService } from '../income';
import { TransferService } from '../transfer';
import { FinanceService } from './service';

describe('FinanceService', () => {
  it('sets pathUrl to finance', () => {
    const service = new FinanceService('http://api.test');

    expect(service.pathUrl).toBe('finance');
  });

  it('initializes children modules with finance scoped URL', () => {
    const service = new FinanceService('http://api.test', 'jwt-token');

    expect(service.category).toBeInstanceOf(CategoryService);
    expect(service.income).toBeInstanceOf(IncomeService);
    expect(service.account).toBeInstanceOf(AccountService);
    expect(service.allocation).toBeInstanceOf(AllocationService);
    expect(service.allocationContribution).toBeInstanceOf(AllocationContributionService);
    expect(service.transfer).toBeInstanceOf(TransferService);

    expect(service.category.url).toBe('http://api.test/finance');
    expect(service.income.url).toBe('http://api.test/finance');
    expect(service.account.url).toBe('http://api.test/finance');
    expect(service.allocation.url).toBe('http://api.test/finance');
    expect(service.allocationContribution.url).toBe('http://api.test/finance');
    expect(service.transfer.url).toBe('http://api.test/finance');
  });
});
