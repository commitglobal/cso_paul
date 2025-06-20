import { ReactNode } from 'react';

type TableProps = {
  children: ReactNode;
};

export function Table({ children }: TableProps) {
  return (
    <table className='min-w-full shadow-md rounded-lg border-separate border-spacing-0 border'>
      {children}
    </table>
  );
}
