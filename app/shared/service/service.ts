import { Http ,type MessageResponse, type TPaginatedListResponse } from '../http';

export abstract class BaseServiceAbstract<T, C, U> extends Http {
  readonly pathUrl: string;

  protected constructor(
    baseUrl: string ,
    pathUrl: string ,
    token?: string ,
  ) {
    const headers: Record<string ,string> = token ? {
      Authorization: `Bearer ${ token }` ,
    } : {};
    super(baseUrl ,{ headers });
    this.pathUrl = pathUrl;
  }

  async list(params?: Record<string, unknown>): Promise<TPaginatedListResponse<T> | Array<T>> {
    const config = !params ? {} : { params };
    return this.get<TPaginatedListResponse<T> | Array<T>>(this.pathUrl ,config);
  }

  public async detail(identifier: string, params?: Record<string, unknown>): Promise<T> {
    const config = !params ? {} : { params };
    return await this.get<T>(`${this.pathUrl}/${identifier}`, config);
  }

  public async create(payload: C): Promise<T> {
    return await this.post<C, T>(this.pathUrl ,{ body: payload });
  }

  public async update(param: string, payload: U): Promise<T> {
    return await this.path<U, T>(`${this.pathUrl}/${param}` ,{ body: payload });
  }

  public async delete(param: string): Promise<MessageResponse> {
    return await this.remove<MessageResponse>(`${this.pathUrl}/${param}`);
  }

}
