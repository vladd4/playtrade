'use client';

import styles from './AdminFinance.module.scss';

import AdminHeader from '@/components/Admin/AdminHeader/AdminHeader';
import AdminTable from '@/components/Admin/AdminTable/AdminTable';
import InfoCard from '@/components/Admin/InfoCard/InfoCard';
import SearchBar from '@/components/Admin/SearchBar/SearchBar';

import withManagerAuth from '@/utils/withManagerAuth';

function AdminFinancePage() {
  return (
    <section className={styles.root}>
      <AdminHeader />
      <div className={styles.cards_block}>
        <InfoCard
          label="gb coins"
          type="Прибуток платформи"
          amount="+11000"
          className={styles.main_card}
        />
        <div className={styles.cards_wrapper}>
          <div className={styles.two_cards}>
            <InfoCard
              label=""
              type="Загальний обсяг транзакцій"
              amount="478"
              className={styles.smaller}
            />
            <InfoCard
              label="gb coins"
              type="Середня сума угоди"
              amount="100"
              className={styles.smaller}
            />
          </div>
          <div className={styles.two_cards}>
            <InfoCard
              label="gb coins"
              type="Сума виведених коштів"
              amount="1790"
              className={styles.smaller}
            />
            <InfoCard
              label="gb coins"
              type="Сума поповнень балансу"
              amount="1790"
              className={styles.smaller}
            />
          </div>
        </div>
      </div>
      <div className={styles.filter_block}>
        <SearchBar type="users" placeholder="Пошук за айді..." />
      </div>
      {/* <article className={styles.table_block}>
        <AdminTable type="users" />
      </article> */}
      <p className={styles.no_data}>Схоще фінансів ще немає.</p>
    </section>
  );
}

export default withManagerAuth(AdminFinancePage);
