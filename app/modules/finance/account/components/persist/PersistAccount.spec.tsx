import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import React from 'react';

const translate = (key: string) => key;

jest.mock('@/app/shared', () => ({
  ...jest.requireActual('@/app/shared'),
  useAppTranslation: () => ({
    t: translate,
    locale: 'pt-BR',
  }),
  translateI18nMessage: (_t: unknown, message: string) => message,
}));

jest.mock('@/app/ds', () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: ReactNode;
    onClick?: () => void;
  }) => <button type='button' onClick={onClick}>{children}</button>,
  Card: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Text: ({ children }: { children: ReactNode }) => <span>{children}</span>,
  Input: ({
    label,
    value,
    onValueChange,
  }: {
    label: string;
    value?: string;
    onValueChange?: (value: string) => void;
  }) => (
    <label>
      {label}
      <input
        aria-label={label}
        value={value ?? ''}
        onChange={(event) => onValueChange?.(event.target.value)}
      />
    </label>
  ),
  Select: ({
    label,
    value,
    options = [],
    onValueChange,
  }: {
    label: string;
    value?: string;
    options?: Array<{ value: string; label?: string }>;
    onValueChange?: (value: string) => void;
  }) => (
    <label>
      {label}
      <select
        aria-label={label}
        value={value ?? ''}
        onChange={(event) => onValueChange?.(event.target.value)}
      >
        <option value=''>none</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label ?? option.value}
          </option>
        ))}
      </select>
    </label>
  ),
}));

import PersistAccount from './PersistAccount';

describe('PersistAccount', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders enabled mode and updates draft inputs', () => {
    render(<PersistAccount onClose={jest.fn()} />);

    expect(screen.getByText('account.form.subtitle')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'form.cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'form.submit' })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('form.nameLabel'), {
      target: { value: 'Main Account' },
    });
    fireEvent.change(screen.getByLabelText('form.typeLabel'), {
      target: { value: 'BANK' },
    });
    fireEvent.change(screen.getByLabelText('account.form.label.initial_balance'), {
      target: { value: '1200' },
    });

    expect(screen.getByLabelText('form.nameLabel')).toHaveValue('Main Account');
    expect(screen.getByLabelText('form.typeLabel')).toHaveValue('BANK');
    expect(screen.getByLabelText('account.form.label.initial_balance')).toHaveValue('1200');
  });

  it('renders disabled mode with close action', () => {
    const onClose = jest.fn();

    render(<PersistAccount onClose={onClose} disabled />);

    expect(screen.queryByText('account.form.subtitle')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'form.close' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'form.cancel' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'form.close' }));

    expect(onClose).toHaveBeenCalledWith({
      status: 'cancel',
      type: 'other',
      message: '',
    });
  });

  it('uses save label when editing an existing account', () => {
    render(
      <PersistAccount
        onClose={jest.fn()}
        account={{
          id: 'acc-1',
          name: 'Account 1',
          type: 'BANK',
          is_active: true,
          finance_id: 'fin-1',
          initial_balance: 100,
          current_balance: 100,
          created_at: new Date('2026-01-01T00:00:00.000Z'),
        }}
      />,
    );

    expect(screen.getByRole('button', { name: 'form.save' })).toBeInTheDocument();
  });

  it('triggers cancel in enabled mode', () => {
    const onClose = jest.fn();

    render(<PersistAccount onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'form.cancel' }));

    expect(onClose).toHaveBeenCalledWith({
      status: 'cancel',
      type: 'other',
      message: '',
    });
  });

  it('notifies parent when internal state is non-idle', () => {
    const onClose = jest.fn();
    const realUseState = React.useState;
    const setStateMock = jest.fn();

    jest.spyOn(React, 'useState')
      .mockImplementationOnce(() =>
        [
          { status: 'error', type: 'create', message: 'account.error' },
          setStateMock,
        ] as unknown as ReturnType<typeof realUseState>
      )
      .mockImplementation(realUseState);

    render(<PersistAccount onClose={onClose} />);

    expect(onClose).toHaveBeenCalledWith({
      status: 'error',
      type: 'create',
      message: 'account.error',
    });
  });
});
