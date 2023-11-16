import { PaginationType, Collection, PaginationLink } from '@/types';
import React, { MouseEvent, useState } from 'react';
import { HandlePageFunction } from './Table';

interface PaginationProps<Data extends Collection> {
  pagination: PaginationType<Data>; // Replace 'string' with the type of your data
  handlePageClick: HandlePageFunction;
  page: number;
}

const Pagination = <Data extends Collection>({
  pagination,
  handlePageClick,
  page,
}: PaginationProps<Data>) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e: MouseEvent<HTMLLIElement>, link: PaginationLink) => {
    e.stopPropagation();

    if (link.label.includes('Previous')) {
      if (!link.url) return;
      page = page - 1;
      console.log(page);
    } else if (link.label.includes('Next')) {
      if (!link.url) return;
      page = page + 1;
      console.log(page);
    } else {
      page = +link.label;
      console.log(+link.label);
    }

    handlePageClick(page);
    setIsClicked(true);
  };

  const renderPageNumbers = () => {
    return pagination.links.map(page => {
      return (
        <li
          onClick={e => handleClick(e, page)}
          key={page.label}
          className={`bg-white py-2 px-4 border border-indigo-400 hover:bg-indigo-400 hover:text-white hover:cursor-pointer ${
            page.active ? 'active bg-indigo-700 text-white' : ''
          } ${
            isClicked
              ? 'focus:outline-none focus:ring focus:border-indigo-300 active:bg-indigo-700'
              : ''
          } ${
            page.url
              ? ''
              : 'bg-gray-400  pointer-events-none cursor-not-allowed '
          }`}
        >
          {
            new DOMParser().parseFromString(page.label, 'text/html').body
              .textContent
          }
        </li>
      );
    });
  };

  return (
    <div className="flex">
      {/* Display pagination */}
      <ul className="pagination flex ml-auto">{renderPageNumbers()}</ul>
    </div>
  );
};

export default Pagination;
