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
import { handleSuccess } from './Index';
import useTypedPage from '@/Hooks/useTypedPage';
import { User } from '@/types';

interface Props {
  title?: string;
  content?: string;
  button?: string;
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleSuccess: handleSuccess;
}

const Create = ({
  title = 'Create Absence',
  content = 'For tracking record of employee absence',
  button = 'Save',
  isOpenModal,
  setIsOpenModal,
  children,
  handleSuccess,
}: PropsWithChildren<Props>) => {
  const page = useTypedPage<User>();

  const types = [
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
  ];

  function closeModal() {
    setIsOpenModal(false);
  }

  const route = useRoute();

  const form = useForm({
    date: '',
    type: 1,
    employee: page.props.auth.user?.id,
    processing: false,
    terms: false,
  });

  const handleTypeAutocompleteChange = (id: number, value: string) => {
    form.setData('type', id);
  };

  function createAbsence(e: React.FormEvent) {
    e.preventDefault();
    const { processing, ...formData } = form; // exclude 'error' and 'processing' properties

    form.post(route('absence.store'), {
      onError: e => console.log(e),
      onSuccess: () => {
        handleSuccess();
      },
    });
  }

  return (
    <DialogModal isOpen={isOpenModal} onClose={closeModal}>
      <form onSubmit={createAbsence}>
        <DialogModal.Content title={title}>
          {content}

          <div className="mt-4">
            <InputLabel htmlFor="date">Date</InputLabel>

            <TextInput
              type="date"
              className="mt-1 block w-3/4 text-white"
              value={form.data.date}
              onChange={e => form.setData('date', e.currentTarget.value)}
            />

            <InputError message={form.errors.date} className="mt-2" />
          </div>

          <div className="mt-4">
            <InputLabel htmlFor="type">Type</InputLabel>

            <Autocomplete
              placeholder="Type a type name"
              suggestions={types}
              selectedId={form.data.type}
              onAutocompleteChange={handleTypeAutocompleteChange}
              defaultInputValue={types[0]?.value}
            />

            <InputError message={form.errors.type} className="mt-2" />
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
