
export type ConditionColor = {
  trueColor: string;
  falseColor: string;
};

export type TTableSort = 'asc' | 'desc' | '';
export type TTableAlign = 'left' | 'right' | 'center';

export type SortedColumn = {
  sort: string;
  order: TTableSort;
}

