import type { MessageResponse ,TPaginatedListResponse } from '@/app/shared';

export interface IApiService<T, C, U> {
  list(params?: Record<string, unknown>): Promise<TPaginatedListResponse<T> | Array<T>>;
  detail(identifier: string, params?: Record<string, unknown>): Promise<T>;
  create(payload: C): Promise<T>;
  update(param: string, payload: U): Promise<T>;
  delete(param: string): Promise<MessageResponse>;
}