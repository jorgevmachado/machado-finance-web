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