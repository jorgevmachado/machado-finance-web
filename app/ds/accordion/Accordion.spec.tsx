import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Accordion from './Accordion';

describe('<Accordion />', () => {
  it('renders title and subtitle correctly', () => {
    render(
      <Accordion
        title="Accordion Title"
        subtitle="Accordion Subtitle"
      >
        Content here
      </Accordion>,
    );

    expect(screen.getByText('Accordion Title')).toBeInTheDocument();
    expect(screen.getByText('Accordion Subtitle')).toBeInTheDocument();
  });

  it('renders content when opened', () => {
    render(
      <Accordion title="Title" defaultOpen>
        Test Content
      </Accordion>,
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('hides content when closed', () => {
    render(
      <Accordion title="Title" defaultOpen={false}>
        Test Content
      </Accordion>,
    );

    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('toggles content visibility on button click', () => {
    render(
      <Accordion title="Title">
        Test Content
      </Accordion>,
    );

    const button = screen.getByRole('button');
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByText('Test Content')).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('calls onChange callback with correct state', () => {
    const onChange = jest.fn();

    render(
      <Accordion title="Title" onChange={onChange}>
        Content
      </Accordion>,
    );

    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(onChange).toHaveBeenCalledWith(true);

    fireEvent.click(button);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('sets aria-expanded attribute correctly', () => {
    render(
      <Accordion title="Title">
        Content
      </Accordion>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('rotates chevron icon when toggled', () => {
    render(
      <Accordion title="Title">
        Content
      </Accordion>,
    );

    const svg = screen.getByRole('button').querySelector('svg');
    expect(svg).not.toHaveClass('rotate-180');

    fireEvent.click(screen.getByRole('button'));
    expect(svg).toHaveClass('rotate-180');

    fireEvent.click(screen.getByRole('button'));
    expect(svg).not.toHaveClass('rotate-180');
  });

  it('renders without subtitle when not provided', () => {
    render(
      <Accordion title="Only Title">
        Content
      </Accordion>,
    );

    expect(screen.getByText('Only Title')).toBeInTheDocument();
    expect(screen.queryByText('subtitle')).not.toBeInTheDocument();
  });

  it('applies custom className to container', () => {
    render(
      <Accordion title="Title" className="custom-class">
        Content
      </Accordion>,
    );

    const container = screen.getByRole('button').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('applies custom titleClassName', () => {
    render(
      <Accordion title="Title" titleClassName="text-red-500">
        Content
      </Accordion>,
    );

    const titleElement = screen.getByText('Title');
    expect(titleElement).toHaveClass('text-red-500');
  });

  it('applies custom contentClassName', () => {
    render(
      <Accordion title="Title" defaultOpen contentClassName="bg-blue-100">
        Content
      </Accordion>,
    );

    const contentContainer = screen.getByText('Content').closest('div');
    expect(contentContainer).toHaveClass('bg-blue-100');
  });

  it('renders complex JSX as children', () => {
    render(
      <Accordion title="Title" defaultOpen>
        <div>
          <h2>Complex Content</h2>
          <p>Nested paragraph</p>
        </div>
      </Accordion>,
    );

    expect(screen.getByText('Complex Content')).toBeInTheDocument();
    expect(screen.getByText('Nested paragraph')).toBeInTheDocument();
  });

  it('memoizes component correctly', () => {
    const { rerender } = render(
      <Accordion title="Title" defaultOpen>
        Content
      </Accordion>,
    );

    expect(screen.getByText('Content')).toBeInTheDocument();

    rerender(
      <Accordion title="Title" defaultOpen>
        Content
      </Accordion>,
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
