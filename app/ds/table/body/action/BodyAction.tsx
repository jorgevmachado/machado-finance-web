import React ,{ useMemo } from 'react';

import { MdDelete ,MdEdit ,MdVisibility } from 'react-icons/md';

import { joinClass } from '@/app/utils';

import type { TableActionsItem } from './types';

type BodyActionType = 'show' | 'edit' | 'delete';

type BodyActionProps = {
  item: unknown;
  type: BodyActionType;
  action: TableActionsItem;
}

export default function BodyAction({ item, type, action }: BodyActionProps) {
  
  const handleAction = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (action.onClick) {
      action.onClick(item);
    }     
  };
  
  const actionIcon = useMemo(() => {
    switch (type) {
      case 'show':
        return <MdVisibility size={20} />;
      case 'edit':
        return <MdEdit size={20} />;
      case 'delete':
        return <MdDelete size={20} />;
      default:
        return <MdVisibility size={20} />;
    }
  }, [type]);

  const classNameColor = useMemo(() => {
    switch (type) {
      case 'show':
        return 'text-sky-700 hover:bg-sky-50';
      case 'edit':
        return 'text-amber-700 hover:bg-amber-50';
      case 'delete':
        return 'text-red-700 hover:bg-red-50';
    }
  }, [type]);

  const actionClassName = useMemo(() => {
    return joinClass([
      'cursor-pointer',
      'rounded-lg',
      'p-2',
      'text-amber-700',
      'transition-colors',
      'hover:bg-amber-50',
      classNameColor
    ]);
  }, [classNameColor]);
  
  return (
    <button
      type="button"
      aria-label={action.label}
      className={actionClassName}
      onClick={handleAction}
    >
      {actionIcon}
    </button>
  );
}