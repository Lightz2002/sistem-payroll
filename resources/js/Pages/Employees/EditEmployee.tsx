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
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { handleSuccess } from './Index';
import { User } from '@/types';
import axios from 'axios';

interface Props {
  title?: string;
  content?: string;
  button?: string;
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  data: User;
  handleSuccess: handleSuccess;
}

const EditEmployee = ({
  title = 'Edit Employee',
  content = 'Change employee data here',
  button = 'Save',
  isOpenModal,
  setIsOpenModal,
  data,
  children,
  handleSuccess,
}: PropsWithChildren<Props>) => {
  const [roles, setRoles] = useState<AutocompleteType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getInitialData() {
      try {
        const res = await axios.get('/roles');
        setRoles(res.data);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
      }
    }

    if (isOpenModal) getInitialData();
  }, [isOpenModal]);

  function closeModal() {
    setIsOpenModal(false);
  }

  const route = useRoute();
  const userRole = roles.filter(role => role.value === data.roles);

  const form = useForm({
    name: data.name,
    email: data.email,
    role: userRole[0]?.id || Number.MIN_SAFE_INTEGER,
    processing: false,
    terms: false,
  });

  const handleAutocompleteChange = (id: number, value: string) => {
    form.setData('role', id);
  };

  function createEmployee(e: React.FormEvent) {
    e.preventDefault();

    form.post(route('employee.update'), {
      onError: e => console.log(e),
      onSuccess: () => {
        handleSuccess();
      },
    });
  }

  return (
    <DialogModal isOpen={isOpenModal} onClose={closeModal}>
      {isLoading ? (
        <div>...Loading</div>
      ) : (
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
              <InputLabel htmlFor="role">Role</InputLabel>

              <Autocomplete
                placeholder="Type a role name"
                suggestions={roles}
                selectedId={form.data.role}
                onAutocompleteChange={handleAutocompleteChange}
                defaultInputValue={roles[0].value}
              />

              <InputError message={form.errors.role} className="mt-2" />
            </div>
          </DialogModal.Content>
          <DialogModal.Footer>
            <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>

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
      )}
    </DialogModal>
  );
};

export default EditEmployee;
