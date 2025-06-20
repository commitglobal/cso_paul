import { useValidatedProps } from '@/hooks/useValidatedProps';
import { Fragment} from 'react';
import { UsersProps } from './UsersProps';
import {
  DocumentTextIcon,
  EllipsisVerticalIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';
import { Table } from '@/components/Table';
import { TableHead } from '@/components/TableHead';
import { TableBody } from '@/components/TableBody';
import { TableRow } from '@/components/TableRow';
import { TableCell } from '@/components/TableCell';
import { UserCell } from '@/components/UserCell';
import { formatDate } from '@/utils/formaters';
import { Menu, MenuButton,MenuItem, MenuItems, Transition } from '@headlessui/react';
import { Link } from '@inertiajs/react';


export default function Index() {
  const {
    props: { users },
  } = useValidatedProps<UsersProps>(UsersProps);

  return (
    <>
      <div className='flex flex-col gap-y-12'>
        <div className='flex flex-col gap-y-6'>
          <div className='flex justify-between'>
          </div>
        </div>

        <Table>
          <TableHead
            columns={['Id', 'User', 'Role', 'Added on', 'Last activity']}
            actionsColumn
          />
          <TableBody>
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>Nici un rezultat</TableCell>
              </TableRow>
            )}
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  <UserCell
                    avatar={user.avatar ?? ''}
                    name={`${user.last_name} ${user.first_name}`}
                    />
                  {user.email}
                </TableCell>
                <TableCell>{"N/A"}</TableCell>
                <TableCell>{formatDate(user.date_joined)}</TableCell>
                <TableCell>{"N/A"}</TableCell>
                <TableCell>
                  <div className='flex items-center justify-end'>
                    <Menu as='div' className='relative'>
                      <MenuButton>
                        <EllipsisVerticalIcon className='h-6 hover:text-black' />
                      </MenuButton>

                      <Transition
                        as={Fragment}
                        enter='transition ease-out duration-100'
                        enterFrom='transform opacity-0 scale-95'
                        enterTo='transform opacity-100 scale-100'
                        leave='transition ease-in duration-75'
                        leaveFrom='transform opacity-100 scale-100'
                        leaveTo='transform opacity-0 scale-95'
                      >
                        <MenuItems className='absolute right-0 z-10 mt-2.5 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none divide-y'>
                          <MenuItem
                            as={Link}
                            className='hover:bg-gray-50 whitespace-nowrap px-4 py-2 cursor-pointer w-full flex gap-x-3'
                            href='/'
                          >
                            <DocumentTextIcon className='h-5' />
                            User Details
                          </MenuItem>
                          <MenuItem
                            as='button'
                            className='hover:bg-gray-50 whitespace-nowrap px-4 py-2 text-error flex gap-x-3'
                            
                          >
                            <TrashIcon className='h-5' />
                            Delete User
                          </MenuItem>
                        </MenuItems>
                      </Transition>
                    </Menu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
