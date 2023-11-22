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
      page = +page - 1;
    } else if (link.label.includes('Next')) {
      if (!link.url) return;
      page = +page + 1;
    } else {
      page = +link.label;
    }

    handlePageClick(page);
    setIsClicked(true);
  };

  const renderPageNumbers = () => {
    return pagination.links.map(page => {
      const enabledPageLinkClass = page.url
        ? 'bg-white'
        : 'bg-gray-400 pointer-events-none cursor-not-allowed';
      const activePageClass = page.active
        ? 'active bg-indigo-700 text-white'
        : enabledPageLinkClass;
      const clickedPageClass = isClicked
        ? 'focus:outline-none focus:ring focus:border-indigo-300 active:bg-indigo-700'
        : '';

      return (
        <li
          onClick={e => handleClick(e, page)}
          key={page.label}
          className={`py-2 px-4 border border-indigo-400 hover:bg-indigo-400 hover:text-white hover:cursor-pointer ${activePageClass} ${clickedPageClass}`}
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
