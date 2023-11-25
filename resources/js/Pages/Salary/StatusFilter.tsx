import React from 'react';

interface StatusFilter {
  name: string;
  activeStyle: string;
  hoverStyle: string;
  icon: React.ReactNode;
}

interface Props {
  status: string;
  filterStatus: (status: string) => void;
}

const StatusFilters = ({ status, filterStatus }: Props) => {
  const statusArr: StatusFilter[] = [
    {
      name: 'entry',
      activeStyle: '!bg-yellow-100 !text-yellow-800',
      hoverStyle: 'hover:bg-teal-100 hover:text-teal-800',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-4 h-4 me-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
      ),
    },
    {
      name: 'posted',
      activeStyle: '!bg-teal-100 !text-teal-800',
      hoverStyle: 'hover:bg-teal-100 hover:text-teal-800',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 me-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    // ... other status filters
  ];

  return (
    <div className="flex">
      {statusArr.map(item => (
        <div
          key={item.name}
          onClick={() => filterStatus(item.name)}
          className={`hover:cursor-pointer me-2 text-left w-32 py-2 flex font-bold items-center rounded-md text-slate-800 bg-slate-400 text-sm px-4 ${
            item.hoverStyle
          } ${status === item.name ? item.activeStyle : ''}`}
        >
          {item.icon}
          {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
        </div>
      ))}
    </div>
  );
};

export default StatusFilters;
