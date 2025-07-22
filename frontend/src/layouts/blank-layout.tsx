import { CommonProps } from '@/types/common-props';
import { type ReactNode } from 'react';
import { type Page } from '@inertiajs/core';

export default function BlankLayout(page: Page<CommonProps>) {

  return (
    <main>
      {page as unknown as ReactNode}
    </main>
  )
}
