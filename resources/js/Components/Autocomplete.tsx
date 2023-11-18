import classNames from 'classnames';
import React, { useState } from 'react';

export interface AutocompleteType {
  id: number;
  value: string;
}

interface AutocompleteProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  suggestions: AutocompleteType[];
  onAutocompleteChange: (id: number, value: string) => void;
  selectedId: number;
  defaultInputValue: string;
}

export default function Autocomplete({
  suggestions,
  onAutocompleteChange,
  selectedId,
  defaultInputValue,
  ...props
}: AutocompleteProps) {
  const [filteredSuggestions, setFilteredSuggestions] =
    useState<AutocompleteType[]>(suggestions);
  const [inputValue, setInputValue] = useState(defaultInputValue);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInputValue(inputValue);

    // Filter suggestions based on the input value
    const filtered = suggestions.filter(suggestion =>
      suggestion.value.toLowerCase().includes(inputValue.toLowerCase()),
    );

    setFilteredSuggestions(filtered);

    const selectedRole = suggestions.filter(
      suggestion => suggestion.value.toLowerCase() === inputValue.toLowerCase(),
    );

    onAutocompleteChange(
      selectedRole.length > 0 ? filtered[0].id : Number.MIN_VALUE,
      e.target.value,
    );
  };

  const handleSuggestionClick = (suggestion: AutocompleteType) => {
    setInputValue(suggestion.value);
    setFilteredSuggestions([]);
    onAutocompleteChange(suggestion.id, suggestion.value); // Notify parent about the change with both ID and value
  };

  const handleInputFocus = () => {
    setShowAutocomplete(true);
  };

  const handleInputBlur = () => {
    setShowAutocomplete(false);
  };

  return (
    <div className="autocomplete relative w-3/4">
      <input
        type="text"
        {...props}
        value={inputValue}
        data-id={selectedId}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className={classNames(
          'w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm',
          props.className,
        )}
      />
      {showAutocomplete && (
        <ul className="suggestion-list absolute left-0 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm">
          {filteredSuggestions.map(suggestion => (
            <li
              key={suggestion.id}
              onMouseDown={e => {
                e.preventDefault(); // Prevent the input's onBlur event from triggering
                handleSuggestionClick(suggestion);
              }}
              className="font-bold text-md cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {suggestion.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
