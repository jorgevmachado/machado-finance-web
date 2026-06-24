import React from 'react';

import { render, screen, act } from '@testing-library/react';

jest.mock('@/app/ds', () => {
  const ReactLib = require('react');
  const breadcrumbConfig = jest.requireActual('./breadcrumb-config');

  return {
    ...breadcrumbConfig,
    Text: ({
      children,
      ...props
    }: Readonly<{ children: React.ReactNode }> & Record<string, unknown>) => ReactLib.createElement('span', props, children),
  };
});

import { buildBreadcrumbs, ROUTE_SEGMENT_LABELS } from './breadcrumb-config';
import Breadcrumb from './Breadcrumb';
import BreadcrumbItem from './BreadcrumbItem';
import BreadcrumbProvider from './BreadcrumbProvider';
import { useBreadcrumb } from './useBreadcrumb';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

import { usePathname } from 'next/navigation';

const mockUsePathname = usePathname as jest.Mock;

const renderWithProvider = (ui: React.ReactElement, pathname = '/home') => {
  mockUsePathname.mockReturnValue(pathname);
  return render(<BreadcrumbProvider>{ui}</BreadcrumbProvider>);
};

describe('buildBreadcrumbs', () => {
  it('returns empty array for root /home', () => {
    expect(buildBreadcrumbs('/home')).toEqual([]);
  });

  it('returns empty array for empty path', () => {
    expect(buildBreadcrumbs('/')).toEqual([]);
  });

  it('builds breadcrumbs for /home/register-user', () => {
    const result = buildBreadcrumbs('/home/register-user');
    expect(result).toHaveLength(2);
    expect(result[0].label).toBe('Home');
    expect(result[0].isCurrent).toBe(false);
    expect(result[1].label).toBe('Register User');
    expect(result[1].isCurrent).toBe(true);
  });

  it('injects Home root for paths not starting with /home', () => {
    const result = buildBreadcrumbs('/pokedex');
    expect(result[0].label).toBe('Home');
    expect(result[0].href).toBe('/home');
    expect(result[1].label).toBe('Pokédex');
    expect(result[1].isCurrent).toBe(true);
  });

  it('formats fallback labels for unknown segments', () => {
    const result = buildBreadcrumbs('/some-unknown-page');
    const last = result[result.length - 1];
    expect(last.label).toBe('Some Unknown Page');
  });

  it('includes non-current home segment in multi-segment /home paths', () => {
    const result = buildBreadcrumbs('/home/pokedex');
    // home should be included as non-current
    const homeSegment = result.find((item) => item.href === '/home');
    expect(homeSegment).toBeDefined();
    expect(homeSegment?.isCurrent).toBe(false);
  });
});

describe('ROUTE_SEGMENT_LABELS', () => {
  it('contains expected route labels', () => {
    expect(ROUTE_SEGMENT_LABELS['home']).toBe('Home');
    expect(ROUTE_SEGMENT_LABELS['pokedex']).toBe('Pokédex');
    expect(ROUTE_SEGMENT_LABELS['register-user']).toBe('Register User');
  });
});

describe('<Breadcrumb />', () => {
  it('renders nothing for /home', () => {
    mockUsePathname.mockReturnValue('/home');
    const { container } = render(
      <BreadcrumbProvider>
        <Breadcrumb />
      </BreadcrumbProvider>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders breadcrumb nav for /home/register-user', () => {
    renderWithProvider(<Breadcrumb />, '/home/register-user');

    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByText('Register User')).toBeInTheDocument();
  });

  it('renders home icon link', () => {
    renderWithProvider(<Breadcrumb />, '/home/register-user');

    expect(screen.getByRole('link', { name: 'Go to Home' })).toBeInTheDocument();
  });

  it('renders non-current items as links', () => {
    renderWithProvider(<Breadcrumb />, '/home/pokedex/charizard');

    // 'Pokedex' should be a link (non-current)
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(1);
  });

  it('applies custom label from context', () => {
    mockUsePathname.mockReturnValue('/home/register-user');

    const Consumer = () => {
      const { setCustomLabel } = useBreadcrumb();
      return (
        <button onClick={() => setCustomLabel('/home/register-user', 'Custom Label')}>
          Set Label
        </button>
      );
    };

    render(
      <BreadcrumbProvider>
        <Consumer />
        <Breadcrumb />
      </BreadcrumbProvider>,
    );

    act(() => {
      screen.getByRole('button', { name: 'Set Label' }).click();
    });

    expect(screen.getByText('Custom Label')).toBeInTheDocument();
  });
});

describe('<BreadcrumbItem />', () => {
  it('renders non-clickable items as plain text', () => {
    render(
      <BreadcrumbItem
        item={{
          label: 'Blocked Segment',
          href: '/blocked',
          clickable: false,
          isCurrent: false,
        }}
      />,
    );

    expect(screen.getByText('Blocked Segment')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Blocked Segment' })).not.toBeInTheDocument();
  });
});

describe('<BreadcrumbProvider />', () => {
  it('renders children', () => {
    render(
      <BreadcrumbProvider>
        <span>child</span>
      </BreadcrumbProvider>,
    );
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('provides setCustomLabel via context', () => {
    const Consumer = () => {
      const { setCustomLabel } = useBreadcrumb();
      return (
        <>
          <button onClick={() => setCustomLabel('/test', 'Test Label')}>Set</button>
          <span>{typeof setCustomLabel}</span>
        </>
      );
    };

    render(
      <BreadcrumbProvider>
        <Consumer />
      </BreadcrumbProvider>,
    );

    expect(screen.getByText('function')).toBeInTheDocument();

    act(() => {
      screen.getByRole('button', { name: 'Set' }).click();
    });

    expect(screen.getByText('function')).toBeInTheDocument();
  });

  it('uses custom breadcrumbs when the current and custom path segments match', () => {
    mockUsePathname.mockReturnValue('/home/register-user');

    const Consumer = () => {
      const { customBuildBreadcrumbs, breadcrumbs } = useBreadcrumb();
      return (
        <>
          <button onClick={() => customBuildBreadcrumbs('/admin/register-user', ['register-user'])}>
            Set Matching Custom
          </button>
          {breadcrumbs.map((item) => (
            <span key={item.href}>{`${item.href}|${String(item.clickable)}`}</span>
          ))}
        </>
      );
    };

    render(
      <BreadcrumbProvider>
        <Consumer />
      </BreadcrumbProvider>,
    );

    act(() => {
      screen.getByRole('button', { name: 'Set Matching Custom' }).click();
    });

    expect(screen.getByText('/admin/register-user|false')).toBeInTheDocument();
  });

  it('keeps pathname breadcrumbs when custom path segment does not match', () => {
    mockUsePathname.mockReturnValue('/home/register-user');

    const Consumer = () => {
      const { customBuildBreadcrumbs, breadcrumbs } = useBreadcrumb();
      return (
        <>
          <button onClick={() => customBuildBreadcrumbs('/admin/pokemon')}>
            Set Non Matching Custom
          </button>
          {breadcrumbs.map((item) => (
            <span key={item.href}>{item.href}</span>
          ))}
        </>
      );
    };

    render(
      <BreadcrumbProvider>
        <Consumer />
      </BreadcrumbProvider>,
    );

    act(() => {
      screen.getByRole('button', { name: 'Set Non Matching Custom' }).click();
    });

    expect(screen.getByText('/home/register-user')).toBeInTheDocument();
    expect(screen.queryByText('/admin/pokemon')).not.toBeInTheDocument();
  });
});

describe('useBreadcrumb', () => {
  it('throws when used outside BreadcrumbProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    const BadConsumer = () => {
      useBreadcrumb();
      return null;
    };

    expect(() => render(<BadConsumer />)).toThrow(
      'useBreadcrumb must be used within a BreadcrumbProvider',
    );

    consoleError.mockRestore();
  });

  it('returns context when inside BreadcrumbProvider', () => {
    const Consumer = () => {
      const ctx = useBreadcrumb();
      return <span>{typeof ctx.setCustomLabel}</span>;
    };

    render(
      <BreadcrumbProvider>
        <Consumer />
      </BreadcrumbProvider>,
    );

    expect(screen.getByText('function')).toBeInTheDocument();
  });
});
