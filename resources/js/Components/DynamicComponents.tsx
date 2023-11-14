// components/DynamicComponents.js
import { lazy } from 'react';

export const dynamicComponentMapping: Record<
  string,
  React.ComponentType<any>
> = {
  TestComponent1: lazy(() => import('./TestComponent1')),
  TestComponent2: lazy(() => import('./TestComponent2')),
  // Add more components as needed
};
