import { BaseServiceAbstract } from '@/app/shared';
import {
  CategoryService
} from '../category';
import { IncomeService } from '../income';
import { AccountService } from '../account';
import { AllocationService } from '../allocation';
import {
  AllocationContributionService
} from '../allocation-contribution';
import { TransferService } from '../transfer';
import { TFinance } from '../types';

export class FinanceService extends BaseServiceAbstract<TFinance, unknown, unknown> {
  private readonly categoryModule: CategoryService;
  private readonly incomeModule: IncomeService;
  private readonly accountModule: AccountService;
  private readonly allocationModule: AllocationService;
  private readonly allocationContributionModule: AllocationContributionService;
  private readonly transferModule: TransferService;
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'finance', token);
    const childrenBaseUrl =  `${baseUrl}/${this.pathUrl}`;
    this.categoryModule = new CategoryService(childrenBaseUrl, token);
    this.incomeModule = new IncomeService(childrenBaseUrl, token);
    this.accountModule = new AccountService(childrenBaseUrl, token);
    this.allocationModule = new AllocationService(childrenBaseUrl, token);
    this.allocationContributionModule = new AllocationContributionService(childrenBaseUrl, token);
    this.transferModule = new TransferService(childrenBaseUrl, token);
  }

  get category(): CategoryService {
    return this.categoryModule;
  }

  get income(): IncomeService {
    return this.incomeModule;
  }

  get account(): AccountService {
    return this.accountModule;
  }

  get allocation(): AllocationService {
    return this.allocationModule;
  }

  get allocationContribution(): AllocationContributionService {
    return this.allocationContributionModule;
  }

  get transfer(): TransferService {
    return this.transferModule;
  }

  public async finance(params?: Record<string, unknown>): Promise<TFinance> {
    const config = !params ? {} : { params };
    return this.get<TFinance>(this.pathUrl ,config);
  }
}