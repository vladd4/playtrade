'use client';

import 'rc-pagination/assets/index.css';
import Pagination from 'rc-pagination/lib/Pagination';

import styles from './AdminUsers.module.scss';

import AdminHeader from '@/components/Admin/AdminHeader/AdminHeader';
import AdminTable from '@/components/Admin/AdminTable/AdminTable';

import useAllManagers from '@/hooks/useAllManagers';
import usePagination from '@/hooks/usePagination';

import { ITEMS_PER_PAGE_COUNT } from '@/utils/constants';
import withAdminAuth from '@/utils/withAdminAuth';

function AdminManagersPage() {
  const { page, handlePageChange } = usePagination();

  const { data, isLoading } = useAllManagers(page);

  return (
    <section className={styles.root}>
      <AdminHeader />
      {isLoading ? null : data && data.users && data.users.length > 0 ? (
        <article className={styles.table_block}>
          <AdminTable type="managers" usersTableData={data.users} page={page} />
          {data.totalUsers <= ITEMS_PER_PAGE_COUNT ? null : (
            <Pagination
              current={page}
              total={data.totalUsers}
              pageSize={ITEMS_PER_PAGE_COUNT}
              onChange={handlePageChange}
              className={styles.pagination}
            />
          )}
        </article>
      ) : (
        <p className={styles.no_data}>Схоще менеджерів/адмінів ще немає.</p>
      )}
    </section>
  );
}

export default withAdminAuth(AdminManagersPage);
