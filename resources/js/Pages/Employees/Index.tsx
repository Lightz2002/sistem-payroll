import React from 'react';
import AppLayout from '@/Layouts/AppLayout';

export default function Index() {
  return (
    <AppLayout
      title="Employee List"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Employee List
        </h2>
      )}
    >
      <p>tes</p>
    </AppLayout>
  );
}
