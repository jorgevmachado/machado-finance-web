'use client';

import React, { useState } from 'react';
import { joinClass } from '@/app/utils';
import { type AccordionProps } from './types';

const Accordion = ({
  title,
  subtitle,
  children,
  defaultOpen = false,
  onChange,
  className,
  titleClassName,
  contentClassName,
}: AccordionProps): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    onChange?.(nextOpen);
  };

  return (
    <div
      className={joinClass([
        'border border-slate-200 rounded-lg overflow-hidden bg-white',
        className,
      ])}
    >
      <button
        type="button"
        onClick={handleToggle}
        className="w-full px-4 py-4 sm:px-5 sm:py-5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors text-left"
        aria-expanded={isOpen}
      >
        <div className="flex-1 flex flex-col gap-1">
          <h3
            className={joinClass([
              'text-base sm:text-lg font-semibold text-slate-900',
              titleClassName,
            ])}
          >
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex-shrink-0">
          <svg
            className={joinClass([
              'w-5 h-5 text-slate-600 transition-transform duration-200',
              isOpen && 'rotate-180',
            ])}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div
          className={joinClass([
            'border-t border-slate-200 px-4 py-4 sm:px-5 sm:py-5 bg-slate-50',
            contentClassName,
          ])}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default React.memo(Accordion);
