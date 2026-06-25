import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BodyAction from './BodyAction';
import type { TableActionsItem } from './types';

describe('BodyAction.tsx', () => {
  const mockAction = jest.fn();
  const testItem = { id: '1', name: 'Test Item' };

  const actionItem: TableActionsItem = {
    label: 'View Item',
    onClick: mockAction,
  };

  beforeEach(() => {
    mockAction.mockClear();
  });

  describe('Icon rendering', () => {
    it('should render visibility icon for show action', () => {
      const { container } = render(
        <BodyAction type="show" item={testItem} action={actionItem} />
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render edit icon for edit action', () => {
      const { container } = render(
        <BodyAction type="edit" item={testItem} action={actionItem} />
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render delete icon for delete action', () => {
      const { container } = render(
        <BodyAction type="delete" item={testItem} action={actionItem} />
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render visibility icon as default', () => {
      const { container } = render(
        <BodyAction type="show" item={testItem} action={actionItem} />
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Color styling', () => {
    it('should apply sky color class for show action', () => {
      const { container } = render(
        <BodyAction type="show" item={testItem} action={actionItem} />
      );

      const button = container.querySelector('button');
      expect(button?.className).toContain('text-sky-700');
      expect(button?.className).toContain('hover:bg-sky-50');
    });

    it('should apply amber color class for edit action', () => {
      const { container } = render(
        <BodyAction type="edit" item={testItem} action={actionItem} />
      );

      const button = container.querySelector('button');
      expect(button?.className).toContain('text-amber-700');
      expect(button?.className).toContain('hover:bg-amber-50');
    });

    it('should apply red color class for delete action', () => {
      const { container } = render(
        <BodyAction type="delete" item={testItem} action={actionItem} />
      );

      const button = container.querySelector('button');
      expect(button?.className).toContain('text-red-700');
      expect(button?.className).toContain('hover:bg-red-50');
    });
  });

  describe('Click handling', () => {
    it('should call onClick when button is clicked', () => {
      const { container } = render(
        <BodyAction type="show" item={testItem} action={actionItem} />
      );

      const button = container.querySelector('button') as HTMLButtonElement;
      fireEvent.click(button);

      expect(mockAction).toHaveBeenCalledWith(testItem);
    });

    it('should stop propagation when button is clicked', () => {
      const { container } = render(
        <BodyAction type="show" item={testItem} action={actionItem} />
      );

      const button = container.querySelector('button') as HTMLButtonElement;
      const clickEvent = new MouseEvent('click', { bubbles: true });

      button.dispatchEvent(clickEvent);

      expect(mockAction).toHaveBeenCalled();
    });

    it('should pass the correct item to onClick', () => {
      const customItem = { id: 'custom-123', name: 'Custom Item' };
      render(
        <BodyAction type="show" item={customItem} action={actionItem} />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockAction).toHaveBeenCalledWith(customItem);
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label for show action', () => {
      const { container } = render(
        <BodyAction type="show" item={testItem} action={actionItem} />
      );

      const button = container.querySelector('button');
      expect(button).toHaveAttribute('aria-label', 'View Item');
    });

    it('should have proper aria-label for edit action', () => {
      const { container } = render(
        <BodyAction type="edit" item={testItem} action={actionItem} />
      );

      const button = container.querySelector('button');
      expect(button).toHaveAttribute('aria-label', 'View Item');
    });

    it('should have proper aria-label for delete action', () => {
      const { container } = render(
        <BodyAction type="delete" item={testItem} action={actionItem} />
      );

      const button = container.querySelector('button');
      expect(button).toHaveAttribute('aria-label', 'View Item');
    });

    it('should be a button element with type button', () => {
      const { container } = render(
        <BodyAction type="show" item={testItem} action={actionItem} />
      );

      const button = container.querySelector('button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Class name application', () => {
    it('should include cursor-pointer class', () => {
      const { container } = render(
        <BodyAction type="show" item={testItem} action={actionItem} />
      );

      const button = container.querySelector('button');
      expect(button?.className).toContain('cursor-pointer');
    });

    it('should include rounded-lg class', () => {
      const { container } = render(
        <BodyAction type="show" item={testItem} action={actionItem} />
      );

      const button = container.querySelector('button');
      expect(button?.className).toContain('rounded-lg');
    });

    it('should include padding class', () => {
      const { container } = render(
        <BodyAction type="show" item={testItem} action={actionItem} />
      );

      const button = container.querySelector('button');
      expect(button?.className).toContain('p-2');
    });

    it('should include transition-colors class', () => {
      const { container } = render(
        <BodyAction type="show" item={testItem} action={actionItem} />
      );

      const button = container.querySelector('button');
      expect(button?.className).toContain('transition-colors');
    });
  });

  describe('Multiple renders', () => {
    it('should handle multiple different action types', () => {
      const { rerender, container } = render(
        <BodyAction type="show" item={testItem} action={actionItem} />
      );

      let svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();

      rerender(
        <BodyAction type="edit" item={testItem} action={actionItem} />
      );

      svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();

      rerender(
        <BodyAction type="delete" item={testItem} action={actionItem} />
      );

      svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should update when action callback changes', () => {
      const firstAction = jest.fn();
      const secondAction = jest.fn();

      const firstActionItem: TableActionsItem = {
        label: 'First',
        onClick: firstAction,
      };

      const secondActionItem: TableActionsItem = {
        label: 'Second',
        onClick: secondAction,
      };

      const { rerender, container } = render(
        <BodyAction type="show" item={testItem} action={firstActionItem} />
      );

      let button = container.querySelector('button') as HTMLButtonElement;
      fireEvent.click(button);

      expect(firstAction).toHaveBeenCalledWith(testItem);

      rerender(
        <BodyAction type="show" item={testItem} action={secondActionItem} />
      );

      button = container.querySelector('button') as HTMLButtonElement;
      fireEvent.click(button);

      expect(secondAction).toHaveBeenCalledWith(testItem);
    });
  });

  describe('Different item types', () => {
    it('should work with string items', () => {
      const stringItem = 'test-string';
      render(
        <BodyAction type="show" item={stringItem} action={actionItem} />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockAction).toHaveBeenCalledWith(stringItem);
    });

    it('should work with number items', () => {
      const numberItem = 123;
      render(
        <BodyAction type="show" item={numberItem} action={actionItem} />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockAction).toHaveBeenCalledWith(numberItem);
    });

    it('should work with complex object items', () => {
      const complexItem = {
        id: '1',
        nested: {
          value: 'test',
          count: 10,
        },
        array: [1, 2, 3],
      };

      render(
        <BodyAction type="show" item={complexItem} action={actionItem} />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockAction).toHaveBeenCalledWith(complexItem);
    });
  });
});
