import type { TMessageType, TMessageStatus } from './types';

export function createActionMessages(key: string, type: TMessageType , status: TMessageStatus): string {
  return `${key}.messages.${status}.${type}`;
}