import React, { useEffect, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Table, TableProps } from '@/Components/Table';
import useTypedPage from '@/Hooks/useTypedPage';
import { PaginationType, Absence, TableForm, User } from '@/types';
import Create from './Create';
import { AutocompleteType } from '@/Components/Autocomplete';
import Alert from '@/Components/Alert';
import Filter, { AbsenceFilter, absenceFiltersDefault } from './Filter';
import { useForm } from '@inertiajs/react';
import { FormDataConvertible } from '@inertiajs/core';
import route from 'ziggy-js';
import StatusFilters from '../Salary/StatusFilter';

interface Props extends TableProps<Absence, AbsenceFilter> {
  datas: PaginationType<Absence>;
  employeeAutocomplete: AutocompleteType[];
  tableForm: TableForm<AbsenceFilter>;
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
    form.reset();
  };

  const handleFilterModal = () => {
    setOpenFilterModal(true);
  };

  const closeModal = () => {
    setOpenFilterModal(false);
  };

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();

    getAbsence();
    closeModal();
  };

  const handleCancelFilter = () => {
    form.reset();
    closeModal();
  };

  const filterInitialData = {
    employees: employeeAutocomplete,
    types: [
      {
        id: 1,
        value: 'Present',
      },
      {
        id: 2,
        value: 'Permission',
      },
      {
        id: 3,
        value: 'Sick',
      },
    ],
  };

  const filterStatus = (status: string) => {
    form.setData('filters', {
      salaryDate:
        form.data.filters?.salaryDate || absenceFiltersDefault.salaryDate,
      dateFrom: form.data.filters?.dateFrom || absenceFiltersDefault.dateFrom,
      dateUntil:
        form.data.filters?.dateUntil || absenceFiltersDefault.dateUntil,
      employee: form.data.filters?.employee || absenceFiltersDefault.employee,
      status: status,
      processing:
        form.data.filters?.processing || absenceFiltersDefault.processing,
      type: form.data.filters?.type || absenceFiltersDefault.type,
    });
  };

  function getAbsence() {
    form.get(route('absence'), {
      data: {
        ...form.data,
        salaryDate: form.data.filters?.salaryDate,
        dateFrom: form.data.filters?.dateFrom,
        dateUntil: form.data.filters?.dateUntil,
        type: form.data.filters?.type,
        search: form.data.filters?.search,
        status: form.data.filters?.status,
        employee: form.data.filters?.employee,
      },
      errorBag: 'search',
      preserveScroll: true,
      preserveState: true,
      onError: e => console.log(e),
    });
  }

  useEffect(() => {
    async function refreshAbsence() {
      await getAbsence();
    }

    if (form.data.filters) {
      refreshAbsence();
    }
  }, [form.data.filters]);

  return (
    <AppLayout
      title="Absence List"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Absence List
        </h2>
      )}
    >
      <Create
        isOpenModal={openCreateModal}
        setIsOpenModal={setOpenCreateModal}
        handleSuccess={handleSuccess}
      />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-8">
            <h3 className="mb-4 text-lg font-bold text-gray-700 dark:text-gray-300">
              Absence List
            </h3>

            <div className="flex mb-4">
              <StatusFilters
                status={
                  form.data.filters?.status || absenceFiltersDefault.status
                }
                filterStatus={filterStatus}
              />

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

            <Table<Absence, AbsenceFilter>
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
        Absence Created Successfully
      </Alert>
    </AppLayout>
  );
}
