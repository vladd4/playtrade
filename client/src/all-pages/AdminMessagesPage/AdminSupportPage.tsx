'use client';

import Pagination from 'rc-pagination/lib/Pagination';

import styles from './AdminMessages.module.scss';

import AdminHeader from '@/components/Admin/AdminHeader/AdminHeader';
import AdminSupportItem from '@/components/Admin/AdminMessages/AdminSupportItem';

import { useAppSelector } from '@/hooks/redux-hooks';
import usePagination from '@/hooks/usePagination';
import useSupportChats from '@/hooks/useSupportChats';

import { ITEMS_PER_PAGE_COUNT } from '@/utils/constants';
import withManagerAuth from '@/utils/withManagerAuth';

function AdminSupportPage() {
  const { page, handlePageChange } = usePagination();

  const { data, isLoading } = useSupportChats({ page });

  const { filteredSupportChat } = useAppSelector((state) => state.filteredAdminItems);

  return (
    <section className={styles.root}>
      <AdminHeader />
      <article className={styles.table_block}>
        {filteredSupportChat !== null ? (
          filteredSupportChat ? (
            <AdminSupportItem chat={filteredSupportChat} />
          ) : (
            <p className={styles.no_data}>За вашим пошуком нічого не знайдено.</p>
          )
        ) : isLoading ? null : data && data.chats && data.chats.length > 0 ? (
          <>
            {data.chats.map((chat) => (
              <AdminSupportItem key={chat.id} chat={chat} />
            ))}
            {data.totalChats > ITEMS_PER_PAGE_COUNT && (
              <Pagination
                current={page}
                total={data.totalChats}
                pageSize={ITEMS_PER_PAGE_COUNT}
                onChange={handlePageChange}
                className={styles.pagination}
              />
            )}
          </>
        ) : (
          <p className={styles.no_data}>Схоще чатів ще немає.</p>
        )}
      </article>
    </section>
  );
}

export default withManagerAuth(AdminSupportPage);
