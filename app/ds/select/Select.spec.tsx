import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

jest.mock('@/app/ds', () => ({
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

import Select from './index';

describe('<Select />', () => {
  const options = [
    { value: 'FOOD', label: 'Food' },
    { value: 'OTHER', label: 'Other' },
  ] as const;

  it('renders label and helper text', () => {
    render(
      <Select
        label="Category type"
        helperText="Pick one option"
        name="type"
        value=""
        options={[...options]}
      />,
    );

    expect(screen.getByText('Category type')).toBeInTheDocument();
    expect(screen.getByText('Pick one option')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('opens options and calls onValueChange when selecting', () => {
    const onValueChange = jest.fn();

    render(
      <Select
        name="type"
        value=""
        options={[...options]}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.mouseDown(screen.getByRole('option', { name: 'Food' }));

    expect(onValueChange).toHaveBeenCalledWith('FOOD', expect.any(Object));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('renders selected option label and keeps full width class', () => {
    render(
      <Select
        name="type"
        value="OTHER"
        options={[...options]}
      />,
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveClass('w-full');
  });

  it('does not select disabled option', () => {
    const onValueChange = jest.fn();

    render(
      <Select
        name="type"
        value=""
        options={[
          { value: 'FOOD', label: 'Food', disabled: true },
          { value: 'OTHER', label: 'Other' },
        ]}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.mouseDown(screen.getByRole('option', { name: 'Food' }));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('wires native select with name, required and value', () => {
    const { container } = render(
      <Select
        name="type"
        value="OTHER"
        required
        options={[...options]}
      />,
    );

    const nativeSelect = container.querySelector('select[name="type"]');
    expect(nativeSelect).toBeInTheDocument();
    expect(nativeSelect).toBeRequired();
    expect(nativeSelect).toHaveValue('OTHER');
  });

  it('renders disabled state when select is disabled', () => {
    const { container } = render(
      <Select
        name="type"
        value=""
        disabled
        options={[...options]}
      />,
    );

    expect(screen.getByRole('button')).toBeDisabled();
    expect(container.querySelector('select[name="type"]')).toBeDisabled();
  });

  it('marks the selected option when the menu opens', () => {
    render(
      <Select
        name="type"
        value="OTHER"
        options={[...options]}
      />,
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('option', { name: 'Other' })).toHaveClass('bg-blue-50');
  });

  it('closes after blur and syncs the native select value', () => {
    jest.useFakeTimers();

    try {
      const { container } = render(
        <Select
          name="type"
          value=""
          options={[...options]}
        />,
      );

      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.blur(screen.getByRole('button'));
      act(() => {
        jest.advanceTimersByTime(120);
      });

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

      const nativeSelect = container.querySelector('select[name="type"]');
      expect(nativeSelect).toBeInTheDocument();

      fireEvent.change(nativeSelect as HTMLSelectElement, {
        target: { value: 'OTHER' },
      });
    } finally {
      jest.useRealTimers();
    }
  });
});
