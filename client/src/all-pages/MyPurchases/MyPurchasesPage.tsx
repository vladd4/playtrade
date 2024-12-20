'use client';

import styles from './MyPurchases.module.scss';

import SellerPurchaseCard from '@/components/SellerCard/SellerPurchaseCard';

import { useAppSelector } from '@/hooks/redux-hooks';
import usePurchases from '@/hooks/usePurchases';

import withAuth from '@/utils/withAuth';

import { mont } from '@/font';

function MyPurchasesPage() {
  const { userId } = useAppSelector((state) => state.user);

  const { data, isLoading } = usePurchases({ id: userId! });

  if (isLoading) return null;

  return (
    <section className={styles.root}>
      <article className={styles.wrapper}>
        <h1 className={`${mont.className} ${styles.h1}`}>Покупки</h1>
        {data && data.length > 0 ? (
          data.map((purchase) => {
            return <SellerPurchaseCard key={purchase.id} product={purchase} />;
          })
        ) : (
          <p className={`${styles.no_data}`}>Схоже у вас ще нема покупок!</p>
        )}
      </article>
    </section>
  );
}

export default withAuth(MyPurchasesPage);
