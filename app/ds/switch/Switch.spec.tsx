import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import Switch from './index';

describe('<Switch />', () => {
  it('renders label and description', () => {
    render(
      <Switch
        label='Notifications'
        description='Enable app notifications'
      />,
    );

    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Enable app notifications')).toBeInTheDocument();
  });

  it('supports uncontrolled usage with defaultChecked', () => {
    const onCheckedChange = jest.fn();

    render(
      <Switch
        defaultChecked
        onCheckedChange={onCheckedChange}
      />,
    );

    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeChecked();

    fireEvent.click(switchElement);

    expect(onCheckedChange).toHaveBeenCalledWith(false, expect.any(Object));
    expect(switchElement).not.toBeChecked();
  });

  it('supports controlled usage', () => {
    const onCheckedChange = jest.fn();

    const { rerender } = render(
      <Switch
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    );

    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);

    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.any(Object));
    expect(switchElement).not.toBeChecked();

    rerender(
      <Switch
        checked
        onCheckedChange={onCheckedChange}
      />,
    );
    expect(switchElement).toBeChecked();
  });

  it('calls native onChange callback', () => {
    const onChange = jest.fn();

    render(<Switch onChange={onChange} />);

    fireEvent.click(screen.getByRole('switch'));

    expect(onChange).toHaveBeenCalled();
  });

  it('supports disabled and loading states', () => {
    const onCheckedChange = jest.fn();

    const { rerender } = render(
      <Switch disabled onCheckedChange={onCheckedChange} />,
    );
    const switchElement = screen.getByRole('switch');

    expect(switchElement).toBeDisabled();

    rerender(
      <Switch loading loadingLabel='Saving...' onCheckedChange={onCheckedChange} />,
    );

    expect(screen.getByRole('switch')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Saving...')).toBeInTheDocument();
  });

  it('renders readOnly switch as disabled and keeps checked state', () => {
    render(
      <Switch
        defaultChecked
        readOnly
      />,
    );

    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeDisabled();
    expect(switchElement).toBeChecked();
  });

  it('renders checked/unchecked labels', () => {
    const { rerender } = render(
      <Switch
        checked={false}
        checkedLabel='On'
        uncheckedLabel='Off'
      />,
    );

    expect(screen.getByText('Off')).toBeInTheDocument();

    rerender(
      <Switch
        checked
        checkedLabel='On'
        uncheckedLabel='Off'
      />,
    );

    expect(screen.getByText('On')).toBeInTheDocument();
  });

  it('supports size, tone and variant classes', () => {
    render(
      <Switch
        checked
        size='lg'
        tone='success'
        variant='outline'
      />,
    );

    const switchElement = screen.getByRole('switch');
    const label = switchElement.closest('label');
    const track = label?.querySelector('span');

    expect(track).toHaveClass('h-8');
    expect(track).toHaveClass('w-14');
    expect(track).toHaveClass('border');
    expect(track).toHaveClass('bg-emerald-600');
  });

  it('renders label before control when labelPosition is start', () => {
    render(
      <Switch
        label='Dark mode'
        labelPosition='start'
      />,
    );

    const container = screen.getByText('Dark mode').parentElement?.parentElement;
    const firstText = container?.firstElementChild?.textContent;

    expect(firstText).toContain('Dark mode');
  });

  it('renders label after control when labelPosition is end', () => {
    render(
      <Switch
        label='Beta feature'
        labelPosition='end'
      />,
    );

    const container = screen.getByText('Beta feature').parentElement?.parentElement;
    const lastText = container?.lastElementChild?.textContent;

    expect(lastText).toContain('Beta feature');
  });

  it('forwards id, name, value and required props', () => {
    render(
      <Switch
        id='settings-switch'
        name='settingsSwitch'
        value='enabled'
        required
      />,
    );

    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('id', 'settings-switch');
    expect(switchElement).toHaveAttribute('name', 'settingsSwitch');
    expect(switchElement).toHaveAttribute('value', 'enabled');
    expect(switchElement).toBeRequired();
  });

  it('applies full width container class when fullWidth is true', () => {
    render(
      <Switch
        label='Auto sync'
        fullWidth
      />,
    );

    const container = screen.getByText('Auto sync').parentElement?.parentElement;
    expect(container).toHaveClass('w-full');
  });
});
