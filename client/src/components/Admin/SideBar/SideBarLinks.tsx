"use client";

import { jost } from "@/font";
import styles from "./SideBar.module.scss";

import { usePathname } from "next/navigation";
import { admin_links } from "@/static_store/admin_links";
import Link from "next/link";
import { useAppSelector } from "@/hooks/redux-hooks";

export default function SideBarLinks() {
  const pathName = usePathname();
  const { userRole } = useAppSelector((state) => state.user);
  return (
    <div className={`${styles.links_block} ${jost.className}`}>
      {admin_links.map((link) => {
        return (
          userRole !== null &&
          link.roles.includes(userRole) && (
            <Link
              href={link.href}
              key={link.href}
              className={`${styles.link_div} ${
                pathName === link.href ||
                (pathName.includes(link.href) && link.href !== "/admin")
                  ? styles.active_link
                  : ""
              }`}
            >
              {link.icon}
              <p>{link.label}</p>
            </Link>
          )
        );
      })}
    </div>
  );
}
