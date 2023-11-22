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
import { SalaryDeductionOrBonus } from '@/types';
import Alert from '@/Components/Alert';

interface Props {
  title?: string;
  content?: string;
  button?: string;
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  data: SalaryDeductionOrBonus;
}

const Edit = ({
  title = 'Edit Salary Deduction',
  content = 'Change salary deduction data here',
  button = 'Save',
  isOpenModal,
  setIsOpenModal,
  data,
  children,
}: PropsWithChildren<Props>) => {
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
    name: data.name,
    amount: data.amount,
    salary_id: data.salary_id,
    processing: false,
    terms: false,
  });

  function editSalaryDeduction(e: React.FormEvent) {
    e.preventDefault();

    form.put(route('salary_deduction.update', { salaryDeduction: data.id }), {
      onError: e => console.log(e),
      onSuccess: () => {
        handleSuccess();
      },
    });
  }

  return (
    <>
      <DialogModal isOpen={isOpenModal} onClose={closeModal}>
        <form onSubmit={editSalaryDeduction}>
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
              <InputLabel htmlFor="name">Amount</InputLabel>

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
              // onClick={createEmployee}
              // disabled={form.data.processing}
            >
              {button}
            </PrimaryButton>
          </DialogModal.Footer>
        </form>
      </DialogModal>

      <Alert on={isEditSuccess} setOn={setIsEditSuccess}>
        Salary Deduction Edited Successfully
      </Alert>
    </>
  );
};

export default Edit;
