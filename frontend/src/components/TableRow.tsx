import { ReactNode } from 'react';

type TableRowProps = {
  children: ReactNode;
};

export function TableRow({ children }: TableRowProps) {
  return <tr>{children}</tr>;
}
