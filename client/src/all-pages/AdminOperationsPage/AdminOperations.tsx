'use client';

import Pagination from 'rc-pagination/lib/Pagination';

import styles from './AdminOperations.module.scss';

import AdminHeader from '@/components/Admin/AdminHeader/AdminHeader';
import AdminTable from '@/components/Admin/AdminTable/AdminTable';
import SearchBar from '@/components/Admin/SearchBar/SearchBar';

import useAdminTransactions from '@/hooks/useAdminTransactions';
import usePagination from '@/hooks/usePagination';

import { ITEMS_PER_PAGE_COUNT } from '@/utils/constants';
import withManagerAuth from '@/utils/withManagerAuth';

function AdminOperations() {
  const { page, handlePageChange } = usePagination();

  const { data, isLoading } = useAdminTransactions(page);

  return (
    <section className={styles.root}>
      <AdminHeader />
      <div className={styles.filter_block}>
        <SearchBar placeholder="Пошук за айді..." type="users" />
      </div>
      {isLoading ? null : data && data.transactions && data.transactions.length > 0 ? (
        <article className={styles.table_block}>
          <AdminTable
            type="operations"
            operationsTableData={data.transactions}
            page={page}
          />
          {data.totalTransactions <= ITEMS_PER_PAGE_COUNT ? null : (
            <Pagination
              current={page}
              total={data.totalTransactions}
              pageSize={ITEMS_PER_PAGE_COUNT}
              onChange={handlePageChange}
              className={styles.pagination}
            />
          )}
        </article>
      ) : (
        <p className={styles.no_data}>Схоще транзакцій ще немає.</p>
      )}
    </section>
  );
}

export default withManagerAuth(AdminOperations);
