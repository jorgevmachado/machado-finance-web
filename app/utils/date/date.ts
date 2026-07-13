export function formatDate(date: string | Date): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString();
}

export function formatDateToDateString(date: string | Date): string {
  const dateObj = new Date(date);
  return dateObj.toISOString().split('T')[0];
}