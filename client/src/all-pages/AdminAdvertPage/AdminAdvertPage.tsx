'use client';

import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';

import styles from './AdminAdvert.module.scss';

import AdminHeader from '@/components/Admin/AdminHeader/AdminHeader';
import AdminTable from '@/components/Admin/AdminTable/AdminTable';
import SearchBar from '@/components/Admin/SearchBar/SearchBar';

import { useAppSelector } from '@/hooks/redux-hooks';
import useAdminProducts from '@/hooks/useAdminProducts';
import usePagination from '@/hooks/usePagination';

import { ITEMS_PER_PAGE_COUNT } from '@/utils/constants';
import withManagerAuth from '@/utils/withManagerAuth';

function AdminAdvertPage() {
  const { page, handlePageChange } = usePagination();

  const { data, isLoading } = useAdminProducts(page);

  const { filteredProducts } = useAppSelector((state) => state.filteredAdminItems);

  return (
    <section className={styles.root}>
      <AdminHeader />
      <div className={styles.filter_block}>
        <SearchBar placeholder="Пошук за назвою..." type="products" />
      </div>
      {filteredProducts !== null ? (
        filteredProducts.length > 0 ? (
          <article className={styles.table_block}>
            <AdminTable
              type="advertisement"
              advertTableData={filteredProducts}
              page={page}
            />
          </article>
        ) : (
          <p className={styles.no_data}>За вашим пошуком нічого не знайдено.</p>
        )
      ) : isLoading ? null : data && data.products && data.products.length > 0 ? (
        <article className={styles.table_block}>
          <AdminTable type="advertisement" advertTableData={data.products} page={page} />
          {data.totalProducts <= ITEMS_PER_PAGE_COUNT ? null : (
            <Pagination
              current={page}
              total={data.totalProducts}
              pageSize={ITEMS_PER_PAGE_COUNT}
              onChange={handlePageChange}
              className={styles.pagination}
            />
          )}
        </article>
      ) : (
        <p className={styles.no_data}>Схоще оголошень ще немає.</p>
      )}
    </section>
  );
}

export default withManagerAuth(AdminAdvertPage);
