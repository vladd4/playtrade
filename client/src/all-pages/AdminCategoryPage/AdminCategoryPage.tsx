'use client';

import styles from './AdminCategory.module.scss';

import AdminHeader from '@/components/Admin/AdminHeader/AdminHeader';
import AdminCategoryButtons from '@/components/Admin/AdminTable/AdminCategoryButtons';
import AdminTable from '@/components/Admin/AdminTable/AdminTable';
import CreateGameForm from '@/components/Admin/CreateForms/CreateGameForm';
import CreatePlatformForm from '@/components/Admin/CreateForms/CreatePlatformForm';
import Filter from '@/components/Admin/Filter/Filter';
import SearchBar from '@/components/Admin/SearchBar/SearchBar';

import { useAppSelector } from '@/hooks/redux-hooks';
import useAdmingames from '@/hooks/useAdminGames';

import withManagerAuth from '@/utils/withManagerAuth';

function AdminCategoryPage() {
  const { data, isLoading } = useAdmingames();

  const { showCreateGameAlert } = useAppSelector((state) => state.alert);

  const { filteredGames, sortedGames } = useAppSelector(
    (state) => state.filteredAdminItems,
  );

  return (
    <>
      <section className={styles.root}>
        <AdminHeader />
        {!showCreateGameAlert && (
          <>
            <div className={styles.filter_block}>
              <AdminCategoryButtons />
            </div>
            <div className={styles.filter_block}>
              <Filter />
              <SearchBar placeholder="Пошук за назвою..." type="games" />
            </div>
          </>
        )}
        {showCreateGameAlert ? null : filteredGames !== null ? (
          filteredGames.length > 0 ? (
            <article className={styles.table_block}>
              <AdminTable type="games" gamesTableData={filteredGames} />
            </article>
          ) : (
            <p className={styles.no_data}>За вашим пошуком нічого не знайдено.</p>
          )
        ) : sortedGames !== null ? (
          sortedGames.length > 0 ? (
            <article className={styles.table_block}>
              <AdminTable type="games" gamesTableData={sortedGames} />
            </article>
          ) : (
            <p className={styles.no_data}>За вашим пошуком нічого не знайдено.</p>
          )
        ) : isLoading ? null : data && data.length > 0 ? (
          <article className={styles.table_block}>
            <AdminTable type="games" gamesTableData={data} />
          </article>
        ) : (
          <p className={styles.no_data}>Схоже ще немає ігор.</p>
        )}
        <CreateGameForm />
      </section>
      <CreatePlatformForm games={data ?? []} />
    </>
  );
}

export default withManagerAuth(AdminCategoryPage);
