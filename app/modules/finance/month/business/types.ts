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
  amount: number;
  month: string;
  reference_month: number;
  reference_year: number;
  received_at?: string;
}

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