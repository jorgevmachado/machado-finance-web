import { fireEvent, render, screen } from '@testing-library/react';

import BodyAction from './BodyAction';
import type { TableActionsItem } from './types';

describe('BodyAction.tsx', () => {
  const mockAction = jest.fn();
  const parentClick = jest.fn();
  const testItem = { id: '1', name: 'Test Item' };

  const actionItem: TableActionsItem = {
    label: 'View Item',
    onClick: mockAction,
  };

  beforeEach(() => {
    mockAction.mockClear();
    parentClick.mockClear();
  });

  it('renders as button with aria-label and icon', () => {
    const { container } = render(
      <BodyAction type="show" item={testItem} action={actionItem} />
    );

    const button = screen.getByRole('button', { name: 'View Item' });
    expect(button).toHaveAttribute('type', 'button');
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('applies show/edit/delete color classes by action type', () => {
    const { rerender } = render(
      <BodyAction type="show" item={testItem} action={actionItem} />
    );

    let button = screen.getByRole('button', { name: 'View Item' });
    expect(button).toHaveClass('text-sky-700');
    expect(button).toHaveClass('hover:bg-sky-50');

    rerender(<BodyAction type="edit" item={testItem} action={actionItem} />);
    button = screen.getByRole('button', { name: 'View Item' });
    expect(button).toHaveClass('text-amber-700');
    expect(button).toHaveClass('hover:bg-amber-50');

    rerender(<BodyAction type="delete" item={testItem} action={actionItem} />);
    button = screen.getByRole('button', { name: 'View Item' });
    expect(button).toHaveClass('text-red-700');
    expect(button).toHaveClass('hover:bg-red-50');
  });

  it('calls onClick with item and stops propagation', () => {
    render(
      <div onClick={parentClick}>
        <BodyAction type="show" item={testItem} action={actionItem} />
      </div>
    );

    fireEvent.click(screen.getByRole('button', { name: 'View Item' }));
    expect(mockAction).toHaveBeenCalledWith(testItem);
    expect(parentClick).not.toHaveBeenCalled();
  });

  it('updates callback when action prop changes', () => {
    const firstAction = jest.fn();
    const secondAction = jest.fn();
    const firstActionItem: TableActionsItem = { label: 'First', onClick: firstAction };
    const secondActionItem: TableActionsItem = { label: 'Second', onClick: secondAction };

    const { rerender } = render(
      <BodyAction type="show" item={testItem} action={firstActionItem} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'First' }));
    rerender(<BodyAction type="show" item={testItem} action={secondActionItem} />);
    fireEvent.click(screen.getByRole('button', { name: 'Second' }));

    expect(firstAction).toHaveBeenCalledWith(testItem);
    expect(secondAction).toHaveBeenCalledWith(testItem);
  });
});
