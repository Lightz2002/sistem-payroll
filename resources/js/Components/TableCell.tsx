import { Collection, ColumnType } from '@/types';
import React, { PropsWithChildren, Suspense } from 'react';
import { dynamicComponentMapping } from './DynamicComponents';
import { formatToRupiah } from '@/Utils/helper';

interface Props<T extends Collection> {
  row: T;
  column: ColumnType;
}

export const TableCell = <T extends Collection>({
  row,
  column,
  children,
}: PropsWithChildren<Props<T>>) => {
  return (
    <td className="p-3 border-b cursor-pointer group-hover:bg-slate-200 bg-white border-slate-200">
      {column.component ? (
        <Suspense fallback={<div>Loading...</div>}>
          {dynamicComponentMapping[column.component] &&
            React.createElement(dynamicComponentMapping[column.component], {
              id: row.id,
              value: row[column.key],
              row,
            })}
        </Suspense>
      ) : (
        <div>
          {column.label.toLowerCase().includes('amount')
            ? formatToRupiah(row[column.key])
            : children}
        </div>
      )}
    </td>
  );
};
