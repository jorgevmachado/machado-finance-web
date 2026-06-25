const DEFAULT_API_BASE_URL = 'http://127.0.0.1:8000';

export function getBaseUrl(): string {
  return process.env.API_BASE_URL ?? DEFAULT_API_BASE_URL;
}

export function formatUrl(url: string, path: string, params?: Record<string, unknown>): string {
  const query = serialize_url(params);
  const filteredUrl = [url, path].filter(Boolean).join('/');

  return query ? `${filteredUrl}?${query}` : filteredUrl;
}

export function serialize_url(value?: Record<string, unknown>): string | undefined {
  if (!value || Object.keys(value).length === 0) {
    return undefined;
  }

  return new URLSearchParams(value as Record<string, string>).toString();
}

export function buildQueryString<TFilters>(filters: TFilters,page?: number, limit?: number): string  {
  const params = new URLSearchParams( page ? {
    page: String(page),
    limit: String(limit),
  } : {});

  Object.entries(filters as Record<string, string | undefined>).forEach(([key, value]) => {
    if (!value) {
      return;
    }

    params.set(key, value);
  });

  return params.toString();
}