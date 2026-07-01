import { type ReactNode } from 'react';

export type TabItem = Readonly<{
  id: string;
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  onIconClick?: () => void;
}>;

export type TabsProps = Readonly<{
  items: ReadonlyArray<TabItem>;
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
  className?: string;
  tabsListClassName?: string;
  tabButtonClassName?: string;
  contentClassName?: string;
}>;
