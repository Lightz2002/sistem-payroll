import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export default function PrimaryButton({
  children,
  ...props
}: PropsWithChildren<Props>) {
  return (
    <button
      {...props}
      className={classNames(
        'inline-flex items-center px-4 py-2 bg-indigo-800 dark:bg-indigo-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-indigo-800 uppercase tracking-widest hover:bg-indigo-700 dark:hover:bg-indigo-400 dark:hover:text-white focus:bg-indigo-700 dark:focus:bg-indigo-400 active:bg-indigo-900 dark:active:text-white dark:active:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-indigo-800 transition ease-in-out duration-150',
        props.className,
      )}
    >
      {children}
    </button>
  );
}
