"use client";

import styles from "./Footer.module.scss";
import { jost } from "@/font";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/redux-hooks";
import { useEffect, useState } from "react";
import { footer_links } from "@/static_store/footer_links";
import useCheckUserBan from "@/hooks/useCheckUserBan";
import { socket } from "@/websocket/socket";

export default function Footer() {
  const pathName = usePathname();

  const router = useRouter();

  const { backButton } = useAppSelector((state) => state.tg);

  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  useCheckUserBan();

  useEffect(() => {
    if (pathName !== "/" && backButton !== null && pathName !== "/login") {
      backButton.show();
      backButton.onClick(() => router.back());
    } else {
      backButton?.hide();
    }
  }, [pathName]);

  useEffect(() => {
    socket.on("connect", () => console.log("Socket connected"));
    socket.on("disconnect", () => console.log("Socket disconnected"));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <footer className={styles.root}>
      <div className={`${styles.wrapper} ${jost.className}`}>
        {footer_links.map((link) => {
          const isActive =
            pathName === link.href ||
            (pathName.includes(link.href) && link.href !== "/") ||
            (pathName.includes("game-details") &&
              link.href !== "/profile" &&
              link.href !== "/messages");

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.icon_block} ${
                isActive ? styles.active : ""
              }`}
            >
              {link.icon}
              <p>{link.label}</p>
              {link.label === "Повідомлення" && hasUnreadMessages && (
                <div className={styles.alert} />
              )}
            </Link>
          );
        })}
      </div>
    </footer>
  );
}
