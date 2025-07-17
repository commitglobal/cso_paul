import { CommonProps } from '@/types/common-props';
import { type ReactNode } from 'react';
import { type Page } from '@inertiajs/core';
import { Notification } from '@/components/paul/notification';


export default function BlankLayout(page: Page<CommonProps>) {

  return (
    <main>
      {page as unknown as ReactNode}
      <Notification />
    </main>

  )
}