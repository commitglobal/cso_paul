import classNames from 'classnames';
import { ReactNode } from 'react';

type TableCell = {
  children: ReactNode;
  colSpan?: number;
  width?: string;
};

export function TableCell({ children, colSpan, width }: TableCell) {
  return (
    <td
      className={classNames(
        'p-6 border-t text-sm text-gray-500 text-ellipsis',
        width && 'overflow-hidden',
      )}
      colSpan={colSpan}
      style={{ maxWidth: width }}
      title={typeof children === 'string' ? children : ''}
    >
      {children}
    </td>
  );
}
