import { formatDate ,formatDateToDateString } from './date';

describe('formatDate', () => {
  it('Must return a formatted date', () => {
    expect(formatDate(new Date('2026-07-15T18:37:57.343861Z'))).toEqual('15/07/2026');
  });
});

describe('formatDateToDateString', () => {
  it('Must return a formatDateToDateString date', () => {
    expect(formatDateToDateString(new Date('2026-07-15T18:37:57.343861Z'))).toEqual('2026-07-15');
  });
});