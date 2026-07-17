import type { TPaginatedListResponse } from '../../http';

export type TBffResponse<T> =  {
  data?: T;
  error: boolean;
  status: number;
  message: string;
  responseMessage: string;

};

export type TBffDataListResponse<T> = Array<T> | TPaginatedListResponse<T>;

export type TBffListParams<F> = {
  filters: F;
}

export type TBffListPaginateParams<F> = TBffListParams<F> & {
  page: number;
  perPage?: number;
}