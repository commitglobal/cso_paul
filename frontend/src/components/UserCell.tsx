import { Avatar } from '@/components/Avatar';

type UserCellProps = {
  avatar: string;
  lastEdit?: string;
  name: string;
};
export function UserCell({ avatar, name, lastEdit }: UserCellProps) {
  return (
    <div className='flex gap-x-4'>
      <Avatar size='medium' src={avatar} />
      <div className='flex flex-col justify-center'>
        <div className='text-black'>{name}</div>
        {lastEdit && <div>{lastEdit}</div>}
      </div>
    </div>
  );
}
