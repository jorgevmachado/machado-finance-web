import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

const startContentLoading = jest.fn();
const stopContentLoading = jest.fn();

jest.mock('@/app/shared', () => ({
  useAppTranslation: () => ({
    t: (key: string) => `translated:${key}`,
  }),
}));

jest.mock('@/app/ds', () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: ReactNode;
    onClick?: () => void;
  }) => (
    <button type='button' onClick={onClick}>
      {children}
    </button>
  ),
  useLoading: () => ({
    startContentLoading,
    stopContentLoading,
  }),
}));

import DeleteEntity from './DeleteEntity';

describe('DeleteEntity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls onClose with cancel state when cancel button is clicked', () => {
    const onClose = jest.fn();

    render(
      <DeleteEntity
        identifier='item-1'
        onClose={onClose}
        fetchDelete={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'translated:form.cancel' }));

    expect(onClose).toHaveBeenCalledWith({
      status: 'cancel',
      type: 'delete',
      message: '',
    });
  });

  it('calls fetchDelete and closes with success state', async () => {
    const onClose = jest.fn();
    const fetchDelete = jest.fn().mockResolvedValue({
      error: false,
      message: 'deleted',
    });

    render(
      <DeleteEntity
        identifier='item-1'
        onClose={onClose}
        fetchDelete={fetchDelete}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'translated:form.delete' }));

    await waitFor(() => {
      expect(fetchDelete).toHaveBeenCalledWith({ identifier: 'item-1' });
      expect(onClose).toHaveBeenCalledWith({
        status: 'success',
        type: 'delete',
        message: 'deleted',
      });
    });
    expect(startContentLoading).toHaveBeenCalledTimes(1);
    expect(stopContentLoading).toHaveBeenCalledTimes(1);
  });

  it('closes with error state when backend response contains error=true', async () => {
    const onClose = jest.fn();
    const fetchDelete = jest.fn().mockResolvedValue({
      error: true,
      message: 'cannot delete',
    });

    render(
      <DeleteEntity
        identifier='item-1'
        onClose={onClose}
        fetchDelete={fetchDelete}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'translated:form.delete' }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledWith({
        status: 'error',
        type: 'delete',
        message: 'cannot delete',
      });
    });
  });

  it('closes with error state when request fails and uses translated default message for non-Error', async () => {
    const onClose = jest.fn();
    const fetchDelete = jest.fn().mockRejectedValue('unexpected');

    render(
      <DeleteEntity
        identifier='item-1'
        onClose={onClose}
        fetchDelete={fetchDelete}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'translated:form.delete' }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledWith({
        status: 'error',
        type: 'delete',
        message: 'translated:error.deletingData',
      });
    });
    expect(stopContentLoading).toHaveBeenCalledTimes(1);
  });

  it('uses thrown Error.message when request rejects with Error instance', async () => {
    const onClose = jest.fn();
    const fetchDelete = jest.fn().mockRejectedValue(new Error('request failed'));

    render(
      <DeleteEntity
        identifier='item-1'
        onClose={onClose}
        fetchDelete={fetchDelete}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'translated:form.delete' }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledWith({
        status: 'error',
        type: 'delete',
        message: 'request failed',
      });
    });
  });
});
