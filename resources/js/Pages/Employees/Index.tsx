import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Table, TableProps } from '@/Components/Table';
import useTypedPage from '@/Hooks/useTypedPage';
import { PaginationType, User } from '@/types';
import CreateEmployee from './CreateEmployee';

interface Props extends TableProps<User> {
  datas: PaginationType<User>;
}

export default function Index({
  dataRoute,
  datas,
  columnDatas,
  sortBy,
  sortDirection,
  page,
}: Props) {
  // const page = useTypedPage<User>();

  const [openCreateModal, setOpenCreateModal] = useState(false);

  return (
    <AppLayout
      title="Employee List"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Employee List
        </h2>
      )}
    >
      <CreateEmployee
        isOpenModal={openCreateModal}
        setIsOpenModal={setOpenCreateModal}
      />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-8">
            <h3 className="mb-4 text-lg font-bold text-gray-700 dark:text-gray-300">
              Employee List
            </h3>

            <Table<User>
              sortBy={sortBy}
              sortDirection={sortDirection}
              dataRoute={dataRoute}
              rowDatas={datas}
              columnDatas={columnDatas}
              page={page}
              openCreateForm={setOpenCreateModal}
            ></Table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
