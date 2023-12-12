// components/DynamicComponents.js
import { lazy } from 'react';

export const dynamicComponentMapping: Record<
  string,
  React.ComponentType<any>
> = {
  EmployeeAction: lazy(() => import('./Column/Employee/Action')),
  HumanDiff: lazy(() => import('./Column/General/HumanDiff')),
  SalaryAction: lazy(() => import('./Column/Salary/Action')),
  SalaryBonusAction: lazy(() => import('./Column/Salary/Bonus/Action')),
  SalaryDeductionAction: lazy(() => import('./Column/Salary/Deduction/Action')),
  AbsenceAction: lazy(() => import('./Column/Absence/Action')),
  // Add more components as needed
};
