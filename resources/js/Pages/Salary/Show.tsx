import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Table, TableProps } from '@/Components/Table';
import useTypedPage from '@/Hooks/useTypedPage';
import {
  ColumnType,
  PaginationType,
  Salary,
  SalaryDeductionOrBonus,
  TableForm,
  User,
} from '@/types';
import { AutocompleteType } from '@/Components/Autocomplete';
import Alert from '@/Components/Alert';
import Filter, { SalaryFilter } from './Filter';
import { useForm } from '@inertiajs/react';
import route from 'ziggy-js';
import { Tab } from '@headlessui/react';
import classNames from 'classnames';
import { default as BonusCreate } from './Bonus/Create';
import { default as DeductionCreate } from './Deduction/Create';
import { formatToRupiah } from '@/Utils/helper';

interface Props extends TableProps<User, SalaryFilter> {
  datas: Salary;
  salaryBonusDatas: PaginationType<SalaryDeductionOrBonus>;
  tableForm: TableForm<SalaryFilter>;
  columnDatas2: ColumnType[];
}

export default function Show({
  tableForm,
  dataRoute,
  routeParam,
  datas,
  columnDatas,
  columnDatas2,
}: Props) {
  // const page = useTypedPage<User>();
  const form = useForm(tableForm);
  const [openCreateBonusForm, setOpenCreateBonusForm] = useState(false);
  const [openCreateDeductionForm, setOpenCreateDeductionForm] = useState(false);

  const tabs = ['Main', 'Bonus', 'Deduction'];

  return (
    <AppLayout
      title="Salary List"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Salary List
        </h2>
      )}
    >
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Tab.Group
            onChange={index => {
              form.reset();
              // console.log('Changed selected tab to:', index);
            }}
          >
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 w-3/6">
              {tabs.map(tab => (
                <Tab
                  key={tab}
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                      'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white text-blue-700 shadow'
                        : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
                    )
                  }
                >
                  {tab}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel key="Main">
                <div className="bg-white p-8  rounded-md  min-h-full grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold text-lg">Date</h3>
                    <h3 className="text-md">{datas.date}</h3>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Employee</h3>
                    <h3 className="text-md">{datas.employee}</h3>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Salary Per Day</h3>
                    <h3 className="text-md">
                      {formatToRupiah(datas.salary_per_day)}
                    </h3>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Total Salary</h3>
                    <h3 className="text-md">
                      {formatToRupiah(datas.total_amount)}
                    </h3>
                  </div>
                </div>
              </Tab.Panel>
              <Tab.Panel key="Bonus">
                <div className="bg-white p-8  rounded-md  min-h-full ">
                  <div className="flex mb-6">
                    <h3 className="ml-auto text-lg">
                      Total Bonus: &nbsp;
                      <span className="font-bold">
                        {formatToRupiah(datas.total_salary_bonus)}
                      </span>
                    </h3>
                  </div>
                  <Table
                    rowDatas={datas.salary_bonus}
                    columnDatas={columnDatas}
                    dataRoute={dataRoute}
                    routeParam={{ id: datas.id }}
                    form={form}
                    openCreateForm={setOpenCreateBonusForm}
                  />

                  <BonusCreate
                    isOpenModal={openCreateBonusForm}
                    setIsOpenModal={setOpenCreateBonusForm}
                    parentId={datas.id}
                  />
                </div>
              </Tab.Panel>
              <Tab.Panel key="Deduction">
                <div className="bg-white p-8  rounded-md  min-h-full ">
                  <div className="flex mb-6">
                    <h3 className="ml-auto text-lg">
                      Total Deduction: &nbsp;
                      <span className="font-bold">
                        {formatToRupiah(datas.total_salary_deduction)}
                      </span>
                    </h3>
                  </div>
                  <Table
                    rowDatas={datas.salary_deductions}
                    columnDatas={columnDatas2}
                    dataRoute={dataRoute}
                    routeParam={{ id: datas.id }}
                    form={form}
                    openCreateForm={setOpenCreateDeductionForm}
                  />

                  <DeductionCreate
                    isOpenModal={openCreateDeductionForm}
                    setIsOpenModal={setOpenCreateDeductionForm}
                    parentId={datas.id}
                  />
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </AppLayout>
  );
}
