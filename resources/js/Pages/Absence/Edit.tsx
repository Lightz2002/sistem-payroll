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
import { Absence, User } from '@/types';
import Alert from '@/Components/Alert';
import useTypedPage from '@/Hooks/useTypedPage';
import RadioButton from '@/Components/RadioButton';
import moment from 'moment';

interface Props {
  title?: string;
  content?: string;
  button?: string;
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  data: Absence;
}

const Edit = ({
  title = 'Edit Absence',
  content = 'Change absence data here',
  button = 'Save',
  isOpenModal,
  setIsOpenModal,
  data,
  children,
}: PropsWithChildren<Props>) => {
  const page = useTypedPage<User>();

  const [isEditSuccess, setIsEditSuccess] = useState(false);

  function closeModal() {
    setIsOpenModal(false);
  }

  const handleSuccess = () => {
    closeModal();
    setIsEditSuccess(true);
  };

  const route = useRoute();

  const form = useForm({
    id: data.id,
    date: moment(data.date).format('YYYY-MM-DD'),
    employee: page.props.auth.user?.id,
    type: data.type,
    processing: false,
    terms: false,
  });

  function editAbsence(e: React.FormEvent) {
    e.preventDefault();

    console.log(form.data);

    form.put(route('absence.update', { absence: data.id }), {
      onError: e => console.log(e),
      onSuccess: () => {
        handleSuccess();
      },
    });
  }

  return (
    <>
      <DialogModal isOpen={isOpenModal} onClose={closeModal}>
        <form onSubmit={editAbsence}>
          <DialogModal.Content title={title}>
            {content}

            <div className="mt-4">
              <InputLabel htmlFor="date">Date</InputLabel>

              <TextInput
                type="date"
                className="mt-1 block w-3/4"
                placeholder="date"
                value={form.data.date}
                onChange={e => form.setData('date', e.currentTarget.value)}
              />

              <InputError message={form.errors.date} className="mt-2" />
            </div>

            <div className="mt-4">
              <InputLabel htmlFor="type">Type</InputLabel>

              <InputLabel htmlFor="type">
                <RadioButton
                  name="radioGroup"
                  className="me-2"
                  value="Present"
                  onChange={e => form.setData('type', e.currentTarget.value)}
                  checked={form.data.type === 'Present'}
                />
                Present
              </InputLabel>

              <InputLabel htmlFor="type">
                <RadioButton
                  name="radioGroup"
                  className="me-2"
                  value="Permission"
                  onChange={e => form.setData('type', e.currentTarget.value)}
                  checked={form.data.type === 'Permission'}
                />
                Permission
              </InputLabel>

              <InputLabel htmlFor="radioGroup">
                <RadioButton
                  name="radioGroup"
                  className="me-2"
                  value="Sick"
                  onChange={e => form.setData('type', e.currentTarget.value)}
                  checked={form.data.type === 'Sick'}
                />
                Sick
              </InputLabel>

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
              // onClick={createEmployee}
              // disabled={form.data.processing}
            >
              {button}
            </PrimaryButton>
          </DialogModal.Footer>
        </form>
      </DialogModal>

      <Alert on={isEditSuccess} setOn={setIsEditSuccess}>
        Absence Edited Successfully
      </Alert>
    </>
  );
};

export default Edit;
