import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { MdSearch } from 'react-icons/md';

jest.mock('@/app/ds', () => ({
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

import Input from './index';

describe('<Input />', () => {
  it('renders with value and placeholder', () => {
    render(
      <Input
        value='pikachu'
        onChange={() => undefined}
        placeholder='Search pokemon'
      />,
    );

    expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search pokemon')).toBeInTheDocument();
  });

  it('calls onValueChange with typed value', () => {
    const onValueChange = jest.fn();

    render(
      <Input
        value=''
        onChange={() => undefined}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'charizard' },
    });

    expect(onValueChange).toHaveBeenCalledWith('charizard', expect.any(Object));
  });

  it('applies string mask and emits masked value', () => {
    const onValueChange = jest.fn();

    render(
      <Input
        value=''
        onChange={() => undefined}
        onValueChange={onValueChange}
        mask='###.###.###-##'
      />,
    );

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '12345678901' },
    });

    expect(onValueChange).toHaveBeenCalledWith('123.456.789-01', expect.any(Object));
  });

  it('formats money input with BRL when switchLanguage is pt-BR', () => {
    render(
      <Input
        type='money'
        switchLanguage='pt-BR'
        value='123456'
        onChange={() => undefined}
      />,
    );

    const textbox = screen.getByRole('textbox');
    expect(textbox).toHaveValue('R$ 1.234,56');
    expect(textbox).toHaveAttribute('type', 'text');
  });

  it('defaults money locale mapping when switchLanguage is undefined', () => {
    render(
      <Input
        type='money'
        switchLanguage={undefined}
        value='123456'
        onChange={() => undefined}
      />,
    );

    expect(screen.getByRole('textbox')).toHaveValue('R$ 1.234,56');
  });

  it('formats money input with USD when switchLanguage is en', () => {
    render(
      <Input
        type='money'
        switchLanguage='en'
        value='123456'
        onChange={() => undefined}
      />,
    );

    expect(screen.getByRole('textbox')).toHaveValue('$1,234.56');
  });

  it('formats money input with EUR when switchLanguage is es', () => {
    render(
      <Input
        type='money'
        switchLanguage='es'
        value='123456'
        onChange={() => undefined}
      />,
    );

    expect(screen.getByRole('textbox')).toHaveValue('1234,56 €');
  });

  it('falls back to BRL when switchLanguage is null', () => {
    render(
      <Input
        type='money'
        switchLanguage={null as unknown as 'pt-BR'}
        value='123456'
        onChange={() => undefined}
      />,
    );

    expect(screen.getByRole('textbox')).toHaveValue('R$ 1.234,56');
  });

  it('shows clear button and triggers onClear', () => {
    const onClear = jest.fn();

    render(
      <Input
        value='bulbasaur'
        onChange={() => undefined}
        showClearButton
        onClear={onClear}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Clear input' }));

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('renders loading state with aria-busy', () => {
    render(
      <Input
        value=''
        onChange={() => undefined}
        isLoading
        loadingText='Loading types...'
      />,
    );

    const textbox = screen.getByRole('textbox');

    expect(textbox).toHaveAttribute('aria-busy', 'true');
    expect(textbox).toHaveAttribute('placeholder', 'Loading types...');
  });

  it('renders leading and trailing icons', () => {
    render(
      <Input
        value=''
        onChange={() => undefined}
        leadingIcon={<MdSearch data-testid='leading-icon' />}
        trailingIcon={<MdSearch data-testid='trailing-icon' />}
      />,
    );

    expect(screen.getByTestId('leading-icon')).toBeInTheDocument();
    expect(screen.getByTestId('trailing-icon')).toBeInTheDocument();
  });

  it('renders error message with invalid state', () => {
    render(
      <Input
        value=''
        onChange={() => undefined}
        isInvalid
        errorMessage='This field is required.'
      />,
    );

    const textbox = screen.getByRole('textbox');

    expect(textbox).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('This field is required.');
  });

  it('does not show clear button when input is readOnly', () => {
    render(
      <Input
        value='pikachu'
        onChange={() => undefined}
        showClearButton
        readOnly
        onClear={jest.fn()}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Clear input' })).not.toBeInTheDocument();
  });

  it('does not show clear button when input is disabled', () => {
    render(
      <Input
        value='pikachu'
        onChange={() => undefined}
        showClearButton
        disabled
        onClear={jest.fn()}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Clear input' })).not.toBeInTheDocument();
  });

  it('renders helper text when no error', () => {
    render(
      <Input
        value=''
        onChange={() => undefined}
        helperText='Enter your trainer name'
      />,
    );

    expect(screen.getByText('Enter your trainer name')).toBeInTheDocument();
  });

  it('applies filled variant class', () => {
    render(<Input value='' onChange={() => undefined} variant='filled' />);
    const wrapper = screen.getByRole('textbox').closest('div');
    expect(wrapper).toHaveClass('bg-slate-100');
  });

  it('supports mask function callback', () => {
    const onValueChange = jest.fn();

    render(
      <Input
        value=''
        onChange={() => undefined}
        onValueChange={onValueChange}
        mask={(rawValue) => `masked:${rawValue}`}
      />,
    );

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'abc' },
    });

    expect(onValueChange).toHaveBeenCalledWith('masked:abc', expect.any(Object));
  });

  it('handles short mask token sequence without crashing', () => {
    const onValueChange = jest.fn();

    render(
      <Input
        value=''
        onChange={() => undefined}
        onValueChange={onValueChange}
        mask='###'
      />,
    );

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '12' },
    });

    expect(onValueChange).toHaveBeenCalledWith('12', expect.any(Object));
  });

  it('stops mask when reaching trailing literal with no remaining digits', () => {
    const onValueChange = jest.fn();

    render(
      <Input
        value=''
        onChange={() => undefined}
        onValueChange={onValueChange}
        mask='(##)'
      />,
    );

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '12' },
    });

    expect(onValueChange).toHaveBeenCalledWith('(12', expect.any(Object));
  });

  it('keeps empty value for money input when there are no digits', () => {
    render(
      <Input
        type='money'
        value=''
        onChange={() => undefined}
      />,
    );

    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('accepts non-string controlled values without formatting', () => {
    render(
      <Input
        value={123 as unknown as string}
        onChange={() => undefined}
      />,
    );

    expect(screen.getByRole('textbox')).toHaveValue('123');
  });

  it('formats money value on typing in onValueChange callback', () => {
    const onValueChange = jest.fn();

    render(
      <Input
        type='money'
        value=''
        onChange={() => undefined}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '1234' },
    });

    expect(onValueChange).toHaveBeenCalledWith('R$ 12,34', expect.any(Object));
  });
});
