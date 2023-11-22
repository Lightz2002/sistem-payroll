import { Transition } from '@headlessui/react';
import React, { PropsWithChildren, useEffect } from 'react';

interface Props {
  on: boolean;
  setOn: React.Dispatch<React.SetStateAction<boolean>>;
  type?: 'success' | 'info' | 'error' | 'warning';
  className?: string;
}

export default function Alert({
  on,
  setOn,
  className,
  type,
  children,
}: PropsWithChildren<Props>) {
  let bgColor = 'bg-green-100';
  let color = 'text-green-800';
  let icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6 me-2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  switch (type) {
    case 'info':
      bgColor = 'bg-blue-100';
      color = 'text-blue-800';
      icon = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6 me-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      );
      break;
    case 'error':
      bgColor = 'bg-red-100';
      color = 'text-red-800';
      icon = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6 me-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      );
      break;
    case 'warning':
      bgColor = 'bg-orange-100';
      color = 'text-orange-800';
      icon = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6 me-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      );
      break;
    default:
      /* success alert */
      break;
  }

  useEffect(() => {
    console.log('useEffect triggered:', on);

    if (on) {
      console.log('Setting timeout to hide alert');
      setTimeout(() => {
        console.log('Hiding alert now');
        setOn(false);
      }, 2000);
    }

    return () => {
      console.log('unmounted');
    };
  }, [on]);

  return (
    <Transition
      show={on}
      enter="transition-opacity duration-75"
      enterFrom="opacity-0"
      leave="transition ease-in duration-1000"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      className={`ml-auto fixed right-0 top-0`}
    >
      <div
        className={`alert py-2 flex items-center text-sm px-8  ${color} ${bgColor} ${className}`}
      >
        {icon}
        {children}
      </div>
    </Transition>
  );
}
