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

export interface AbsenceFilter {
  dateFrom: string | undefined;
  dateUntil: string | undefined;
  salaryDate: string | undefined;
  employee: string;
  type: string;
  status: string;
  processing: boolean;
  [key: string]: FormDataConvertible;
}

interface AbsenceFilterInitialData {
  employees: AutocompleteType[];
  types: AutocompleteType[];
}

interface Props {
  on: boolean;
  handleCancel: () => void;
  handleApply: (e: React.FormEvent) => void;
  data: AbsenceFilterInitialData;
  form: InertiaFormProps<TableForm<AbsenceFilter>>;
}

export const absenceFiltersDefault = {
  employee: '',
  dateFrom: '',
  dateUntil: '',
  salaryDate: '',
  type: '',
  status: 'Entry',
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

  const formData = {
    employee: form.data.filters?.employee || absenceFiltersDefault.employee,
    salaryDate:
      form.data.filters?.salaryDate || absenceFiltersDefault.salaryDate,
    dateFrom: form.data.filters?.dateFrom || absenceFiltersDefault.dateFrom,
    dateUntil: form.data.filters?.dateUntil || absenceFiltersDefault.dateUntil,
    processing:
      form.data.filters?.processing || absenceFiltersDefault.processing,
    type: form.data.filters?.type || absenceFiltersDefault.type,
    status: form.data.filters?.status || absenceFiltersDefault.status,
  };

  const handleEmployeeAutocompleteChange = (id: number, value: string) => {
    form.setData('filters', {
      ...formData,
      employee: value,
    });
  };

  const handleTypeAutocompleteChange = (id: number, value: string) => {
    form.setData('filters', {
      ...formData,
      type: value || absenceFiltersDefault.type,
    });
  };

  const selectedEmployee = data.employees.filter(employee => {
    if (form.data.filters?.employee === '') return false;
    return employee.value.includes(form.data.filters?.employee || '');
  });

  const selectedType = data.types.filter(type => {
    if (form.data.filters?.type === '') return false;
    return type.value.includes(form.data.filters?.type || '');
  });

  return (
    <DialogModal isOpen={on} onClose={handleCancel}>
      <form onSubmit={handleApply}>
        <DialogModal.Content title="Filter Absence">
          {getUserRole() === 'manager' && (
            <div className="mt-4">
              <InputLabel htmlFor="date">Salary Date</InputLabel>

              <TextInput
                type="month"
                className="mt-1 block w-3/4 text-white"
                value={form.data.filters?.salaryDate}
                onChange={e =>
                  form.setData('filters', {
                    ...formData,
                    salaryDate: e.currentTarget.value,
                  })
                }
              />

              <InputError message={form.errors.filters} className="mt-2" />
            </div>
          )}
          <div className="mt-4">
            <InputLabel htmlFor="date">Date From</InputLabel>

            <TextInput
              type="date"
              className="mt-1 block w-3/4 text-white"
              value={form.data.filters?.dateFrom}
              onChange={e =>
                form.setData('filters', {
                  ...formData,
                  dateFrom: e.currentTarget.value,
                })
              }
            />

            <InputError message={form.errors.filters} className="mt-2" />
          </div>

          <div className="mt-4">
            <InputLabel htmlFor="date">Date Until</InputLabel>

            <TextInput
              type="date"
              className="mt-1 block w-3/4 text-white"
              value={form.data.filters?.dateUntil}
              onChange={e =>
                form.setData('filters', {
                  ...formData,
                  dateUntil: e.currentTarget.value,
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
                onAutocompleteChange={handleEmployeeAutocompleteChange}
                defaultInputValue={selectedEmployee[0]?.value || ''}
              />

              <InputError message={form.errors.filters} className="mt-2" />
            </div>
          )}

          <div className="mt-4">
            <InputLabel htmlFor="type">Type</InputLabel>

            <Autocomplete
              placeholder="Type a type name"
              suggestions={data.types}
              selectedId={selectedType[0]?.id || Number.MIN_SAFE_INTEGER}
              onAutocompleteChange={handleTypeAutocompleteChange}
              defaultInputValue={selectedType[0]?.value || ''}
            />

            <InputError message={form.errors.filters} className="mt-2" />
          </div>
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
