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
import { SalaryFilter } from './Filter';
import { useForm } from '@inertiajs/react';
import { Tab } from '@headlessui/react';
import classNames from 'classnames';
import { default as BonusCreate } from './Bonus/Create';
import { default as DeductionCreate } from './Deduction/Create';
import { formatToRupiah, getUserRole } from '@/Utils/helper';
import Dropdown from '@/Components/Dropdown';
import Posted from './Posted';
import useRoute from '@/Hooks/useRoute';
import axios from 'axios';

interface Props extends TableProps<User, SalaryFilter> {
  datas: Salary;
  salaryBonusDatas: PaginationType<SalaryDeductionOrBonus>;
  tableForm: TableForm<SalaryFilter>;
  columnDatas2: ColumnType[];
  columnDatas3: ColumnType[];
}

export default function Show({
  tableForm,
  dataRoute,
  routeParam,
  datas,
  columnDatas,
  columnDatas2,
  columnDatas3,
}: Props) {
  const route = useRoute();

  const page = useTypedPage<User>();
  const form = useForm(tableForm);

  const [openCreateBonusForm, setOpenCreateBonusForm] = useState(false);
  const [openCreateDeductionForm, setOpenCreateDeductionForm] = useState(false);
  const [openPostedForm, setOpenPostedForm] = useState(false);

  const tabs = ['Main', 'Bonus', 'Deduction', 'Absence'];

  const showPostedAction =
    datas.status.toLowerCase() !== 'posted' && getUserRole() === 'manager';

  const handlePosted = () => {
    setOpenPostedForm(true);
  };

  async function handlePrint() {
    try {
      const res = await axios.post(
        route('salary.print', { salary: datas.id }),
        { data: form.data },
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
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 relative">
          <Tab.Group
            onChange={index => {
              form.reset();
              // console.log('Changed selected tab to:', index);
            }}
          >
            <div className="flex items-center">
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

              {/* <!-- Settings Dropdown --> */}
              <div className="ml-auto ">
                <Dropdown
                  align="right"
                  width="48"
                  renderTrigger={() => (
                    <span className="inline-flex rounded-md">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-500 bg-white dark:bg-gray-200 hover:text-gray-500 dark:hover:text-gray-700 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 active:bg-gray-50 dark:active:bg-gray-200 dark:focus:text-white transition ease-in-out duration-150"
                      >
                        Actions
                        <svg
                          className="ml-2 -mr-0.5 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </button>
                    </span>
                  )}
                >
                  <div className="block px-4 py-2 text-xs text-gray-400">
                    All Action
                  </div>

                  {showPostedAction && (
                    <button
                      className="text-left w-full inline-flex items-center px-4 py-2 text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 transition duration-150 ease-in-out"
                      onClick={e => handlePosted()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 me-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Change To Posted
                    </button>
                  )}

                  {getUserRole() === 'manager' && (
                    <button
                      className="text-left w-full inline-flex px-4 py-2 text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 transition duration-150 ease-in-out"
                      onClick={e => handlePrint()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 me-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"
                        />
                      </svg>
                      Print Salary
                    </button>
                  )}

                  <div className="border-t border-gray-200 dark:border-gray-600"></div>
                </Dropdown>
              </div>
            </div>

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
                  <div>
                    <h3 className="font-bold text-lg">Status</h3>
                    <h3 className="text-md">{datas.status}</h3>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Note</h3>
                    <h3 className="text-md">{datas.salary_note}</h3>
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
                    hideCreateButton={getUserRole() !== 'manager'}
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
                    hideCreateButton={getUserRole() !== 'manager'}
                  />

                  <DeductionCreate
                    isOpenModal={openCreateDeductionForm}
                    setIsOpenModal={setOpenCreateDeductionForm}
                    parentId={datas.id}
                  />
                </div>
              </Tab.Panel>
              <Tab.Panel key="Absence">
                <div className="bg-white p-8  rounded-md  min-h-full ">
                  <div className="flex mb-6">
                    <h3 className="ml-auto text-lg">
                      Total Absence: &nbsp;
                      <span className="font-bold">{datas.total_absence}</span>
                    </h3>
                  </div>
                  <Table
                    rowDatas={datas.absence}
                    columnDatas={columnDatas3}
                    dataRoute={dataRoute}
                    routeParam={{ id: datas.id }}
                    form={form}
                    hideCreateButton={false}
                  />
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>

      <Posted
        on={openPostedForm}
        onClose={() => setOpenPostedForm(false)}
        datas={datas}
      />
    </AppLayout>
  );
}
