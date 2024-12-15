"use client";

import styles from "./AdminChat.module.scss";

import AdminHeader from "@/components/Admin/AdminHeader/AdminHeader";

import AdminSupport from "@/components/Admin/AdminChat/AdminSupport";
import withManagerAuth from "@/utils/withManagerAuth";

function AdminSupportPage() {
  return (
    <section className={styles.root}>
      <AdminHeader />
      <article className={styles.table_block}>
        <AdminSupport />
      </article>
    </section>
  );
}

export default withManagerAuth(AdminSupportPage);
