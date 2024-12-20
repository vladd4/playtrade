'use client';

import { Menu } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

import styles from './GamePage.module.scss';

import { useEffect } from 'react';

import GameCard from '@/components/GameCards/GameCard';
import SellerCard from '@/components/SellerCard/SellerCard';
import ServiceButtonsBlock from '@/components/ServiceButtons/ServiceButtonsBlock';

import { setShowFilter } from '@/redux/slices/filterSlice';

import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import useProducts from '@/hooks/useProducts';

import type { ProductType } from '@/utils/constants';
import { getFromSessionStorage } from '@/utils/sessionStorage_helper';
import withAuth from '@/utils/withAuth';

import { jost } from '@/font';

interface GamePageProps {
  gameId: string;
  type: ProductType;
}

function GamePage({ gameId, type }: GamePageProps) {
  const dispatch = useAppDispatch();

  const { ref, inView, entry } = useInView();

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } = useProducts(
    { gameId, type },
  );

  const { filteredProducts, filtersCount } = useAppSelector(
    (state) => state.filteredProducts,
  );

  const game = JSON.parse(getFromSessionStorage('product-game')!);

  useEffect(() => {
    if (entry && inView) {
      fetchNextPage();
    }
  }, [entry]);

  console.log(data?.pages.length);

  return (
    <section className={styles.root}>
      <article className={styles.wrapper}>
        <GameCard
          heading={game.heading}
          description={game.description}
          imageSrc={game.imageSrc}
          id={game.id}
          isFullCard
        />
        <ServiceButtonsBlock />
        <div
          className={`${styles.filter} ${jost.className}`}
          onClick={() => dispatch(setShowFilter(true))}
        >
          <Menu size={18} />
          <p>Фільтри ({filtersCount})</p>
        </div>
        {isLoading ? null : filteredProducts !== null ? (
          filteredProducts.products.length > 0 ? (
            filteredProducts.products.map((product) => (
              <SellerCard key={product.id} product={product} />
            ))
          ) : (
            <p className={styles.no_items}>Поки немає жодних товарів!</p>
          )
        ) : data &&
          data.pages &&
          data.pages.length > 0 &&
          data.pages[0]?.products.length ? (
          data.pages.map(
            (page) =>
              page &&
              page.products.length > 0 &&
              page.products.map((product) => (
                <SellerCard key={product.id} product={product} />
              )),
          )
        ) : (
          <p className={styles.no_items}>Поки немає жодних товарів!</p>
        )}

        {data?.pages[0]?.products && isFetchingNextPage
          ? null
          : hasNextPage && <div ref={ref} />}
      </article>
    </section>
  );
}

export default withAuth(GamePage);
