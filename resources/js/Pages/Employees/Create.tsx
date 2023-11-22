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

interface Props {
  title?: string;
  content?: string;
  button?: string;
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  data: AutocompleteType[];
  handleSuccess: handleSuccess;
}

const Create = ({
  title = 'Create Employee',
  content = 'For managing employee and their salary, create here',
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
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: data[0]?.id || Number.MIN_SAFE_INTEGER,
    processing: false,
    terms: false,
  });

  const handleAutocompleteChange = (id: number, value: string) => {
    form.setData('role', id);
  };

  function createEmployee(e: React.FormEvent) {
    e.preventDefault();
    const { processing, ...formData } = form; // exclude 'error' and 'processing' properties

    form.post(route('employee.store'), {
      onFinish: () => form.reset('password', 'password_confirmation'),
      onError: e => console.log(e),
      onSuccess: () => {
        handleSuccess();
      },
    });
  }

  return (
    <DialogModal isOpen={isOpenModal} onClose={closeModal}>
      <form onSubmit={createEmployee}>
        <DialogModal.Content title={title}>
          {content}

          <div className="mt-4">
            <InputLabel htmlFor="name">Name</InputLabel>

            <TextInput
              type="text"
              className="mt-1 block w-3/4"
              placeholder="name"
              value={form.data.name}
              onChange={e => form.setData('name', e.currentTarget.value)}
            />

            <InputError message={form.errors.name} className="mt-2" />
          </div>

          <div className="mt-4">
            <InputLabel htmlFor="email">Email</InputLabel>

            <TextInput
              type="text"
              className="mt-1 block w-3/4"
              placeholder="email"
              value={form.data.email}
              onChange={e => form.setData('email', e.currentTarget.value)}
            />

            <InputError message={form.errors.email} className="mt-2" />
          </div>

          <div className="mt-4">
            <InputLabel htmlFor="password">Password</InputLabel>

            <TextInput
              type="password"
              className="mt-1 block w-3/4"
              placeholder="password"
              value={form.data.password}
              onChange={e => form.setData('password', e.currentTarget.value)}
            />

            <InputError message={form.errors.password} className="mt-2" />
          </div>

          <div className="mt-4">
            <InputLabel htmlFor="password_confirmation">
              Confirm Password
            </InputLabel>
            <TextInput
              id="password_confirmation"
              type="password"
              className="mt-1 block w-3/4"
              value={form.data.password_confirmation}
              onChange={e =>
                form.setData('password_confirmation', e.currentTarget.value)
              }
              required
              autoComplete="new-password"
            />
            <InputError
              className="mt-2"
              message={form.errors.password_confirmation}
            />
          </div>

          <div className="mt-4">
            <InputLabel htmlFor="role">Role</InputLabel>

            <Autocomplete
              placeholder="Type a role name"
              suggestions={data}
              selectedId={form.data.role}
              onAutocompleteChange={handleAutocompleteChange}
              defaultInputValue={data[0].value}
            />

            <InputError message={form.errors.role} className="mt-2" />
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
            // onClick={createEmployee}
            // disabled={form.data.processing}
          >
            {button}
          </PrimaryButton>
        </DialogModal.Footer>
      </form>
    </DialogModal>
  );
};

export default Create;
