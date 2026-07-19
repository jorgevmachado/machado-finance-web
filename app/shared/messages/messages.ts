import type { TMessageType, TMessageStatus } from './types';

export function createMessages(key: string, type: TMessageType , status: TMessageStatus): string {
  return `${key}.messages.${status}.${type}`;
}