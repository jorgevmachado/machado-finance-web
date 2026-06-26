export type RequestConfig<B = unknown> = {
  body?: B;
  params?: Record<string, unknown>;
  override?: Omit<RequestInit, 'body' | 'method'>;
};

export type ResponseError = {
  error: string;
  message: string;
  statusCode: number;
};

export type ErrorResponse = {
  detail: string;
};

export type RequestFailure = {
  status: number;
  response: ErrorResponse;
};

export type TBffResponse = {
  error: boolean;
  status: number;
  message: string;
  i18nMessage: string;
};

export type MessageResponse = {
  message: string;
}

export type TPaginatedListResponse<T> = {
  items: Array<T>;
  meta: TPaginatedMeta;
}

export type TPaginatedMeta = {
  total: number;
  limit: number;
  offset: number;
  next_page?: number;
  previous_page?: number;
  total_pages: number;
  current_page: number;
}