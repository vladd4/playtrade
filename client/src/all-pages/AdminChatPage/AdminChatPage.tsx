'use client';

import styles from './AdminChat.module.scss';

import AdminChat from '@/components/Admin/AdminChat/AdminChat';
import AdminHeader from '@/components/Admin/AdminHeader/AdminHeader';

import withManagerAuth from '@/utils/withManagerAuth';

function AdminChatPage() {
  return (
    <section className={styles.root}>
      <AdminHeader />
      <article className={styles.table_block}>
        <AdminChat />
      </article>
    </section>
  );
}

export default withManagerAuth(AdminChatPage);
