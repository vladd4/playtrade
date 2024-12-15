"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import LoaderComponent from "@/components/LoaderComponent/LoaderComponent";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AuthHOC = (props: P) => {
    const { isUserAuthenticated, loading } = useAuth();

    const router = useRouter();

    useEffect(() => {
      if (!loading && !isUserAuthenticated) {
        router.push("/login");
      }
    }, [isUserAuthenticated, loading, router]);

    if (loading || !isUserAuthenticated) {
      return <LoaderComponent />;
    }

    return isUserAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  return AuthHOC;
};

export default withAuth;
