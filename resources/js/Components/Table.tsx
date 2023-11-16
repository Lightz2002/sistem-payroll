import { ColumnType, Collection, PaginationType } from '@/types';
import React, { ChangeEvent, MouseEvent, useCallback, useEffect } from 'react';
import { TableCell } from './TableCell';
import { upperFirst } from 'lodash';
import SearchBar from './SearchBar';
import { useForm } from '@inertiajs/react';
import useRoute from '@/Hooks/useRoute';
import Pagination from './Pagination';
import PrimaryButton from './PrimaryButton';

export type HandlePageFunction = (newPage: number) => void;

export interface TableProps<Data extends Collection> {
  rowDatas: PaginationType<Data>;
  columnDatas: ColumnType[];
  dataRoute: string;
  sortBy: string;
  sortDirection: string;
  page: number;
  openCreateForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Table = <Data extends Collection>({
  rowDatas,
  columnDatas,
  dataRoute,
  sortBy,
  sortDirection,
  page,
  openCreateForm,
}: TableProps<Data>) => {
  const route = useRoute();

  const form = useForm({
    search: '',
    sortBy: sortBy,
    sortDirection: sortDirection,
    page: page,
  });

  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const newSearchValue = e.currentTarget.value;

      // Update the form data immediately
      form.setData('search', newSearchValue);
    },
    [form],
  );

  const handleSort = (
    e: MouseEvent<HTMLTableCellElement>,
    column: ColumnType,
  ) => {
    if (column.key !== 'action') {
      form.setData('sortBy', column.key);

      if (form.data.sortBy === column.key) {
        form.setData(
          'sortDirection',
          form.data.sortDirection === 'asc' ? 'desc' : 'asc',
        );
      }
    }
  };

  const handlePage = useCallback(
    (newPage: number) => {
      form.setData('page', newPage);
    },
    [form.data.page],
  );

  useEffect(() => {
    async function fetchData() {
      // Use the updated search value when making the get request
      await form.get(route(dataRoute), {
        data: {
          search: form.data.search,
          sortBy: form.data.sortBy,
          sortDirection: form.data.sortDirection,
          page: form.data.page,
        },
        errorBag: 'search',
        preserveScroll: true,
        preserveState: true,
      });
    }
    fetchData();
  }, [
    form.data.search,
    form.data.sortBy,
    form.data.sortDirection,
    form.data.page,
  ]);

  const renderSortIcon = (column: ColumnType) => {
    if (column.key !== form.data.sortBy) return <></>;
    return form.data.sortDirection === 'asc' ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 inline-block ms-2"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 inline-block ms-2"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  return (
    <div className="table-full-container">
      {/* Searchbar */}

      <div className="mb-4 flex items-baseline justify-evenly">
        <SearchBar value={form.data.search} onChange={handleSearch} />

        <PrimaryButton
          type="button"
          className={`ml-auto`}
          onClick={() => openCreateForm(true)}
        >
          Create
        </PrimaryButton>
      </div>

      <div className="mb-4  overflow-hidden rounded-lg shadow-md">
        <table className="table-auto w-full  text-left  border-slate-200">
          <thead>
            <tr>
              {columnDatas.map(column => (
                <th
                  onClick={e => handleSort(e, column)}
                  key={column.key}
                  className="p-3 border-b  border-slate-200 bg-slate-200 text-slate-500 cursor-pointer"
                >
                  {upperFirst(column.label)}
                  {renderSortIcon(column)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowDatas.data?.map(row => (
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

      {/* pagination */}
      <Pagination
        pagination={rowDatas}
        handlePageClick={handlePage}
        page={form.data.page}
      />
    </div>
  );
};
