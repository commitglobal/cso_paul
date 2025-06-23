type UserCellProps = {
  itsYou: boolean;
  name: string;
};
export function UserCell({ itsYou, name }: UserCellProps) {
  return (
    <div className='flex gap-x-4'>
      <div className='flex flex-col justify-center'>
        <div className='text-black'>{name}</div>
        {itsYou && <div>(You)</div>}
      </div>
    </div>
  );
}
