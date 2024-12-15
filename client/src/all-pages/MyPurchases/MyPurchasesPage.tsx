"use client";

import styles from "./MyPurchases.module.scss";

import { mont } from "@/font";

import SellerCard from "@/components/SellerCard/SellerCard";

import withAuth from "@/utils/withAuth";

import usePurchases from "@/hooks/usePurchases";
import { useAppSelector } from "@/hooks/redux-hooks";

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
            return (
              <SellerCard isMyPurchases key={purchase.id} product={purchase} />
            );
          })
        ) : (
          <p className={`${styles.no_data}`}>Схоже у вас ще нема покупок!</p>
        )}
      </article>
    </section>
  );
}

export default withAuth(MyPurchasesPage);
