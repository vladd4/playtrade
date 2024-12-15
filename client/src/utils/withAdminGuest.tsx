"use client";

import LoaderComponent from "@/components/LoaderComponent/LoaderComponent";
import { useAuth } from "@/context/AuthContext";
import { useAppSelector } from "@/hooks/redux-hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserRoles } from "./constants";

const withAdminGuest = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const GuestHOC = (props: P) => {
    const { isAdminAuthenticated, loading } = useAuth();
    const { userRole } = useAppSelector((state) => state.user);

    const router = useRouter();

    useEffect(() => {
      if (!loading && isAdminAuthenticated) {
        if (userRole === UserRoles.ADMIN) {
          router.push("/admin");
        } else if (userRole === UserRoles.MANAGER) {
          router.push("/admin/operations");
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
