import {
  buildQueryString ,
  Http ,MessageResponse ,
  ResponseError ,
  type TPaginatedListResponse ,
} from '../../http';
import { ActionState } from '../../actions';
import { IValidator } from '../../validator';
import {
  TBffResponse ,
  TBffDataListResponse ,
  TBffListPaginateParams,
} from './types';

export abstract class BffBaseServiceAbstract<T, TCreate, TUpdate, TDraft, TFilter> extends Http {
  readonly i18nKey: string;
  readonly baseUrl: string;
  readonly pathUrl: string;
  private readonly validator: IValidator<T, TDraft, TCreate, TUpdate>;

  protected constructor(
    i18nKey: string,
    pathUrl: string,
    validator: IValidator<T, TDraft, TCreate, TUpdate>,
    baseUrl: string = '/api'
  ) {
    const currentBaseUrl = baseUrl.startsWith('/api') ? baseUrl : `/api/${baseUrl}`;
    super(currentBaseUrl, {});
    this.i18nKey = i18nKey;
    this.validator = validator;
    this.pathUrl = pathUrl;
    this.baseUrl = currentBaseUrl;
  }

  public isResponseError = <T>(response: TBffDataListResponse<T> | ResponseError | T): response is ResponseError => {
    return Boolean(response && typeof response === 'object' && 'statusCode' in response);
  };

  private validateResponse<T>(response: TBffDataListResponse<T> | ResponseError | T, key: string): TBffResponse<T> {
    if (this.isResponseError(response)) {
      return {
        error: true,
        status: response.statusCode,
        message: `${this.i18nKey}.messages.error.${key}`,
        responseMessage: response.message,
      };
    }
    return {
      data: response as T,
      error: false,
      status: 200,
      message: `${this.i18nKey}.messages.success.${key}`,
      responseMessage: 'Ok',
    };
  }

  private validatorErro(validation: ActionState): TBffResponse<T> {
    return {
      error: true,
      status: 400,
      message: validation.message,
      responseMessage: validation.message,
    };
  };

  private mountPath(param?: string, queryString?: string): string {
    const currentParam = param?.startsWith('/') ? param?.substring(1) : param;
    const pathParam = currentParam ? `${this.pathUrl}/${currentParam}` : this.pathUrl;
    return  queryString && queryString !== '' ? `${pathParam}?${queryString}` : pathParam;
  }

  async list(filters: TFilter): Promise<TBffResponse<Array<T>>> {
    const queryString = buildQueryString<TFilter>(filters);
    const path = this.mountPath(undefined, queryString);
    const response = await this.get<Array<T>>(path);
    return this.validateResponse<Array<T>>(response, 'list');
  }

  async listPaginate({ page, filters, perPage = 12 }: TBffListPaginateParams<TFilter>): Promise<TBffResponse<TPaginatedListResponse<T>>> {
    const queryString = buildQueryString<TFilter>(filters, page, perPage);
    const path = this.mountPath(undefined, queryString);
    const response = await this.get<TPaginatedListResponse<T>>(path);
    return this.validateResponse<TPaginatedListResponse<T>>(response, 'list');
  }

  async detail(param: string, queryString: string): Promise<TBffResponse<T>> {
    const path = this.mountPath(param, queryString);
    const response = await this.get<T>(path);
    return this.validateResponse<T>(response, 'detail');
  }
  
  async create(payload: TDraft): Promise<TBffResponse<T>> {
    const validation = this.validator.validateCreate(payload);

    if (validation) {
      return this.validatorErro(validation);
    }
    const path = this.mountPath();
    const createPayload = this.validator.transformCreate(payload);
    const response = await this.post<TCreate, T>(path, { body: createPayload });
    return this.validateResponse<T>(response, 'create');
  }

  async update(param: string, payload: TDraft): Promise<TBffResponse<T>> {
    const validation = this.validator.validateUpdate(payload);
    if (validation) {
      return this.validatorErro(validation);
    }
    const path = this.mountPath(param);
    const updatePayload = this.validator.transformUpdate(payload);
    const response = await this.path<TUpdate, T>(path, { body: updatePayload });
    return this.validateResponse<T>(response, 'update');
  }

  async delete(param: string): Promise<TBffResponse<MessageResponse>> {
    const path = this.mountPath(param);
    const response = await this.remove<MessageResponse>(path);
    return this.validateResponse<MessageResponse>(response, 'delete');
  }
}