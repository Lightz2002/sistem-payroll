import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Table } from '@/Components/Table';
import useTypedPage from '@/Hooks/useTypedPage';
import { ColumnType, User } from '@/types';

interface Props {
  employees: User[];
  columns: ColumnType[];
}

export default function Index({ employees, columns }: Props) {
  const page = useTypedPage<User>();

  return (
    <AppLayout
      title="Employee List"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Employee List
        </h2>
      )}
    >
      <Table<User> rowDatas={employees} columnDatas={columns}></Table>
    </AppLayout>
  );
}
