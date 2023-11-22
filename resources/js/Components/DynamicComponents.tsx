// components/DynamicComponents.js
import { lazy } from 'react';

export const dynamicComponentMapping: Record<
  string,
  React.ComponentType<any>
> = {
  EmployeeAction: lazy(() => import('./Column/Employee/Action')),
  HumanDiff: lazy(() => import('./Column/General/HumanDiff')),
  SalaryBonusAction: lazy(() => import('./Column/Salary/Bonus/Action')),
  SalaryDeductionAction: lazy(() => import('./Column/Salary/Deduction/Action')),
  // Add more components as needed
};
