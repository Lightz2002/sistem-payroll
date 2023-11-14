import { ColumnType, Collection } from '@/types';
import React, { Suspense } from 'react';
import { dynamicComponentMapping } from './DynamicComponents';
import { TableCell } from './TableCell';
import { upperCase } from 'lodash';

interface Props<Data extends Collection> {
  rowDatas: Data[];
  columnDatas: ColumnType[];
}

export const Table = <Data extends Collection>({
  rowDatas,
  columnDatas,
}: Props<Data>) => {
  return (
    <table className="text-white">
      <thead>
        <tr>
          {columnDatas.map(column => (
            <th>{upperCase(column.key)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rowDatas.map(row => (
          <tr key={row.id}>
            {columnDatas.map(column => (
              <td key={column.key}>
                {column.component ? (
                  <Suspense fallback={<div>Loading...</div>}>
                    {dynamicComponentMapping[column.component] &&
                      React.createElement(
                        dynamicComponentMapping[column.component],
                        {
                          id: row.id,
                          value: row[column.key as keyof Data],
                          row,
                        },
                      )}
                  </Suspense>
                ) : (
                  <TableCell row={row}>{row[column.key]}</TableCell>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
