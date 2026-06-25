import { BaseServiceAbstract } from '@/app/shared';
import { TPaginatedListResponse } from '@/app/ds';
import { TCategory ,TCategoryFilter } from '../types';

export class CategoryService extends BaseServiceAbstract {
  constructor(baseUrl: string ,token?: string) {
    super(baseUrl ,'category' ,token);
  }

  async list(params: TCategoryFilter): Promise<TPaginatedListResponse<TCategory>> {
    return this.get<TPaginatedListResponse<TCategory>>(this.pathUrl ,{ params });
  }

  public async detail(identifier: string): Promise<TCategory> {
    return await this.get<TCategory>(`${this.pathUrl}/${identifier}`);
  }
}