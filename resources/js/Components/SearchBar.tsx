import React, {
  forwardRef,
  DetailedHTMLProps,
  InputHTMLAttributes,
} from 'react';
import PrimaryButton from './PrimaryButton';

interface SearchBarProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  createUrl?: string;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>((props, ref) => {
  const { createUrl, ...inputProps } = props;

  return (
    <div className="mb-4 flex items-baseline justify-evenly">
      <div className="w-1/2 relative">
        <input
          {...inputProps}
          ref={ref}
          name="search"
          type="search"
          placeholder="Search..."
          className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-md shadow-sm w-full"
        />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="stroke-slate-400 w-6 h-6 absolute top-1/2 right-10 translate-y-[-50%]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>

      {createUrl && <PrimaryButton className="ml-auto">Create</PrimaryButton>}
      {/* <x-primary-button type="redirect" className="ml-auto" :href="$this->createUrl">Create</x-primary-button> */}
    </div>
  );
});

export default SearchBar;
