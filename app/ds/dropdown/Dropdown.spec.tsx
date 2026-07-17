import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import Dropdown from './index';

describe('<Dropdown />', () => {
  it('opens the menu, renders icons, and runs the selected action', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(
      <Dropdown
        items={[
          {
            label: 'Edit',
            onClick: onEdit,
            icon: <span data-testid='left-icon'>L</span>,
          },
          {
            label: 'Delete',
            onClick: onDelete,
            disabled: true,
            icon: <span data-testid='right-icon'>R</span>,
            iconPosition: 'right',
          },
          {
            label: 'Plain',
            onClick: jest.fn(),
          },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('menu')).toHaveClass('right-0');
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeDisabled();

    const editItem = screen.getByRole('menuitem', { name: 'Edit' });
    fireEvent.mouseDown(editItem);
    fireEvent.click(editItem);

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('aligns left and closes on outside click', () => {
    render(
      <Dropdown
        align='left'
        items={[
          {
            label: 'Action',
            onClick: jest.fn(),
          },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('menu')).toHaveClass('left-0');

    fireEvent.mouseDown(document.body);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
