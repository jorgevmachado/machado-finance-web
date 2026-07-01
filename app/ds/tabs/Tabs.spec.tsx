import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Tabs from './Tabs';
import type { TabItem } from './types';

const TABS: TabItem[] = [
  {
    id: 'tab-1',
    title: 'Tab 1',
    children: <div>Content 1</div>,
  },
  {
    id: 'tab-2',
    title: 'Tab 2',
    children: <div>Content 2</div>,
  },
  {
    id: 'tab-3',
    title: 'Tab 3',
    children: <div>Content 3</div>,
  },
];

describe('<Tabs />', () => {
  it('renders all tab buttons', () => {
    render(<Tabs items={TABS} />);

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('displays first tab content by default', () => {
    render(<Tabs items={TABS} />);

    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Content 3')).not.toBeInTheDocument();
  });

  it('switches tab content on click', () => {
    render(<Tabs items={TABS} />);

    const tab2Button = screen.getByRole('tab', { name: 'Tab 2' });
    fireEvent.click(tab2Button);

    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 3')).not.toBeInTheDocument();
  });

  it('sets aria-selected on active tab', () => {
    render(<Tabs items={TABS} />);

    const tab1Button = screen.getByRole('tab', { name: 'Tab 1' });
    const tab2Button = screen.getByRole('tab', { name: 'Tab 2' });

    expect(tab1Button).toHaveAttribute('aria-selected', 'true');
    expect(tab2Button).toHaveAttribute('aria-selected', 'false');

    fireEvent.click(tab2Button);

    expect(tab1Button).toHaveAttribute('aria-selected', 'false');
    expect(tab2Button).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onChange callback with correct tab id', () => {
    const onChange = jest.fn();
    render(<Tabs items={TABS} onChange={onChange} />);

    const tab2Button = screen.getByRole('tab', { name: 'Tab 2' });
    fireEvent.click(tab2Button);

    expect(onChange).toHaveBeenCalledWith('tab-2');
  });

  it('renders icon next to title and triggers onIconClick with pointer cursor', () => {
    const onIconClick = jest.fn();
    const onChange = jest.fn();
    const tabsWithIcon: TabItem[] = [
      {
        id: 'tab-1',
        title: 'Tab 1',
        icon: <span data-testid="tab-icon">+</span>,
        onIconClick,
        children: <div>Content 1</div>,
      },
      {
        id: 'tab-2',
        title: 'Tab 2',
        children: <div>Content 2</div>,
      },
    ];

    render(<Tabs items={tabsWithIcon} onChange={onChange} />);

    const icon = screen.getByTestId('tab-icon');
    const iconWrapper = icon.parentElement;

    expect(icon).toBeInTheDocument();
    if (!iconWrapper) {
      throw new Error('Icon wrapper not found');
    }
    expect(iconWrapper).toHaveClass('cursor-pointer');
    expect(iconWrapper).toHaveClass('hover:bg-slate-200/70');

    fireEvent.click(icon);

    expect(onIconClick).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders icon without clickable classes when onIconClick is not provided', () => {
    const tabsWithPassiveIcon: TabItem[] = [
      {
        id: 'tab-1',
        title: 'Tab 1',
        icon: <span data-testid="passive-icon">i</span>,
        children: <div>Content 1</div>,
      },
    ];

    render(<Tabs items={tabsWithPassiveIcon} />);

    const icon = screen.getByTestId('passive-icon');
    const iconWrapper = icon.parentElement;
    if (!iconWrapper) {
      throw new Error('Passive icon wrapper not found');
    }

    expect(iconWrapper).not.toHaveClass('cursor-pointer');
    expect(iconWrapper).not.toHaveClass('hover:bg-slate-200/70');
  });

  it('handles empty tabs list', () => {
    render(<Tabs items={[]} />);

    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
  });

  it('uses defaultTabId when provided', () => {
    render(<Tabs items={TABS} defaultTabId="tab-2" />);

    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();

    const tab2Button = screen.getByRole('tab', { name: 'Tab 2' });
    expect(tab2Button).toHaveAttribute('aria-selected', 'true');
  });

  it('falls back to first tab when defaultTabId is invalid', () => {
    render(<Tabs items={TABS} defaultTabId="invalid-id" />);

    expect(screen.getByText('Content 1')).toBeInTheDocument();

    const tab1Button = screen.getByRole('tab', { name: 'Tab 1' });
    expect(tab1Button).toHaveAttribute('aria-selected', 'true');
  });

  it('renders complex JSX content in tabs', () => {
    const complexTabs: TabItem[] = [
      {
        id: 'complex-1',
        title: 'Complex Tab',
        children: (
          <div>
            <h2>Heading</h2>
            <p>Paragraph</p>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </div>
        ),
      },
    ];

    render(<Tabs items={complexTabs} />);

    expect(screen.getByText('Heading')).toBeInTheDocument();
    expect(screen.getByText('Paragraph')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('applies custom classNames', () => {
    render(
      <Tabs
        items={TABS}
        className="custom-container"
        tabsListClassName="custom-list"
        tabButtonClassName="custom-button"
        contentClassName="custom-content"
      />,
    );

    const tabList = screen.getByRole('tablist');
    const container = tabList.parentElement;
    const tab1Button = screen.getByRole('tab', { name: 'Tab 1' });
    const content = screen.getByRole('tabpanel');

    if (!container) {
      throw new Error('Tabs container not found');
    }
    expect(container).toHaveClass('custom-container');
    expect(tabList).toHaveClass('custom-list');
    expect(tab1Button).toHaveClass('custom-button');
    expect(content).toHaveClass('custom-content');
  });

  it('sets correct ARIA attributes', () => {
    render(<Tabs items={TABS} />);

    const tabList = screen.getByRole('tablist');
    expect(tabList).toHaveAttribute('role', 'tablist');

    const tab1Button = screen.getByRole('tab', { name: 'Tab 1' });
    expect(tab1Button).toHaveAttribute('role', 'tab');
    expect(tab1Button).toHaveAttribute('aria-controls', 'tabpanel-tab-1');

    const tabPanel = screen.getByRole('tabpanel');
    expect(tabPanel).toHaveAttribute('role', 'tabpanel');
  });

  it('handles single tab correctly', () => {
    const singleTab: TabItem[] = [
      {
        id: 'only-tab',
        title: 'Only Tab',
        children: <div>Only Content</div>,
      },
    ];

    render(<Tabs items={singleTab} />);

    expect(screen.getByText('Only Tab')).toBeInTheDocument();
    expect(screen.getByText('Only Content')).toBeInTheDocument();

    const tab = screen.getByRole('tab', { name: 'Only Tab' });
    expect(tab).toHaveAttribute('aria-selected', 'true');
  });

  it('maintains active tab state across re-renders', () => {
    const { rerender } = render(<Tabs items={TABS} />);

    const tab2Button = screen.getByRole('tab', { name: 'Tab 2' });
    fireEvent.click(tab2Button);

    expect(screen.getByText('Content 2')).toBeInTheDocument();

    rerender(<Tabs items={TABS} />);

    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(tab2Button).toHaveAttribute('aria-selected', 'true');
  });
});
