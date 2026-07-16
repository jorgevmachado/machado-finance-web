export function toSnakeCase(value?: string): string {
  if (!value) {
    return '';
  }

  const matches = value.match(/[A-Z]{2,}(?=[A-Z][a-z]+\d*|\b)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g);

  if (!matches) {
    return value;
  }

  return matches.map((word) => word.toLowerCase()).join('_');
}