import React, { useState } from 'react';
import DialogModal from '@/Components/DialogModal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import classNames from 'classnames';
import { useForm } from '@inertiajs/react';
import route from 'ziggy-js';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import moment from 'moment';
import Autocomplete, { AutocompleteType } from '@/Components/Autocomplete';
import { TableForm, User } from '@/types';
import { InertiaFormProps } from '@inertiajs/react/types/useForm';
import { FormDataConvertible } from '@inertiajs/core';
import useTypedPage from '@/Hooks/useTypedPage';
import { getUserRole } from '@/Utils/helper';

export interface SalaryFilter {
  dateFrom: string | undefined;
  dateUntil: string | undefined;
  employee: string;
  status: string;
  processing: boolean;
  [key: string]: FormDataConvertible;
}

interface SalaryFilterInitialData {
  employees: AutocompleteType[];
}

interface Props {
  on: boolean;
  handleCancel: () => void;
  handleApply: (e: React.FormEvent) => void;
  data: SalaryFilterInitialData;
  form: InertiaFormProps<TableForm<SalaryFilter>>;
}

export const filtersDefault = {
  employee: '',
  dateFrom: '',
  dateUntil: '',
  status: 'entry',
  processing: false,
};

export default function Filter({
  on,
  handleApply,
  handleCancel,
  data,
  form,
}: Props) {
  const page = useTypedPage<User>();

  const handleAutocompleteChange = (id: number, value: string) => {
    form.setData('filters', {
      employee: value,
      dateFrom: form.data.filters?.dateFrom || filtersDefault.dateFrom,
      dateUntil: form.data.filters?.dateUntil || filtersDefault.dateUntil,
      processing: form.data.filters?.processing || filtersDefault.processing,
      status: form.data.filters?.status || filtersDefault.status,
    });
  };

  const selectedEmployee = data.employees.filter(employee => {
    if (form.data.filters?.employee === '') return false;
    return employee.value.includes(form.data.filters?.employee || '');
  });

  return (
    <DialogModal isOpen={on} onClose={handleCancel}>
      <form onSubmit={handleApply}>
        <DialogModal.Content title="Filter Salary">
          <div className="mt-4">
            <InputLabel htmlFor="date">Date From</InputLabel>

            <TextInput
              type="month"
              className="mt-1 block w-3/4 text-white"
              value={form.data.filters?.dateFrom}
              onChange={e =>
                form.setData('filters', {
                  employee:
                    form.data.filters?.employee || filtersDefault.employee,
                  dateFrom: e.currentTarget.value,
                  dateUntil:
                    form.data.filters?.dateUntil || filtersDefault.dateUntil,
                  processing:
                    form.data.filters?.processing || filtersDefault.processing,
                  status: form.data.filters?.status || filtersDefault.status,
                })
              }
            />

            <InputError message={form.errors.filters} className="mt-2" />
          </div>

          <div className="mt-4">
            <InputLabel htmlFor="date">Date Until</InputLabel>

            <TextInput
              type="month"
              className="mt-1 block w-3/4 text-white"
              value={form.data.filters?.dateUntil}
              onChange={e =>
                form.setData('filters', {
                  employee:
                    form.data.filters?.employee || filtersDefault.employee,
                  dateFrom:
                    form.data.filters?.dateFrom || filtersDefault.dateFrom,
                  dateUntil: e.currentTarget.value,
                  processing:
                    form.data.filters?.processing || filtersDefault.processing,
                  status: form.data.filters?.status || filtersDefault.status,
                })
              }
            />

            <InputError message={form.errors.filters} className="mt-2" />
          </div>

          {getUserRole() === 'manager' && (
            <div className="mt-4">
              <InputLabel htmlFor="employee">Employee</InputLabel>

              <Autocomplete
                placeholder="Type a employee name"
                suggestions={data.employees}
                selectedId={selectedEmployee[0]?.id || Number.MIN_SAFE_INTEGER}
                onAutocompleteChange={handleAutocompleteChange}
                defaultInputValue={selectedEmployee[0]?.value || ''}
              />

              <InputError message={form.errors.filters} className="mt-2" />
            </div>
          )}
        </DialogModal.Content>
        <DialogModal.Footer>
          <SecondaryButton type="button" onClick={handleCancel}>
            Cancel
          </SecondaryButton>

          <PrimaryButton
            type="submit"
            className={classNames('ml-2', {
              'opacity-25': form.data.filters?.processing,
            })}
          >
            Apply
          </PrimaryButton>
        </DialogModal.Footer>
      </form>
    </DialogModal>
  );
}
