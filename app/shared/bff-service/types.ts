import type { TPaginatedListResponse, RequestConfig } from '@/app/shared';

export type TBffDataListResponse<T> = Array<T> | TPaginatedListResponse<T>;

type TBffResponseI18n = {
  i18nMessageError: string;
  i18nMessageSuccess: string;
}

export type TBffResponse<T> = TBffResponseI18n & {
  data?: T;
  error: boolean;
  status: number;
  message: string;
};

export type TBffGetParams = Partial<TBffResponseI18n> & {
  param?: string;
  config?: Omit<RequestConfig, 'body'>;
  queryString?: string;
}

export type TBffPathParams<B> = Partial<TBffResponseI18n> & {
  param: string;
  config?: RequestConfig<B>;
}

export type TBffPostParams<B> = Omit<TBffPathParams<B>, 'param'> & {
  param?: string;
};

export type TBffRemoveParams = Omit<TBffGetParams, 'queryString'>;

export type TBffDeleteParams = Partial<TBffResponseI18n> & {
  identifier: string;
}

export type TBffCreateParams<C> = Partial<TBffResponseI18n> & {
  payload: C;
}

export type TBffUpdateParams<U> = Partial<TBffResponseI18n> & {
  payload: U;
  identifier: string;
}

export type TBffDetailParams = Partial<TBffResponseI18n> & {
  identifier: string;
  queryString?: string;
}

export type TBffListParams<F> = Partial<TBffResponseI18n> & {
  filters: F;
}

export type TBffListPaginateParams<F> = TBffListParams<F> & {
  page: number;
  perPage?: number;
}