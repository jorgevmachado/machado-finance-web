import { BaseServiceAbstract } from '@/app/shared';
import {
  CategoryService
} from '../category';

export class FinanceService extends BaseServiceAbstract {
  private readonly categoryModule: CategoryService;
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'finance', token);
    const childrenBaseUrl =  `${baseUrl}/${this.pathUrl}`;
    this.categoryModule = new CategoryService(childrenBaseUrl, token);
  }

  get category(): CategoryService {
    return this.categoryModule;
  }
}