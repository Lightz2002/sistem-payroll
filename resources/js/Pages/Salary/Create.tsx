import Autocomplete, { AutocompleteType } from '@/Components/Autocomplete';
import DialogModal from '@/Components/DialogModal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import useRoute from '@/Hooks/useRoute';
import { useForm } from '@inertiajs/react';
import classNames from 'classnames';
import React, { PropsWithChildren, useState } from 'react';

interface Props {
  title?: string;
  content?: string;
  button?: string;
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  data: AutocompleteType[];
  handleSuccess: () => void;
}

const Create = ({
  title = 'Create Salary',
  content = 'For tracking record of employee monthly salary',
  button = 'Save',
  isOpenModal,
  setIsOpenModal,
  data,
  children,
  handleSuccess,
}: PropsWithChildren<Props>) => {
  function closeModal() {
    setIsOpenModal(false);
  }

  const route = useRoute();

  const form = useForm({
    date: '',
    employee: data[0]?.id || Number.MIN_SAFE_INTEGER,
    processing: false,
    terms: false,
  });

  const handleAutocompleteChange = (id: number, value: string) => {
    form.setData('employee', id);
  };

  function createSalary(e: React.FormEvent) {
    e.preventDefault();
    const { processing, ...formData } = form; // exclude 'error' and 'processing' properties

    form.post(route('salary.store'), {
      onError: e => console.log(e),
      onSuccess: () => {
        handleSuccess();
      },
    });
  }

  return (
    <DialogModal isOpen={isOpenModal} onClose={closeModal}>
      <form onSubmit={createSalary}>
        <DialogModal.Content title={title}>
          {content}

          <div className="mt-4">
            <InputLabel htmlFor="date">Date</InputLabel>

            <TextInput
              type="month"
              className="mt-1 block w-3/4 text-white"
              value={form.data.date}
              onChange={e => form.setData('date', e.currentTarget.value)}
            />

            <InputError message={form.errors.date} className="mt-2" />
          </div>

          <div className="mt-4">
            <InputLabel htmlFor="employee">Employee</InputLabel>

            <Autocomplete
              placeholder="Type a employee name"
              suggestions={data}
              selectedId={form.data.employee}
              onAutocompleteChange={handleAutocompleteChange}
              defaultInputValue={data[0].value}
            />

            <InputError message={form.errors.employee} className="mt-2" />
          </div>
        </DialogModal.Content>
        <DialogModal.Footer>
          <SecondaryButton type="button" onClick={closeModal}>
            Cancel
          </SecondaryButton>

          <PrimaryButton
            type="submit"
            className={classNames('ml-2', {
              'opacity-25': form.data.processing,
            })}
          >
            {button}
          </PrimaryButton>
        </DialogModal.Footer>
      </form>
    </DialogModal>
  );
};

export default Create;
