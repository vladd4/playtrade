'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import LoaderComponent from '@/components/LoaderComponent/LoaderComponent';

import { useAppSelector } from '@/hooks/redux-hooks';

import { useAuth } from '@/context/AuthContext';

import { UserRoles } from './constants';

const withAdminGuest = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const GuestHOC = (props: P) => {
    const { isAdminAuthenticated, loading } = useAuth();
    const { userRole } = useAppSelector((state) => state.user);

    const router = useRouter();

    useEffect(() => {
      if (!loading && isAdminAuthenticated) {
        if (userRole === UserRoles.ADMIN) {
          router.push('/admin');
        } else if (userRole === UserRoles.MANAGER) {
          router.push('/admin');
        }
      }
    }, [isAdminAuthenticated, loading, router, userRole]);

    if (loading || isAdminAuthenticated) {
      return <LoaderComponent />;
    }

    return <WrappedComponent {...props} />;
  };

  return GuestHOC;
};

export default withAdminGuest;
