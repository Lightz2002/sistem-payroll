import Alert from '@/Components/Alert';
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
  parentId: number;
}

const Create = ({
  title = 'Create Salary Bonus',
  content = 'For recording salary bonus for employee',
  button = 'Save',
  isOpenModal,
  setIsOpenModal,
  parentId,
  children,
}: PropsWithChildren<Props>) => {
  const [isCreateSuccess, setIsCreateSuccess] = useState(false);

  function closeModal() {
    setIsOpenModal(false);
  }

  const handleSuccess = () => {
    setIsCreateSuccess(true);
    closeModal();
  };

  const route = useRoute();

  const form = useForm({
    name: '',
    amount: 0,
    salary_id: parentId,
    processing: false,
    terms: false,
  });

  function createSalaryBonus(e: React.FormEvent) {
    e.preventDefault();
    const { processing, ...formData } = form; // exclude 'error' and 'processing' properties

    console.log(form.data);
    form.post(route('salary_bonus.store'), {
      onError: e => console.log(e),
      onSuccess: () => {
        form.reset();
        handleSuccess();
      },
    });
  }

  return (
    <>
      <Alert on={isCreateSuccess} setOn={setIsCreateSuccess}>
        Salary Bonus Created Successfully
      </Alert>

      <DialogModal isOpen={isOpenModal} onClose={closeModal}>
        <form onSubmit={createSalaryBonus}>
          <DialogModal.Content title={title}>
            {content}

            <div className="mt-4">
              <InputLabel htmlFor="name">Name</InputLabel>

              <TextInput
                type="text"
                className="mt-1 block w-3/4 text-white"
                value={form.data.name}
                onChange={e => form.setData('name', e.currentTarget.value)}
              />

              <InputError message={form.errors.name} className="mt-2" />
            </div>

            <div className="mt-4">
              <InputLabel htmlFor="amount">Amount</InputLabel>

              <TextInput
                type="text"
                className="mt-1 block w-3/4"
                placeholder="amount"
                value={form.data.amount}
                onChange={e => form.setData('amount', +e.currentTarget.value)}
              />

              <InputError message={form.errors.amount} className="mt-2" />
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
    </>
  );
};

export default Create;
