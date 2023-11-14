import React, { PropsWithChildren } from 'react';

interface Props<T> {
  row: T;
}

export const TableCell = <T,>({
  row,
  children,
}: PropsWithChildren<Props<T>>) => {
  return <td>{children}</td>;
};
