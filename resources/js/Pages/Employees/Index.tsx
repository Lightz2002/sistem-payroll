import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Table, TableProps } from '@/Components/Table';
import useTypedPage from '@/Hooks/useTypedPage';
import { PaginationType, TableForm, User } from '@/types';
import Create from './Create';
import { AutocompleteType } from '@/Components/Autocomplete';
import Alert from '@/Components/Alert';
import { useForm } from '@inertiajs/react';
import { FormDataConvertible } from '@inertiajs/core';

interface Props extends TableProps<User, undefined> {
  datas: PaginationType<User>;
  roleAutocomplete: AutocompleteType[];
  tableForm: TableForm<undefined>;
}

export default function Index({
  tableForm,
  dataRoute,
  datas,
  columnDatas,
  roleAutocomplete,
}: Props) {
  // const page = useTypedPage<User>();
  const form = useForm(tableForm);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSuccess = () => {
    setIsSuccess(true);
    setOpenCreateModal(false);
  };

  return (
    <AppLayout
      title="Employee List"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Employee List
        </h2>
      )}
    >
      <Create
        isOpenModal={openCreateModal}
        setIsOpenModal={setOpenCreateModal}
        data={roleAutocomplete}
        handleSuccess={handleSuccess}
      />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-8">
            <h3 className="mb-4 text-lg font-bold text-gray-700 dark:text-gray-300">
              Employee List
            </h3>

            <Table<User, undefined>
              form={form}
              dataRoute={dataRoute}
              rowDatas={datas}
              columnDatas={columnDatas}
              openCreateForm={setOpenCreateModal}
            ></Table>
          </div>
        </div>
      </div>

      <Alert on={isSuccess} setOn={setIsSuccess}>
        Employee Created Successfully
      </Alert>
    </AppLayout>
  );
}
