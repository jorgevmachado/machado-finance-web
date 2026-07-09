import {
  BffBaseServiceAbstract ,
  buildQueryString ,
  TBffResponse,
} from '@/app/shared';

import type { TFinance, TFinanceFilter } from '../types';
import { CategoryBffService } from '@/app/modules/finance/category';
import { IncomeBffService } from '@/app/modules/finance/income';
import { ExpenseBffService } from '@/app/modules/finance/expense';
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
  private readonly expenseModule: ExpenseBffService;
  private readonly accountModule: AccountBffService;
  private readonly allocationModule: AllocationBffService;
  private readonly allocationContributionModule: AllocationContributionBffService;
  private readonly transferModule: TransferBffService;

  constructor(baseUrl: string) {
    super('finance' ,'' ,baseUrl);
    this.categoryModule = new CategoryBffService(baseUrl);
    this.incomeModule = new IncomeBffService(baseUrl);
    this.expenseModule = new ExpenseBffService(baseUrl);
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

  get expense(): ExpenseBffService{
    return this.expenseModule;
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

  get transfer(): TransferBffService {
    return this.transferModule;
  }

  public async financeDetail(filters: TFinanceFilter): Promise<TBffResponse<TFinance>> {
    return await this.bff_get<TFinance>({
      queryString: buildQueryString<TFinanceFilter>(filters),
      i18nMessageSuccess: `${this.domain}.detail.success`,
      i18nMessageError: `${this.domain}.detail.error`
    });
  }

  public async onboarding(): Promise<TBffResponse<TFinance>> {
    return await this.bff_post<unknown, TFinance>({
      param: 'onboarding',
      i18nMessageSuccess: `${this.domain}.onboarding.success`,
      i18nMessageError: `${this.domain}.onboarding.error`
    });
  }
}