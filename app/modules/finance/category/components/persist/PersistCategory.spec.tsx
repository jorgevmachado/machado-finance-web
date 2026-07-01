import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockStartContentLoading = jest.fn();
const mockStopContentLoading = jest.fn();
const mockValidateCreatePayload = jest.fn();
const mockValidateUpdatePayload = jest.fn();

jest.mock('@/app/shared', () => ({
  createI18nMessage: (key: string) => `i18n:${key}`,
  translateI18nMessage: (_t: (key: string) => string, message?: string) =>
    message,
  useAppTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@/app/modules/finance', () => ({
  financeBffService: {
    category: {
      create: (...args: Array<unknown>) => mockCreate(...args),
      update: (...args: Array<unknown>) => mockUpdate(...args),
    },
  },
}));

jest.mock('@/app/ds', () => ({
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Input: ({
    id,
    label,
    value,
    disabled,
    onValueChange,
    placeholder,
  }: {
    id: string;
    label: string;
    value: string;
    disabled?: boolean;
    placeholder?: string;
    onValueChange: (nextValue: string) => void;
  }) => (
    <label htmlFor={id}>
      {label}
      <input
        id={id}
        aria-label={label}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onValueChange(event.target.value)}
      />
    </label>
  ),
  Select: ({
    label,
    value,
    options,
    disabled,
    onValueChange,
  }: {
    label: string;
    value: string;
    options: Array<{ key: string; value: string; label: string }>;
    disabled?: boolean;
    onValueChange: (nextValue: string) => void;
  }) => (
    <label>
      {label}
      <select
        aria-label={label}
        value={value}
        disabled={disabled}
        onChange={(event) => onValueChange(event.target.value)}
      >
        <option value="">--</option>
        {options.map((option) => (
          <option key={option.key} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  ),
  Button: ({
    children,
    onClick,
    type = 'button',
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
  }) => (
    <button type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ),
  useLoading: () => ({
    startContentLoading: (...args: Array<unknown>) =>
      mockStartContentLoading(...args),
    stopContentLoading: (...args: Array<unknown>) =>
      mockStopContentLoading(...args),
  }),
}));

jest.mock('../../validation', () => ({
  CATEGORY_DEFAULT_CREATE_ERROR_MESSAGE: 'i18n:category.errors.defaultCreate',
  CATEGORY_DEFAULT_UPDATE_ERROR_MESSAGE: 'i18n:category.errors.defaultUpdate',
  validateCreatePayload: (...args: Array<unknown>) =>
    mockValidateCreatePayload(...args),
  validateUpdatePayload: (...args: Array<unknown>) =>
    mockValidateUpdatePayload(...args),
}));

import PersistCategory from './PersistCategory';

describe('PersistCategory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockValidateCreatePayload.mockReturnValue(null);
    mockValidateUpdatePayload.mockReturnValue(null);
  });

  it('renders create mode and submits successfully', async () => {
    const onClose = jest.fn();
    mockCreate.mockResolvedValue({
      error: false,
      status: 200,
      message: 'OK',
      i18nMessageError: 'i18n:error',
      i18nMessageSuccess: 'i18n:success',
    });

    render(<PersistCategory onClose={onClose} />);

    fireEvent.change(screen.getByLabelText('form.nameLabel'), {
      target: { value: 'Food' },
    });
    fireEvent.change(screen.getByLabelText('form.typeLabel'), {
      target: { value: 'FOOD' },
    });
    fireEvent.change(screen.getByLabelText('form.descriptionLabel'), {
      target: { value: 'Food category' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'form.submit' }));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        payload: {
          name: 'Food',
          type: 'FOOD',
          description: 'Food category',
        },
      });
    });
    await waitFor(() => {
      expect(onClose).toHaveBeenCalledWith({
        type: 'create',
        status: 'success',
        message: 'i18n:category.messages.created',
      });
    });
  });

  it('shows validation error when create payload is invalid', async () => {
    const onClose = jest.fn();
    mockValidateCreatePayload.mockReturnValue({
      type: 'other',
      status: 'error',
      message: 'i18n:category.errors.invalidName',
    });

    render(<PersistCategory onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'form.submit' }));

    await waitFor(() => {
      expect(
        screen.getByText('i18n:category.errors.invalidName'),
      ).toBeInTheDocument();
    });
    expect(mockCreate).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledWith({
      type: 'other',
      status: 'error',
      message: 'i18n:category.errors.invalidName',
    });
  });

  it('handles create API error response', async () => {
    const onClose = jest.fn();
    mockCreate.mockResolvedValue({
      error: true,
      status: 400,
      message: 'create failed',
      i18nMessageError: 'i18n:category.errors.create',
      i18nMessageSuccess: 'ok',
    });

    render(<PersistCategory onClose={onClose} />);

    fireEvent.change(screen.getByLabelText('form.nameLabel'), {
      target: { value: 'Food' },
    });
    fireEvent.change(screen.getByLabelText('form.typeLabel'), {
      target: { value: 'FOOD' },
    });
    fireEvent.change(screen.getByLabelText('form.descriptionLabel'), {
      target: { value: 'Food category' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'form.submit' }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledWith({
        type: 'create',
        status: 'error',
        message: 'i18n:category.errors.create',
      });
    });
  });

  it('falls back to default create error message when API error has no messages', async () => {
    const onClose = jest.fn();
    mockCreate.mockResolvedValue({
      error: true,
      status: 400,
      message: '',
      i18nMessageError: '',
      i18nMessageSuccess: 'ok',
    });

    render(<PersistCategory onClose={onClose} />);

    fireEvent.change(screen.getByLabelText('form.nameLabel'), {
      target: { value: 'Food' },
    });
    fireEvent.change(screen.getByLabelText('form.typeLabel'), {
      target: { value: 'FOOD' },
    });
    fireEvent.change(screen.getByLabelText('form.descriptionLabel'), {
      target: { value: 'Food category' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'form.submit' }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledWith({
        type: 'create',
        status: 'error',
        message: 'i18n:category.errors.defaultCreate',
      });
    });
  });

  it('shows update success without API call when no fields changed', async () => {
    const onClose = jest.fn();
    const category = {
      id: '1',
      name: 'Food',
      type: 'FOOD',
      description: 'Food category',
    };

    render(<PersistCategory onClose={onClose} category={category as never} />);

    fireEvent.click(screen.getByRole('button', { name: 'form.save' }));

    await waitFor(() => {
      expect(mockUpdate).not.toHaveBeenCalled();
    });
    expect(onClose).toHaveBeenCalledWith({
      type: 'update',
      status: 'success',
      message: 'i18n:category.messages.updated',
    });
  });

  it('shows update error when API responds with error', async () => {
    const onClose = jest.fn();
    const category = {
      id: '1',
      name: 'Food',
      type: 'FOOD',
      description: 'Food category',
    };
    mockUpdate.mockResolvedValue({
      error: true,
      status: 400,
      message: 'update failed',
      i18nMessageError: 'i18n:category.errors.update',
      i18nMessageSuccess: 'ok',
    });

    render(<PersistCategory onClose={onClose} category={category as never} />);

    fireEvent.change(screen.getByLabelText('form.nameLabel'), {
      target: { value: 'Food Updated' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'form.save' }));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith({
        identifier: '1',
        payload: {
          name: 'Food Updated',
        },
      });
    });
    await waitFor(() => {
      expect(onClose).toHaveBeenCalledWith({
        type: 'update',
        status: 'error',
        message: 'i18n:category.errors.update',
      });
    });
  });

  it('falls back to default update error message when API error has no messages', async () => {
    const onClose = jest.fn();
    const category = {
      id: '1',
      name: 'Food',
      type: 'FOOD',
      description: 'Food category',
    };
    mockUpdate.mockResolvedValue({
      error: true,
      status: 400,
      message: '',
      i18nMessageError: '',
      i18nMessageSuccess: 'ok',
    });

    render(<PersistCategory onClose={onClose} category={category as never} />);

    fireEvent.change(screen.getByLabelText('form.nameLabel'), {
      target: { value: 'Food Updated' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'form.save' }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledWith({
        type: 'update',
        status: 'error',
        message: 'i18n:category.errors.defaultUpdate',
      });
    });
  });

  it('uses default create error when API throws without response message', async () => {
    const onClose = jest.fn();
    mockCreate.mockRejectedValue(new Error('network'));

    render(<PersistCategory onClose={onClose} />);

    fireEvent.change(screen.getByLabelText('form.nameLabel'), {
      target: { value: 'Food' },
    });
    fireEvent.change(screen.getByLabelText('form.typeLabel'), {
      target: { value: 'FOOD' },
    });
    fireEvent.change(screen.getByLabelText('form.descriptionLabel'), {
      target: { value: 'Food category' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'form.submit' }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledWith({
        type: 'other',
        status: 'error',
        message: 'network',
      });
    });
  });

  it('handles update validation error before calling API', async () => {
    const onClose = jest.fn();
    const category = {
      id: '1',
      name: 'Food',
      type: 'FOOD',
      description: 'Food category',
    };
    mockValidateUpdatePayload.mockReturnValue({
      type: 'other',
      status: 'error',
      message: 'i18n:category.errors.invalidName',
    });

    render(<PersistCategory onClose={onClose} category={category as never} />);

    fireEvent.change(screen.getByLabelText('form.nameLabel'), {
      target: { value: 'ab' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'form.save' }));

    await waitFor(() => {
      expect(mockUpdate).not.toHaveBeenCalled();
    });
    expect(onClose).toHaveBeenCalledWith({
      type: 'other',
      status: 'error',
      message: 'i18n:category.errors.invalidName',
    });
  });

  it('handles update API throw path', async () => {
    const onClose = jest.fn();
    const category = {
      id: '1',
      name: 'Food',
      type: 'FOOD',
      description: 'Food category',
    };
    mockUpdate.mockRejectedValue(new Error('network'));

    render(<PersistCategory onClose={onClose} category={category as never} />);

    fireEvent.change(screen.getByLabelText('form.nameLabel'), {
      target: { value: 'Food Updated' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'form.save' }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledWith({
        type: 'other',
        status: 'error',
        message: 'network',
      });
    });
  });

  it('sends changed type and description on update', async () => {
    const onClose = jest.fn();
    const category = {
      id: '1',
      name: 'Food',
      type: 'FOOD',
      description: 'Food category',
    };
    mockUpdate.mockResolvedValue({
      error: false,
      status: 200,
      message: 'OK',
      i18nMessageError: 'x',
      i18nMessageSuccess: 'y',
    });

    render(<PersistCategory onClose={onClose} category={category as never} />);

    fireEvent.change(screen.getByLabelText('form.typeLabel'), {
      target: { value: 'OTHER' },
    });
    fireEvent.change(screen.getByLabelText('form.descriptionLabel'), {
      target: { value: 'Other category' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'form.save' }));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith({
        identifier: '1',
        payload: {
          type: 'OTHER',
          description: 'Other category',
        },
      });
    });
  });

  it('renders disabled mode and closes with cancel state', async () => {
    const onClose = jest.fn();

    render(<PersistCategory onClose={onClose} disabled />);

    expect(screen.queryByText('category.form.subtitle')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'form.close' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'form.close' }));

    expect(onClose).toHaveBeenCalledWith({
      status: 'cancel',
      type: 'other',
      message: '',
    });
  });

  it('does not submit when disabled is true', () => {
    const onClose = jest.fn();

    render(<PersistCategory onClose={onClose} disabled />);

    fireEvent.submit(screen.getByRole('button', { name: 'form.close' }).closest('form') as HTMLFormElement);

    expect(mockCreate).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('handles cancel button in enabled mode', () => {
    const onClose = jest.fn();

    render(<PersistCategory onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'form.cancel' }));

    expect(onClose).toHaveBeenCalledWith({
      status: 'cancel',
      type: 'other',
      message: '',
    });
  });
});
