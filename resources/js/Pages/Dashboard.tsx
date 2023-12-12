import React from 'react';
import Welcome from '@/Components/Welcome';
import AppLayout from '@/Layouts/AppLayout';
import useTypedPage from '@/Hooks/useTypedPage';
import { getUserRole } from '@/Utils/helper';
import DashboardManager from './DashboardManager';
import DashboardNonManager from './DashboardNonManager';
import { DashboardType } from '@/types';

interface Props {
  data: DashboardType;
}

export default function Dashboard({ data }: Props) {
  return (
    <AppLayout
      title="Dashboard"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Dashboard
        </h2>
      )}
    >
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg py-8 px-4">
            <div id="header" className="text-center text-white mb-8">
              <h1 className="text-xl font-bold mb-2">Toko Multi Bintan</h1>
              <p>Jl. Wisata bahari km.31 Kawal</p>
            </div>

            {getUserRole() === 'manager' ? (
              <DashboardManager data={data} />
            ) : (
              <DashboardNonManager data={data} />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
