export type TMonthKey =
  | 'january'
  | 'february'
  | 'march'
  | 'april'
  | 'may'
  | 'june'
  | 'july'
  | 'august'
  | 'september'
  | 'october'
  | 'november'
  | 'december';

export type TMonthSummary = {
  id?: string;
  month: string;
  amount: number;
  paid_at?: Date;
  received_at?: string;
  reference_year: number;
  reference_month: number;
}

export type TMonthMap = Record<TMonthKey, TMonthSummary>;

// export type TFinanceYearSummaryBase = {
//   id?: string;
//   source: string;
//   source_code: string;
//   finance_id: string;
//   account_id: string;
//   description: string;
//   reference_year: number;
//   total: number;
//   months: Array<TFinanceMonthSummary>;
// }
//
// export type TFinanceMonthMap = Record<TFinanceMonthKey, TFinanceMonthSummary>;
//
// export type TFinanceYearSummary = TFinanceYearSummaryBase & TFinanceMonthMap;
//
// export type TFinanceAccumulator = TFinanceYearSummaryBase;