'use client';

import React, { useState, useMemo } from 'react';
import { joinClass } from '@/app/utils';
import { type TabsProps } from './types';

const Tabs = ({
  items,
  defaultTabId,
  onChange,
  className,
  tabsListClassName,
  tabButtonClassName,
  contentClassName,
}: TabsProps): React.JSX.Element => {
  const validDefaultTabId = useMemo(() => {
    if (defaultTabId && items.some((item) => item.id === defaultTabId)) {
      return defaultTabId;
    }
    return items[0]?.id ?? '';
  }, [defaultTabId, items]);

  const [activeTabId, setActiveTabId] = useState(validDefaultTabId);

  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
    onChange?.(tabId);
  };

  const activeTab = items.find((item) => item.id === activeTabId);

  return (
    <div
      className={joinClass([
        'w-full',
        className,
      ])}
    >
      <div
        role="tablist"
        className={joinClass([
          'flex gap-0 border-b border-slate-200 bg-white',
          tabsListClassName,
        ])}
      >
        {items.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={activeTabId === item.id}
            aria-controls={`tabpanel-${item.id}`}
            type="button"
            onClick={() => handleTabChange(item.id)}
            className={joinClass([
              'px-4 py-3 sm:px-5 sm:py-4 font-medium text-sm sm:text-base',
              'transition-colors duration-200',
              'border-b-2 -mb-[2px]',
              activeTabId === item.id
                ? 'text-blue-600 border-b-blue-600'
                : 'text-slate-600 border-b-transparent hover:text-slate-900 hover:bg-slate-50',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-t',
              tabButtonClassName,
            ])}
          >
            <span className="inline-flex items-center gap-2">
              <span>{item.title}</span>
              {item.icon && (
                <span
                  className={joinClass([
                    'inline-flex items-center rounded-sm transition-colors',
                    item.onIconClick ? 'cursor-pointer hover:bg-slate-200/70' : undefined,
                  ])}
                  onClick={(event) => {
                    event.stopPropagation();
                    item.onIconClick?.();
                  }}
                >
                  {item.icon}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      {activeTab && (
        <div
          id={`tabpanel-${activeTab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab.id}`}
          className={joinClass([
            'px-4 py-4 sm:px-5 sm:py-5 bg-white',
            contentClassName,
          ])}
        >
          {activeTab.children}
        </div>
      )}
    </div>
  );
};

export default React.memo(Tabs);
