import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import Select from './index';

describe('<Select />', () => {
  const options = [
    { value: 'FOOD', label: 'Food' },
    { value: 'OTHER', label: 'Other' },
  ] as const;

  it('renders label, helper text and options', () => {
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
    expect(screen.getByLabelText('Food')).toBeInTheDocument();
    expect(screen.getByLabelText('Other')).toBeInTheDocument();
  });

  it('calls onValueChange when selecting an option', () => {
    const onValueChange = jest.fn();

    render(
      <Select
        name="type"
        value=""
        options={[...options]}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.click(screen.getByLabelText('Food'));

    expect(onValueChange).toHaveBeenCalledWith('FOOD', expect.any(Object));
  });

  it('marks the matching option as selected', () => {
    render(
      <Select
        name="type"
        value="OTHER"
        options={[...options]}
      />,
    );

    const selectedOption = screen.getByText('Other').closest('label');
    expect(selectedOption).toHaveClass('border-blue-300');
    expect(screen.getByRole('radio', { name: 'Other' })).toBeChecked();
  });

  it('supports case insensitive matching', () => {
    render(
      <Select
        name="type"
        value="food"
        options={[...options]}
        caseSensitive={false}
      />,
    );

    expect(screen.getByRole('radio', { name: 'Food' })).toBeChecked();
  });

  it('applies legend spacing class when helper text is absent', () => {
    render(
      <Select
        label="Category type"
        name="type"
        value=""
        options={[...options]}
      />,
    );

    expect(screen.getByText('Category type')).toHaveClass('mb-2');
  });

  it('applies disabled classes when option is disabled', () => {
    render(
      <Select
        name="type"
        value=""
        options={[
          { value: 'FOOD', label: 'Food', disabled: true },
          { value: 'OTHER', label: 'Other' },
        ]}
      />,
    );

    const disabledOption = screen.getByText('Food').closest('label');

    expect(disabledOption).toHaveClass('cursor-not-allowed');
    expect(disabledOption).toHaveClass('opacity-70');
  });
});
