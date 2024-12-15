"use client";

import styles from "./AdminUsers.module.scss";

import AdminHeader from "@/components/Admin/AdminHeader/AdminHeader";
import AdminTable from "@/components/Admin/AdminTable/AdminTable";
import SearchBar from "@/components/Admin/SearchBar/SearchBar";
import useAllUsers from "@/hooks/useAllUsers";
import { ITEMS_PER_PAGE_COUNT } from "@/utils/constants";

import Pagination from "rc-pagination/lib/Pagination";

import "rc-pagination/assets/index.css";
import AdminBanAlert from "@/components/Admin/AdminBanAlert/AdminBanAlert";
import usePagination from "@/hooks/usePagination";
import { useAppSelector } from "@/hooks/redux-hooks";
import withManagerAuth from "@/utils/withManagerAuth";

function AdminUsersPage() {
  const { page, handlePageChange } = usePagination();

  const { data, isLoading } = useAllUsers(page);

  const { filteredUsers } = useAppSelector((state) => state.filteredAdminItems);

  return (
    <>
      <section className={styles.root}>
        <AdminHeader />
        <div className={styles.filter_block}>
          <SearchBar placeholder="Пошук за іменем..." type="users" />
        </div>
        {filteredUsers !== null ? (
          filteredUsers.length > 0 ? (
            <article className={styles.table_block}>
              <AdminTable
                type="users"
                usersTableData={filteredUsers}
                page={page}
              />
            </article>
          ) : (
            <p className={styles.no_data}>
              За вашим пошуком нічого не знайдено.
            </p>
          )
        ) : isLoading ? null : data && data.users && data.users.length > 0 ? (
          <article className={styles.table_block}>
            <AdminTable type="users" usersTableData={data.users} page={page} />
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
          <p className={styles.no_data}>Схоще користувачів ще немає.</p>
        )}
      </section>
      <AdminBanAlert />
    </>
  );
}

export default withManagerAuth(AdminUsersPage);
