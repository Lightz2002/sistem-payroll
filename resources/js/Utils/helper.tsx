import useTypedPage from '@/Hooks/useTypedPage';
import { InertiaSharedProps, User } from '@/types';
import { Page } from '@inertiajs/core';

export const formatToRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const getUserRole = () => {
  const page = useTypedPage<User>();

  return page.props.auth.user?.roles[0]?.name;
};
