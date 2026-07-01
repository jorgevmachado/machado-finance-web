import { BffBaseServiceAbstract } from '@/app/shared';

import { TFinance, TFinanceFilter } from '../types';
import { CategoryBffService } from '@/app/modules/finance/category';
import { IncomeBffService } from '@/app/modules/finance/income';
import {
  AccountBffService ,
} from '@/app/modules/finance/account';
import { AllocationBffService } from '@/app/modules/finance/allocation';
import {
  AllocationContributionBffService
} from '@/app/modules/finance/allocation-contribution';
import { TransferBffService } from '@/app/modules/finance/transfer';

export class FinanceBffService extends BffBaseServiceAbstract<TFinance,unknown, unknown, TFinanceFilter> {
  private readonly categoryModule: CategoryBffService;
  private readonly incomeModule: IncomeBffService;
  private readonly accountModule: AccountBffService;
  private readonly allocationModule: AllocationBffService;
  private readonly allocationContributionModule: AllocationContributionBffService;
  private readonly transferModule: TransferBffService;

  constructor(baseUrl: string) {
    super('finance' ,'' ,baseUrl);
    this.categoryModule = new CategoryBffService(baseUrl);
    this.incomeModule = new IncomeBffService(baseUrl);
    this.accountModule = new AccountBffService(baseUrl);
    this.allocationModule = new AllocationBffService(baseUrl);
    this.allocationContributionModule = new AllocationContributionBffService(
      baseUrl);
    this.transferModule = new TransferBffService(baseUrl);
  }

  get category(): CategoryBffService {
    return this.categoryModule;
  }

  get income(): IncomeBffService {
    return this.incomeModule;
  }

  get account(): AccountBffService {
    return this.accountModule;
  }

  get allocation(): AllocationBffService {
    return this.allocationModule;
  }

  get allocationContribution(): AllocationContributionBffService {
    return this.allocationContributionModule;
  }
}