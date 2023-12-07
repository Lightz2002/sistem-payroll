import Alert from '@/Components/Alert';
import ConfirmationModal from '@/Components/ConfirmationModal';
import DangerButton from '@/Components/DangerButton';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import useRoute from '@/Hooks/useRoute';
import { Salary } from '@/types';
import { useForm } from '@inertiajs/react';
import classNames from 'classnames';

import React, { useState } from 'react';

interface Props {
  on: boolean;
  onClose: () => void;
  data: Salary;
}

const Delete = ({ on, onClose, data }: Props) => {
  const form = useForm({
    id: data.id,
  });
  const route = useRoute();

  const handlePosted = () => {
    form.delete(route('salary.destroy', { salary: data.id }), {
      onError: e => {
        console.log(e);
      },
      onSuccess: () => {
        window.alert('Salary deleted successfully');
        onClose();
      },
    });
  };

  return (
    <>
      <ConfirmationModal isOpen={on} onClose={onClose}>
        <ConfirmationModal.Content title={'Delete Salary'}>
          Are you sure you would like to delete this salary?
        </ConfirmationModal.Content>
        <ConfirmationModal.Footer>
          <SecondaryButton onClick={() => onClose()}>
            No, Keep It
          </SecondaryButton>

          <DangerButton
            onClick={handlePosted}
            className={classNames('ml-2', {
              'opacity-25': form.processing,
            })}
            disabled={form.processing}
          >
            Yes, Delete It
          </DangerButton>
        </ConfirmationModal.Footer>
      </ConfirmationModal>
    </>
  );
};

export default Delete;
