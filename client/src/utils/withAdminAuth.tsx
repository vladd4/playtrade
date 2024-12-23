'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import LoaderComponent from '@/components/LoaderComponent/LoaderComponent';

import { useAppSelector } from '@/hooks/redux-hooks';

import { useAuth } from '@/context/AuthContext';

import { UserRoles } from './constants';

const withAdminAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const AuthHOC = (props: P) => {
    const { isAdminAuthenticated, loading } = useAuth();
    const { userRole } = useAppSelector((state) => state.user);
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!isAdminAuthenticated || userRole !== UserRoles.ADMIN) {
          router.push('/admin-login');
        }
      }
    }, [isAdminAuthenticated, loading, userRole, router]);

    if (loading || !isAdminAuthenticated) {
      return <LoaderComponent />;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthHOC;
};

export default withAdminAuth;
