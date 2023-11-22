import Autocomplete, { AutocompleteType } from '@/Components/Autocomplete';
import DialogModal from '@/Components/DialogModal';
import SecondaryButton from '@/Components/SecondaryButton';
import useRoute from '@/Hooks/useRoute';
import { useForm } from '@inertiajs/react';
import classNames from 'classnames';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { SalaryDeductionOrBonus } from '@/types';
import Alert from '@/Components/Alert';
import DangerButton from '@/Components/DangerButton';

interface Props {
  title?: string;
  content?: string;
  button?: string;
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  data: SalaryDeductionOrBonus;
}

const Delete = ({
  title = 'Delete Salary Bonus',
  content = 'You"re going to delete salary bonus, are you sure ?',
  button = 'Yes, Delete',
  isOpenModal,
  setIsOpenModal,
  data,
  children,
}: PropsWithChildren<Props>) => {
  function closeModal() {
    setIsOpenModal(false);
  }

  const handleSuccess = () => {
    window.alert('Salary Bonus Deleted Successfully');
    closeModal();
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

  function deleteSalaryBonus(e: React.FormEvent) {
    e.preventDefault();

    form.delete(route('salary_bonus.destroy', { salaryBonus: data.id }), {
      onError: e => console.log(e),
      onSuccess: () => {
        handleSuccess();
      },
      preserveScroll: true,
      preserveState: true,
    });
  }

  return (
    <>
      <DialogModal isOpen={isOpenModal} onClose={closeModal}>
        <form onSubmit={deleteSalaryBonus}>
          <DialogModal.Content title={title}>{content}</DialogModal.Content>
          <DialogModal.Footer>
            <SecondaryButton type="button" onClick={closeModal}>
              No, Keep It
            </SecondaryButton>

            <DangerButton
              type="submit"
              className={classNames('ml-2', {
                'opacity-25': form.data.processing,
              })}
            >
              {button}
            </DangerButton>
          </DialogModal.Footer>
        </form>
      </DialogModal>
    </>
  );
};

export default Delete;
