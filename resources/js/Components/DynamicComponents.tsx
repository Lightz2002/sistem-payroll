// components/DynamicComponents.js
import { lazy } from 'react';

export const dynamicComponentMapping: Record<
  string,
  React.ComponentType<any>
> = {
  TestComponent1: lazy(() => import('./TestComponent1')),
  TestComponent2: lazy(() => import('./TestComponent2')),
  EmployeeAction: lazy(() => import('./Column/Employee/Action')),
  HumanDiff: lazy(() => import('./Column/General/HumanDiff')),
  // Add more components as needed
};
