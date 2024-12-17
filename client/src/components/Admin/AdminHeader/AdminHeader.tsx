"use client";

import { LogOut, Mail } from "lucide-react";
import styles from "./AdminHeader.module.scss";
import { jost } from "@/font";
import { usePathname, useRouter } from "next/navigation";
import useUserProfile from "@/hooks/useUserProfile";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";

import { Tooltip } from "react-tooltip";
import { useEffect } from "react";
import { setUserRole } from "@/redux/slices/userSlice";
import { adminLogout } from "@/http/authController";
import { useAuth } from "@/context/AuthContext";

export default function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const dispatch = useAppDispatch();

  const { setAdminAccessToken } = useAuth();
  const { adminId } = useAppSelector((state) => state.user);

  const { isLoading, data } = useUserProfile({ id: adminId! });

  useEffect(() => {
    if (data) {
      dispatch(setUserRole(data.role));
    }
  }, [data]);

  const handleLinkClick = (href: string) => {
    router.push(href);
  };

  const handleAdminLogout = async () => {
    const result = await adminLogout();

    if (result) {
      setAdminAccessToken(null);
    }
  };

  return (
    <>
      <header className={styles.root}>
        <h1 className={jost.className}>dashboard</h1>
        {isLoading ? null : (
          <div className={styles.buttons_block}>
            <div
              data-tooltip-id="tooltip"
              data-tooltip-content="Чати користувачів"
              onClick={() => handleLinkClick("/admin/messages")}
              className={`${styles.buttons_item} ${
                pathname.includes("admin/messages") ? styles.active : ""
              }`}
            >
              <Mail size={25} />
            </div>
            <div
              style={{
                backgroundColor: "#B0C4DE",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
                fontSize: "20px",
                fontWeight: "bold",
              }}
              className={styles.avatar}
            >
              <span>{data?.name ? data?.name[0]?.toUpperCase() : "U"}</span>
            </div>
            <div
              data-tooltip-id="tooltip"
              data-tooltip-content="Вийти"
              onClick={handleAdminLogout}
              className={`${styles.buttons_item}`}
            >
              <LogOut size={25} />
            </div>
          </div>
        )}
      </header>
      <Tooltip id="tooltip" place="bottom" className={styles.tooltip} />
    </>
  );
}
