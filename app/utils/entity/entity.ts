export function validateDateAt(dateString?: string): Date | undefined {
  if (!dateString) {
    return;
  }

  const parsedDate = new Date(dateString);

  if (!isNaN(parsedDate.getTime())) {
    return parsedDate;
  }

  return;
}

export function validateCreatedAt(dateString?: string): Date {
  const dateAt = validateDateAt(dateString);
  if (dateAt) {
    return dateAt;
  }
  return new Date();
}

export function validateValue(
  value?: string | number,
  type: 'string' | 'number' = 'string',
  defaultValue?: number | string
): number | string {
  const functionDefaultValue = 'unknown';
  if (type === 'string') {
    const currentDefaultValue = typeof defaultValue === 'string' ? defaultValue : functionDefaultValue;
    if (!value || typeof value !== 'string') {
      return currentDefaultValue;
    }
    return value;
  }

  if (type === 'number') {
    const currentDefaultValue = typeof defaultValue === 'number' ? defaultValue : 0;
    if (!value || typeof value !== 'number') {
      return currentDefaultValue;
    }
    return value;
  }

  return functionDefaultValue;
  
}

export function validateBasicEntity<T>(entity: Record<string, unknown>): T {
  const id = validateValue(entity?.['id'] as string | undefined, 'string') as string;
  const created_at = validateCreatedAt(entity?.['created_at'] as string | undefined) as Date;
  const updated_at = validateDateAt(entity?.['updated_at'] as string | undefined) as Date | undefined;
  const deleted_at = validateDateAt(entity?.['deleted_at'] as string | undefined) as Date | undefined;

  return {
    id,
    created_at,
    updated_at,
    deleted_at
  } as T;
}
