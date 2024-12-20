'use client';

import { Plus } from 'lucide-react';

import styles from './MyProducts.module.scss';

import { useRouter } from 'next/navigation';

import FullGameCard from '@/components/GameCards/FullGameCard';

import { useAppSelector } from '@/hooks/redux-hooks';
import useMyProducts from '@/hooks/useMyProducts';

import withAuth from '@/utils/withAuth';

import { jost, mont } from '@/font';

function MyProductsPage() {
  const router = useRouter();

  const { userId } = useAppSelector((state) => state.user);

  const { data, isLoading } = useMyProducts({ userId: userId! });

  if (isLoading) return null;

  return (
    <section className={styles.root}>
      <article className={styles.wrapper}>
        <h1 className={`${mont.className} ${styles.h1}`}>Мої товари</h1>

        {data &&
          data.length > 0 &&
          data.map((item) => {
            return <FullGameCard isMyProduct key={item.id} product={item} />;
          })}
        <div className={`${styles.add_product} ${jost.className}`}>
          <p>
            {data && data.length > 0 ? (
              'Натисніть + щоб додати товар'
            ) : (
              <>
                У вас поки нема товарів!
                <br />
                Натисніть + щоб додати товар
              </>
            )}
          </p>
          <div onClick={() => router.push('/profile/products/create-product')}>
            <Plus color="#fff" size={18} />
          </div>
        </div>
      </article>
    </section>
  );
}

export default withAuth(MyProductsPage);
