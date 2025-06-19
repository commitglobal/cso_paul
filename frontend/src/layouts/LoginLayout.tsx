import { CommonProps } from '@/types/CommonProps';
import { LoginText } from '@/components/LoginText';
import { Notification } from '@/components/Notification';
import { Page } from '@inertiajs/core';
import { ReactNode } from 'react';
import classNames from 'classnames';


export default function DefaultLayout(page: Page<CommonProps>) {

  return (
    <div className='flex h-full'>
      <div className='w-1/2 p-20 content-center'>
        <LoginText />
      </div>
      <div className='w-1/2 p-20 bg-paul-200 content-center'>
        <div className="rounded-xl bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            {page as unknown as ReactNode}
            <Notification />
          </div>
        </div>
      </div>
    </div>
  );
}
