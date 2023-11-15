import { ColumnType, Collection } from '@/types';
import React, { ChangeEvent, useCallback, useEffect } from 'react';
import { TableCell } from './TableCell';
import { upperFirst } from 'lodash';
import SearchBar from './SearchBar';
import { useForm } from '@inertiajs/react';
import useRoute from '@/Hooks/useRoute';

export interface TableProps<Data extends Collection> {
  rowDatas: Data[];
  columnDatas: ColumnType[];
  dataRoute: string;
}

export const Table = <Data extends Collection>({
  rowDatas,
  columnDatas,
  dataRoute,
}: TableProps<Data>) => {
  const route = useRoute();

  const form = useForm({
    search: '',
  });

  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const newSearchValue = e.currentTarget.value;

      // Update the form data immediately
      form.setData('search', newSearchValue);
    },
    [form],
  );

  useEffect(() => {
    async function fetchData() {
      // Use the updated search value when making the get request
      await form.get(route(dataRoute), {
        data: {
          search: form.data.search,
        },
        errorBag: 'search',
        preserveScroll: true,
        preserveState: true,
      });
    }
    fetchData();
  }, [form.data.search]);

  return (
    <div className="table-full-container">
      {/* Searchbar */}
      <SearchBar value={form.data.search} onChange={handleSearchChange} />

      <div className="mb-4  overflow-hidden rounded-lg shadow-md">
        <table className="table-auto w-full  text-left  border-slate-200">
          <thead>
            <tr>
              {columnDatas.map(column => (
                <th
                  key={column.key}
                  className="p-3 border-b  border-slate-200 bg-slate-200 text-slate-500 cursor-pointer"
                >
                  {upperFirst(column.label)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowDatas.map(row => (
              <tr key={row.id}>
                {columnDatas.map(column => (
                  <TableCell key={column.key} row={row} column={column}>
                    {row[column.key]}
                  </TableCell>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
