'use client';

import Pagination from 'rc-pagination/lib/Pagination';

import styles from './AdminMessages.module.scss';

import AdminHeader from '@/components/Admin/AdminHeader/AdminHeader';
import AdminMessageItem from '@/components/Admin/AdminMessages/AdminMessageItem';
import SearchBar from '@/components/Admin/SearchBar/SearchBar';

import { useAppSelector } from '@/hooks/redux-hooks';
import useAdminChats from '@/hooks/useAdminChats';
import usePagination from '@/hooks/usePagination';

import { ITEMS_PER_PAGE_COUNT } from '@/utils/constants';
import withManagerAuth from '@/utils/withManagerAuth';

function AdminMessagesPage() {
  const { page, handlePageChange } = usePagination();

  const { data, isLoading } = useAdminChats({ page });

  const { filteredChat } = useAppSelector((state) => state.filteredAdminItems);

  return (
    <section className={styles.root}>
      <AdminHeader />
      <div className={styles.filter_block}>
        <SearchBar placeholder="Пошук за id..." type="chats" />
      </div>
      <article className={styles.table_block}>
        {filteredChat !== null ? (
          filteredChat ? (
            <AdminMessageItem chat={filteredChat} />
          ) : (
            <p className={styles.no_data}>За вашим пошуком нічого не знайдено.</p>
          )
        ) : isLoading ? null : data && data.chats && data.chats.length > 0 ? (
          <>
            {data.chats.map((chat) => (
              <AdminMessageItem key={chat.chatId} chat={chat} />
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

export default withManagerAuth(AdminMessagesPage);
