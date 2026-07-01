import { type ReactNode } from 'react';

export type AccordionProps = Readonly<{
  title: string;
  subtitle?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  onChange?: (isOpen: boolean) => void;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
}>;
