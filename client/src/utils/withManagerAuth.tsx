"use client";

import LoaderComponent from "@/components/LoaderComponent/LoaderComponent";
import { useAuth } from "@/context/AuthContext";
import { useAppSelector } from "@/hooks/redux-hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserRoles } from "./constants";

const withManagerAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AuthHOC = (props: P) => {
    const { isAdminAuthenticated, loading } = useAuth();
    const { userRole } = useAppSelector((state) => state.user);
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!isAdminAuthenticated || userRole === UserRoles.USER) {
          router.push("/admin-login");
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

export default withManagerAuth;
