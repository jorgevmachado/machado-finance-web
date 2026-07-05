import {
  buildQueryString ,
  Http ,type MessageResponse ,
  ResponseError ,
  type TPaginatedListResponse ,
} from '../http';
import {
  TBffCreateParams ,
  TBffDataListResponse ,TBffDeleteParams ,TBffDetailParams ,
  TBffGetParams ,TBffListPaginateParams ,TBffListParams ,
  TBffPathParams ,TBffPostParams ,TBffRemoveParams ,
  TBffResponse ,TBffUpdateParams ,
} from './types';

export abstract class BffBaseServiceAbstract<T, C, U, F> extends Http {
  readonly baseUrl: string;
  readonly pathUrl: string;
  readonly domain: string;

  protected constructor(
    domain: string,
    pathUrl: string,
    baseUrl: string = '/api'
  ) {
    const currentBaseUrl = baseUrl.startsWith('/api') ? baseUrl : `/api/${baseUrl}`;
    super(currentBaseUrl, {});
    this.domain = domain;
    this.pathUrl = pathUrl;
    this.baseUrl = currentBaseUrl;
  }

  public isResponseError = <T>(response: TBffDataListResponse<T> | ResponseError | T): response is ResponseError => {
    return Boolean(response && typeof response === 'object' && 'statusCode' in response);
  };

  public validateResponse = <T>(
    response: TBffDataListResponse<T> | ResponseError | T,
    i18nMessageSuccess: string,
    i18nMessageError: string,
  ): TBffResponse<T> => {
    if (this.isResponseError(response)) {
      return {
        error: true,
        status: response.statusCode,
        message: response.message,
        i18nMessageSuccess,
        i18nMessageError
      };
    }
    return {
      data: response as T,
      error: false,
      status: 200,
      message: 'OK',
      i18nMessageSuccess,
      i18nMessageError
    };
  };

  public list = async ({
    filters,
    i18nMessageError = `${this.domain}.list.error`,
    i18nMessageSuccess = `${this.domain}.list.success`,
  }: TBffListParams<F>): Promise<TBffResponse<Array<T>>> => {
    return await this.bff_get<Array<T>>({
      queryString: buildQueryString<F>(filters),
      i18nMessageSuccess,
      i18nMessageError
    });
  };

  public list_paginate = async ({
    page,
    filters,
    perPage = 12,
    i18nMessageError = `${this.domain}.list.error`,
    i18nMessageSuccess = `${this.domain}.list.success`,
  }: TBffListPaginateParams<F>): Promise<TBffResponse<TPaginatedListResponse<T>>> => {
    return await this.bff_get<TPaginatedListResponse<T>>({
      queryString: buildQueryString<F>(filters, page, perPage),
      i18nMessageError,
      i18nMessageSuccess,
    });
  };

  public detail = async ({
    identifier,
    queryString,
    i18nMessageError = `${this.domain}.detail.error`,
    i18nMessageSuccess = `${this.domain}.detail.success`,
  }: TBffDetailParams): Promise<TBffResponse<T>> => {
    return await this.bff_get<T>({
      param: identifier,
      queryString,
      i18nMessageError,
      i18nMessageSuccess,
    });
  };

  public update = async ({
    payload,
    identifier,
    i18nMessageError = `${this.domain}.update.error`,
    i18nMessageSuccess = `${this.domain}.update.success`
  }: TBffUpdateParams<U>): Promise<TBffResponse<T>> => {
    return await this.bff_path<U, T>({
      param: identifier,
      config: { body: payload },
      i18nMessageError,
      i18nMessageSuccess
    });
  };

  public create = async ({
    payload,
    i18nMessageError = `${this.domain}.create.error`,
    i18nMessageSuccess = `${this.domain}.create.success`
  }: TBffCreateParams<C>): Promise<TBffResponse<T>> => {
    return await this.bff_post<C, T>({
      config: { body: payload },
      i18nMessageError,
      i18nMessageSuccess
    });
  };

  public delete = async ({
    identifier,
    i18nMessageError = `${this.domain}.delete.error`,
    i18nMessageSuccess = `${this.domain}.delete.success`,
  }: TBffDeleteParams): Promise<TBffResponse<MessageResponse>> => {
    return await this.bff_remove<MessageResponse>({
      param: identifier,
      i18nMessageError,
      i18nMessageSuccess
    });
  };

  public bff_get = async <T>(bffGetParams?: TBffGetParams): Promise<TBffResponse<T>> => {
    const {
      param,
      config,
      queryString,
      i18nMessageError = `${this.domain}.get.error`,
      i18nMessageSuccess = `${this.domain}.get.success`
    } = bffGetParams ?? {};
    const currentParam = param?.startsWith('/') ? param?.substring(1) : param;
    const pathParam = currentParam ? `${this.pathUrl}/${currentParam}` : this.pathUrl;
    const path = queryString && queryString !== '' ? `${pathParam}?${queryString}` : pathParam;
    const response = await this.get<T | TBffDataListResponse<T> | ResponseError>(path, config);
    return this.validateResponse<T>(response, i18nMessageSuccess, i18nMessageError);
  };

  public bff_path = async <B, T = unknown>({
    param,
    config,
    i18nMessageSuccess = `${this.domain}.path.success`,
    i18nMessageError = `${this.domain}.path.error`
  }: TBffPathParams<B>): Promise<TBffResponse<T>> => {
    const pathParam = param.startsWith('/') ? param.substring(1) : param;
    const response = await this.path<B, T>(`${this.pathUrl}/${pathParam}`, config);
    return this.validateResponse<T>(response, i18nMessageSuccess, i18nMessageError);
  };

  public bff_post = async <B, T = unknown>(bffPostParams?:TBffPostParams<B>): Promise<TBffResponse<T>> => {
    const {
      param,
      config,
      i18nMessageSuccess = `${this.domain}.post.success`,
      i18nMessageError = `${this.domain}.post.error`,
    } = bffPostParams ?? {};
    const currentParam = param?.startsWith('/') ? param?.substring(1) : param;
    const path = currentParam ? `${this.pathUrl}/${currentParam}` : this.pathUrl;
    const response = await this.post<B, T>(path, config);
    return this.validateResponse<T>(response, i18nMessageSuccess, i18nMessageError);
  };

  public bff_remove = async <T>(bffRemoveParams?: TBffRemoveParams): Promise<TBffResponse<T>> => {
    const {
      param,
      config,
      i18nMessageSuccess = `${this.domain}.remove.success`,
      i18nMessageError = `${this.domain}.remove.error`,
    } = bffRemoveParams ?? {};
    const currentParam = param?.startsWith('/') ? param?.substring(1) : param;
    const path = currentParam ? `${this.pathUrl}/${currentParam}` : this.pathUrl;
    const response = await this.remove<T>(path, config);
    return this.validateResponse<T>(response, i18nMessageSuccess, i18nMessageError);
  };
}