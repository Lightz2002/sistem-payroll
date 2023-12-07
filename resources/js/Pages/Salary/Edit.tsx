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
import { Salary, User } from '@/types';
import Alert from '@/Components/Alert';
import useTypedPage from '@/Hooks/useTypedPage';
import RadioButton from '@/Components/RadioButton';
import axios from 'axios';
import moment from 'moment';

interface Props {
  title?: string;
  content?: string;
  button?: string;
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  data: Salary;
}

const Edit = ({
  title = 'Edit Salary',
  content = 'Change salary data here',
  button = 'Save',
  isOpenModal,
  setIsOpenModal,
  data,
  children,
}: PropsWithChildren<Props>) => {
  const page = useTypedPage<User>();
  const [employees, setEmployees] = useState<AutocompleteType[]>([]);

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
    date: moment(data.date).format('YYYY-MM'),
    salary_per_day: data.salary_per_day,
    employee: data.employee_id,
    type: data.type,
    status: data.status.toLowerCase(),
    processing: false,
    terms: false,
  });

  const handleAutocompleteChange = (id: number, value: string) => {
    form.setData('employee', id);
  };

  function editSalary(e: React.FormEvent) {
    e.preventDefault();

    console.log(form.data);

    form.put(route('salary.update', { salary: data.id }), {
      onError: e => console.log(e),
      onSuccess: () => {
        handleSuccess();
      },
    });
  }

  useEffect(() => {
    async function getInitialData() {
      try {
        const res = await axios.get('/autocomplete/employees');
        setEmployees(res.data);
      } catch (e) {
        console.log(e);
      }
    }

    if (isOpenModal) getInitialData();
  }, [isOpenModal]);

  return (
    <>
      <DialogModal isOpen={isOpenModal} onClose={closeModal}>
        <form onSubmit={editSalary}>
          <DialogModal.Content title={title}>
            {content}

            <div className="mt-4">
              <InputLabel htmlFor="date">Date</InputLabel>

              <TextInput
                type="month"
                className="mt-1 block w-3/4"
                placeholder="date"
                value={form.data.date}
                onChange={e => form.setData('date', e.currentTarget.value)}
              />

              <InputError message={form.errors.date} className="mt-2" />
            </div>

            <div className="mt-4">
              <InputLabel htmlFor="salary_per_day">Salary Per Day</InputLabel>

              <TextInput
                type="text"
                className="mt-1 block w-3/4"
                placeholder="salary_per_day"
                value={form.data.salary_per_day}
                onChange={e =>
                  form.setData('salary_per_day', +e.currentTarget.value)
                }
              />

              <InputError
                message={form.errors.salary_per_day}
                className="mt-2"
              />
            </div>

            <div className="mt-4">
              <InputLabel htmlFor="employee">Employee</InputLabel>

              <Autocomplete
                placeholder="Type a employee name"
                suggestions={employees}
                selectedId={form.data.employee}
                onAutocompleteChange={handleAutocompleteChange}
                defaultInputValue={data.employee}
              />

              <InputError message={form.errors.employee} className="mt-2" />
            </div>
          </DialogModal.Content>
          <DialogModal.Footer>
            <SecondaryButton
              type="button"
              onClick={e => {
                e.stopPropagation();
                closeModal();
              }}
            >
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

      <Alert on={isEditSuccess} setOn={setIsEditSuccess}>
        Salary Edited Successfully
      </Alert>
    </>
  );
};

export default Edit;
