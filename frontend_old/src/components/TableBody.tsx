import { ReactNode } from 'react';

type TableBodyProps = {
  children: ReactNode;
};

export function TableBody({ children }: TableBodyProps) {
  return <tbody>{children}</tbody>;
}
