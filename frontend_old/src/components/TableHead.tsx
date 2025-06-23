import { uniqueId } from 'lodash';

const colStyle =
  'font-normal uppercase text-sm py-3 text-gray-500 py-3 px-6 bg-[#F8F6F2] last:rounded-tr-lg first:rounded-tl-lg';

type TableHeadProps = {
  actionsColumn?: boolean;
  columns: string[];
};

export function TableHead({ actionsColumn, columns }: TableHeadProps) {
  return (
    <thead className='font-amalia-medium text-left'>
      <tr>
        {columns.map((column) => (
          <th className={colStyle} key={uniqueId()}>
            {column}
          </th>
        ))}
        {actionsColumn && <th className={colStyle} />}
      </tr>
    </thead>
  );
}
