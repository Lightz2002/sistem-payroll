import React, { useEffect, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Table, TableProps } from '@/Components/Table';
import useTypedPage from '@/Hooks/useTypedPage';
import { PaginationType, Salary, TableForm, User } from '@/types';
import Create from './Create';
import { AutocompleteType } from '@/Components/Autocomplete';
import Alert from '@/Components/Alert';
import Filter, { SalaryFilter, filtersDefault } from './Filter';
import { useForm } from '@inertiajs/react';
import { FormDataConvertible } from '@inertiajs/core';
import route from 'ziggy-js';
import StatusFilters from './StatusFilter';
import { getUserRole } from '@/Utils/helper';
import axios from 'axios';

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
  const page = useTypedPage<User>();
  const form = useForm(tableForm);
  const form2 = useForm();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    async function refreshSalary() {
      await getSalary();
    }

    if (form.data.filters) {
      refreshSalary();
    }
  }, [form.data.filters]);

  const getSalary = () => {
    form.get(route('salary'), {
      data: {
        ...form.data,
        dateFrom: form.data.filters?.dateFrom,
        dateUntil: form.data.filters?.dateUntil,
        employee: form.data.filters?.employee,
        status: form.data.filters?.status,
      },
      errorBag: 'search',
      preserveScroll: true,
      preserveState: true,
      onError: e => console.log(e),
    });
  };

  const handleSuccess = () => {
    setIsSuccess(true);
    setOpenCreateModal(false);
  };

  const handleFilterModal = () => {
    setOpenFilterModal(true);
  };

  const closeModal = () => {
    setOpenFilterModal(false);
  };

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();

    getSalary();
    closeModal();
  };

  const handleCancelFilter = () => {
    form.reset();
    closeModal();
  };

  const filterStatus = (status: string) => {
    form.setData('filters', {
      employee: form.data.filters?.employee || filtersDefault.employee,
      dateFrom: form.data.filters?.dateFrom || filtersDefault.dateFrom,
      dateUntil: form.data.filters?.dateUntil || filtersDefault.dateUntil,
      processing: form.data.filters?.processing || filtersDefault.processing,
      status: status,
    });
  };

  const filterInitialData = { employees: employeeAutocomplete };

  const handleTableRowClick = (id: number) => {
    form2.get(route('salary.show', id));
  };

  async function handlePrint() {
    try {
      console.log(form.data);
      const res = await axios.post(
        route('salary.printAll'),
        { ...form.data },
        { responseType: 'blob' },
      );
      let blob = new Blob([res.data], { type: res.headers['content-type'] });
      let link = document.createElement('a');
      link.target = '_blank';
      link.href = window.URL.createObjectURL(blob);
      link.click();
    } catch (e) {
      console.log(e);
    }
  }

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
              <StatusFilters
                status={form.data.filters?.status || filtersDefault.status}
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

              {getUserRole() === 'manager' && (
                <button
                  className="ml-2 py-2 px-4 rounded-md text-sm bg-white inline-flex items-center hover:bg-indigo-600 hover:text-white active:bg-indigo-400"
                  onClick={handlePrint}
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
                      d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"
                    />
                  </svg>
                  Print
                </button>
              )}
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
              hideCreateButton={getUserRole() !== 'manager'}
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
