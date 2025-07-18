import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import { apiPostUrls } from '@/constants/api-urls';
import { useCallback } from 'react';
import { useForm } from '@inertiajs/react';

import logo from '@/assets/paul-logo.svg'


export function AppTopbar() {
  const { t } = useTranslation();
  const { post } = useForm();
  const handleSignOut = useCallback(() => {
    post(apiPostUrls.userLogout());
  }, [post]);


  return (
    <Disclosure as='nav' className='bg-white shadow'>
      <div className='mx-auto px-2 sm:px-4 lg:px-8'>
        <div className='flex h-16 justify-between '>
          <div className='flex px-2 lg:px-0'>
            <div className='flex shrink-0 items-center'>
              <img
                alt='PAUL'
                src={logo}
                className='h-8 w-auto'
              />
            </div>

          </div>
          <div className='flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end'>
            <div className='grid w-full max-w-lg grid-cols-1 lg:max-w-xs'>
              <input
                name='search'
                type='search'
                placeholder={t('topbar.search')}
                className='col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-10 pr-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
              />
              <MagnifyingGlassIcon
                aria-hidden='true'
                className='pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400'
              />
            </div>
          </div>
          <div className='flex items-center lg:hidden'>
            {/* Mobile menu button */}
            <DisclosureButton
              className='group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
              <span className='absolute -inset-0.5' />
              <span className='sr-only'>{t('topbar.openMainMenu')}</span>
              <Bars3Icon aria-hidden='true' className='block size-6 group-data-[open]:hidden' />
              <XMarkIcon aria-hidden='true' className='hidden size-6 group-data-[open]:block' />
            </DisclosureButton>
          </div>
          <div className='hidden lg:ml-4 lg:flex lg:items-center'>
            <button
              type='button'
              className='relative shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            >
              <span className='absolute -inset-1.5' />
              <span className='sr-only'>{t('topbar.viewNotifications')}</span>
              <BellIcon aria-hidden='true' className='size-6' />
            </button>

            {/* Profile dropdown */}
            <Menu as='div' className='relative ml-4 shrink-0'>
              <div>
                <MenuButton
                  className='relative flex rounded-full bg-white text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2'>
                  <span className='absolute -inset-1.5' />
                  <span className='sr-only'>{t('topbar.openUserMenu')}</span>
                  <img
                    alt=''
                    // src=""
                    className='size-8 rounded-full'
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in'
              >
                <MenuItem>
                  <a
                    href='#'
                    className='block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none'
                  >
                    {t('topbar.yourProfile')}
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href='#'
                    className='block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none'
                  >
                    {t('topbar.settings')}
                  </a>
                </MenuItem>
                <MenuItem>
                  <a href='#'onClick={handleSignOut} className='block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none'>
                    {t('topbar.signOut')}
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className='lg:hidden'>
        <div className='border-t border-gray-200 pb-3 pt-4'>
          <div className='flex items-center px-4'>
            <div className='shrink-0'>
              <img
                alt=''
                src=''
                className='size-10 rounded-full'
              />
            </div>
            <div className='ml-3'>
              <div className='text-base font-medium text-gray-800'>user name</div>
              <div className='text-sm font-medium text-gray-500'>user@example.com</div>
            </div>
            <button
              type='button'
              className='relative ml-auto shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            >
              <span className='absolute -inset-1.5' />
              <span className='sr-only'>{t('topbar.viewNotifications')}</span>
              <BellIcon aria-hidden='true' className='size-6' />
            </button>
          </div>
          <div className='mt-3 space-y-1'>
            <DisclosureButton
              as='a'
              href='#'
              className='block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            >
              {t('topbar.yourProfile')}
            </DisclosureButton>
            <DisclosureButton
              as='a'
              href='#'
              className='block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            >
              {t('topbar.settings')}
            </DisclosureButton>
            <DisclosureButton
              as='a'
              href='#'
              className='block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            >
              {t('topbar.signOut')}
            </DisclosureButton>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
