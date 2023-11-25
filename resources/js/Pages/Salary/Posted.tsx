import Alert from '@/Components/Alert';
import ConfirmationModal from '@/Components/ConfirmationModal';
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
  datas: Salary;
}

const Posted = ({ on, onClose, datas }: Props) => {
  const [isPostedSuccess, setIsPostedSuccess] = useState(false);
  const postedForm = useForm({
    id: datas.id,
    date: datas.date,
    employee: datas.employee_id,
    total_amount: datas.total_amount,
    salary_per_day: datas.salary_per_day,
    status: 'posted',
  });
  const route = useRoute();

  const handlePosted = () => {
    postedForm.put(route('salary.update', { salary: datas.id }), {
      onError: e => {
        console.log(e);
      },
      onSuccess: () => {
        console.log(1);
        onClose();
        setIsPostedSuccess(true);
      },
    });
  };

  return (
    <>
      <ConfirmationModal isOpen={on} onClose={onClose}>
        <ConfirmationModal.Content title={'Change Salary To Posted'}>
          Are you sure you would like to change salary to posted?
        </ConfirmationModal.Content>
        <ConfirmationModal.Footer>
          <SecondaryButton onClick={() => onClose()}>Cancel</SecondaryButton>

          <PrimaryButton
            onClick={handlePosted}
            className={classNames('ml-2', {
              'opacity-25': postedForm.processing,
            })}
            disabled={postedForm.processing}
          >
            Yes
          </PrimaryButton>
        </ConfirmationModal.Footer>
      </ConfirmationModal>

      <Alert on={isPostedSuccess} setOn={setIsPostedSuccess}>
        Changed To Posted Successfully
      </Alert>
    </>
  );
};

export default Posted;
