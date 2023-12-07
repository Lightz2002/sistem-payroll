import classNames from 'classnames';
import React, { forwardRef } from 'react';

const RadioButton = forwardRef<
  HTMLInputElement,
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
>((props, ref) => (
  <input
    type="radio"
    {...props}
    ref={ref}
    className={classNames(
      'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm',
      props.className,
    )}
  />
));

export default RadioButton;
