import Alert from '@/Components/Alert';
import useRoute from '@/Hooks/useRoute';
import Delete from '@/Pages/Salary/Deduction/Delete';
import Edit from '@/Pages/Salary/Deduction/Edit';
import { Link } from '@inertiajs/react';
import React, { useState } from 'react';

interface Props {
  id: number;
  row: any;
  value: number | string;
}

const Action = ({ id, row, value }: Props) => {
  const route = useRoute();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isEditSuccess, setIsEditSuccess] = useState(false);

  function handleSuccess() {
    setIsEditSuccess(true);
    setOpenEditModal(false);
  }

  return (
    <>
      <div className="inline-flex align-items-center ">
        <button
          onClick={() => setOpenEditModal(true)}
          className="inline-flex me-4 border bg-cyan-400 text-white px-4 py-2 text-xs rounded-md hover:bg-cyan-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4 stroke-white me-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
            />
          </svg>
          <span>Edit</span>
        </button>
        <button
          data-user-id={id}
          className="edit-user-button inline-flex me-4 border bg-red-400 text-white px-4 py-2 text-xs rounded-md hover:bg-red-600"
          onClick={() => setOpenDeleteModal(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4 stroke-white me-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
          <span>Delete</span>
        </button>
      </div>

      <Alert on={isEditSuccess} setOn={setIsEditSuccess}>
        Salary Deduction Edited Successfully
      </Alert>

      <Edit
        data={row}
        isOpenModal={openEditModal}
        setIsOpenModal={setOpenEditModal}
      />

      <Delete
        data={row}
        isOpenModal={openDeleteModal}
        setIsOpenModal={setOpenDeleteModal}
      />
    </>
  );
};

export default Action;
