import { monthBusiness } from '../../month';
import { isObject ,validateBasicEntity } from '@/app/utils';

import { TEntity } from '@/app/modules';

import { TableHeaderItem } from '@/app/ds';
import { ETypeTableHeader } from '@/app/ds/table/header';

type GenerateMovementTableResult = {
  body: Array<Record<string, unknown>>;
  headers: Array<TableHeaderItem>;
}

type GenerateMovementTableProps = {
  align?: TableHeaderItem['align'],
  entities: Array<Record<string, unknown>>,
  sortable?: boolean
  chooseValues?: Array<string>,
  ignoreValues?: Array<string>,
  referenceYear: number,
}

type GenerateTableHeaderProps = {
  body: Array<Record<string, unknown>>,
  align?: TableHeaderItem['align'],
  sortable?: boolean
  chooseValues?: Array<string>,
  ignoreValues?: Array<string>,
}

type BuildTableHeaderItemProps = {
  key: string,
  align?: TableHeaderItem['align'],
  sortable?: boolean
  chooseValues?: Array<string>,
  bodyReferenceValue: unknown,
}

export class MovementBusiness {

  private IGNORE_VALUES: Array<string> = ['id', 'created_at', 'updated_at', 'deleted_at', 'withMonths'];

  private validateValue(value?: string | number, type: string = 'string'): number | string {
    if (!value) {
      return type === 'string' ? 'unknown' : 0;
    }
    return value;
  }

  public generateMovementMap(
    entity: Record<string, unknown>,
    referenceYear: number,
    chooseValues?: Array<string>
  ): Record<string, unknown> {
    const basicEntity = validateBasicEntity<TEntity>(entity);
    const data: Record<string ,unknown> = {
      ...basicEntity,
      withTotal: false,
      withMonths: false
    };
    
    if (chooseValues && chooseValues.length > 0) {
      data['withTotal'] = chooseValues.includes('total');
      chooseValues.forEach((prop) => {
        const splitValue = prop.split('.');
        if (splitValue.length > 1) {
          const [firstProp] = splitValue;
          data[firstProp] = entity?.[firstProp] as Record<string, unknown> | undefined;
          return;
        }
        const value = entity?.[prop] as string | number | undefined;
        data[prop] = this.validateValue(value, typeof value);
      });
    }
    
    const months = entity?.['months'] as Array<Record<string, unknown>> | undefined;
    if (months) {
      const monthMap = monthBusiness.generateMonthMap(months ,referenceYear);
      const withTotal = data['withTotal'] as boolean | undefined;
      if (withTotal) {
        data['total'] = Object.values(monthMap).reduce((accumulator, month) => {
          const monthAmount = month?.['amount'] as number | undefined;
          return accumulator + (monthAmount || 0);
        }, 0);
      }
      return {
        ...monthMap,
        ...data,
        withMonths: true
      };
    }
    return data;
  }

  private getTableHeaderType(value: unknown): ETypeTableHeader {
    if (typeof value === 'number') {
      return ETypeTableHeader.MONEY;
    }
    if (typeof value === 'string') {
      return ETypeTableHeader.STRING;
    }
    return ETypeTableHeader.STRING;
  }

  public buildTableHeaderItem({
    key,
    align,
    sortable,
    chooseValues,
    bodyReferenceValue
  }: BuildTableHeaderItemProps): TableHeaderItem | undefined {
    if (isObject(bodyReferenceValue)) {
      if (!chooseValues || chooseValues.length === 0) {
        return;
      }
      const [firstKey] =  key.split('.');
      const chooseValue = chooseValues?.find((value) => {
        const splitValue = value.split('.');
        if (splitValue.length > 1) {
          const [firstProp] = splitValue;
          return firstProp === firstKey;
        }
        return value === firstKey;
      });
      if (chooseValue) {
        return {
          value: chooseValue,
          type: this.getTableHeaderType(bodyReferenceValue),
          label: chooseValue,
          align,
          sortable
        };
      }
      return;
    }
    
    if (!chooseValues) {
      return {
        value: key,
        type: this.getTableHeaderType(bodyReferenceValue),
        label: key,
        align,
        sortable
      };
    }

    const hasChooseValues = chooseValues?.includes(key);

    if (hasChooseValues) {
      return {
        value: key,
        type: this.getTableHeaderType(bodyReferenceValue),
        label: key,
        align,
        sortable
      };
    }
    
    return;
  }
  

  public generateTableHeader({
    body,
    align,
    sortable,
    ignoreValues = this.IGNORE_VALUES,
    chooseValues,
  }: GenerateTableHeaderProps): Array<TableHeaderItem> {
    const headers: Array<TableHeaderItem> = [];
    const bodyReference = body[0];
    const bodyKeys = Object.keys(bodyReference);

    const bodyKeysIgnoredValues = bodyKeys.filter((key) => !ignoreValues.includes(key));

    bodyKeysIgnoredValues.forEach((key) => {
      const bodyReferenceValue = bodyReference[key];
      const header = this.buildTableHeaderItem({
        key,
        align,
        sortable,
        chooseValues,
        bodyReferenceValue
      });

      if (!header) {
        return;
      }

      headers.push(header);
    });

    const hasMonths = body.some((item) => item?.['withMonths'] === true);
    if (hasMonths) {

      headers.push(...monthBusiness.generateTableHeaderMonths(align, sortable));
      const totalHeader = headers.find((header) => header.value === 'total');
      if (totalHeader) {
        headers.splice(headers.indexOf(totalHeader), 1);
        headers.push(totalHeader);
      }

    }

    return headers;
  }

  public generateMovementTable({
    align,
    entities,
    sortable,
    chooseValues,
    ignoreValues,
    referenceYear
  }: GenerateMovementTableProps): GenerateMovementTableResult {
    const body = entities.map((entity) => this.generateMovementMap(entity, referenceYear, chooseValues));
    const headers = this.generateTableHeader({ body, chooseValues, ignoreValues, align, sortable });
    return {
      body,
      headers
    };
  }
}