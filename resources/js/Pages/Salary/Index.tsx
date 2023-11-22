import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Table, TableProps } from '@/Components/Table';
import useTypedPage from '@/Hooks/useTypedPage';
import { PaginationType, Salary, TableForm, User } from '@/types';
import Create from './Create';
import { AutocompleteType } from '@/Components/Autocomplete';
import Alert from '@/Components/Alert';
import Filter, { SalaryFilter } from './Filter';
import { useForm } from '@inertiajs/react';
import { FormDataConvertible } from '@inertiajs/core';
import route from 'ziggy-js';

interface Props extends TableProps<Salary, SalaryFilter> {
  datas: PaginationType<Salary>;
  employeeAutocomplete: AutocompleteType[];
  tableForm: TableForm<SalaryFilter>;
}

export type handleSuccess = () => void;

export default function Index({
  tableForm,
  dataRoute,
  datas,
  columnDatas,
  employeeAutocomplete,
}: Props) {
  // const page = useTypedPage<User>();
  const form = useForm(tableForm);
  const form2 = useForm();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSuccess = () => {
    setIsSuccess(true);
    setOpenCreateModal(false);
  };

  const handleFilterModal = () => {
    setOpenFilterModal(true);
  };

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();

    form.get(route('salary'), {
      data: {
        ...form.data,
        dateFrom: form.data.filters?.dateFrom,
        dateUntil: form.data.filters?.dateUntil,
        employee: form.data.filters?.employee,
      },
      errorBag: 'search',
      preserveScroll: true,
      preserveState: true,
      onError: e => console.log(e),
      onSuccess: () => {
        handleCancelFilter();
      },
    });
  };

  const handleCancelFilter = () => {
    setOpenFilterModal(false);
  };

  const filterInitialData = { employees: employeeAutocomplete };

  const handleTableRowClick = (id: number) => {
    form2.get(route('salary.show', id));
  };

  return (
    <AppLayout
      title="Salary List"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Salary List
        </h2>
      )}
    >
      <Create
        isOpenModal={openCreateModal}
        setIsOpenModal={setOpenCreateModal}
        data={employeeAutocomplete}
        handleSuccess={handleSuccess}
      />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-8">
            <h3 className="mb-4 text-lg font-bold text-gray-700 dark:text-gray-300">
              Salary List
            </h3>

            <div className="flex mb-4">
              <button
                className="ml-auto py-2 px-4 rounded-md text-sm bg-white inline-flex items-center hover:bg-indigo-600 hover:text-white active:bg-indigo-400"
                onClick={handleFilterModal}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 me-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                  />
                </svg>
                Filter
              </button>
            </div>

            <Filter
              on={openFilterModal}
              handleApply={handleApplyFilter}
              handleCancel={handleCancelFilter}
              data={filterInitialData}
              form={form}
            />

            <Table<Salary, SalaryFilter>
              form={form}
              dataRoute={dataRoute}
              rowDatas={datas}
              columnDatas={columnDatas}
              openCreateForm={setOpenCreateModal}
              handleTableRowClick={handleTableRowClick}
            ></Table>
          </div>
        </div>
      </div>

      <Alert on={isSuccess} setOn={setIsSuccess}>
        Salary Created Successfully
      </Alert>
    </AppLayout>
  );
}
