export function isObjectEmpty(obj: unknown): boolean {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    return Object.keys(obj).length === 0;
  }
  return false;
}