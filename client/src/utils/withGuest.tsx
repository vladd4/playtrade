'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import LoaderComponent from '@/components/LoaderComponent/LoaderComponent';

import { useAuth } from '@/context/AuthContext';

const withGuest = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const GuestHOC = (props: P) => {
    const { isUserAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && isUserAuthenticated) {
        router.push('/');
      }
    }, [isUserAuthenticated, loading, router]);

    if (loading || isUserAuthenticated) {
      return <LoaderComponent />;
    }

    return <WrappedComponent {...props} />;
  };

  return GuestHOC;
};

export default withGuest;
