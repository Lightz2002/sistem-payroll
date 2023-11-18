// components/DynamicComponents.js
import { lazy } from 'react';

export const dynamicComponentMapping: Record<
  string,
  React.ComponentType<any>
> = {
  EmployeeAction: lazy(() => import('./Column/Employee/Action')),
  HumanDiff: lazy(() => import('./Column/General/HumanDiff')),
  // Add more components as needed
};
