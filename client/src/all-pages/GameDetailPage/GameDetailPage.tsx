'use client';

import styles from './GameDetail.module.scss';

import FullGameCard from '@/components/GameCards/FullGameCard';
import SellerSmallCard from '@/components/SellerCard/SellerSmallCard';
import ServiceButton from '@/components/ServiceButtons/ServiceButton';

import { useAppSelector } from '@/hooks/redux-hooks';
import useProduct from '@/hooks/useProduct';

import { getFromSessionStorage } from '@/utils/sessionStorage_helper';
import withAuth from '@/utils/withAuth';

interface DetailsProps {
  productId: string;
}

function GameDetailPage({ productId }: DetailsProps) {
  const { data, isLoading } = useProduct({ id: productId });

  const { seller } = useAppSelector((state) => state.seller);

  const { userId } = useAppSelector((state) => state.user);

  const sellerInfo = seller ?? JSON.parse(getFromSessionStorage('seller')!);

  if (isLoading) return null;

  return (
    <section className={styles.root}>
      <article className={styles.wrapper}>
        <SellerSmallCard
          reviewsCount={data?.reviewsCount}
          userName={sellerInfo.name!}
          userAvatar={sellerInfo.imageUrl!}
          userRating={sellerInfo.rating!}
        />
        <FullGameCard product={data!} />
        <div className={styles.feed_block}>
          <h3>Відгуки продавця:</h3>
          {data?.latestReviews && data?.latestReviews.length > 0 ? (
            data?.latestReviews.map((review) => {
              return (
                <SellerSmallCard
                  key={review.id}
                  isFeed
                  date={review.id}
                  userName={review.sellerId}
                  userRating={review.rating}
                />
              );
            })
          ) : (
            <p>
              {userId === data?.ownerId
                ? 'Ви ще не отримали відгуку!'
                : 'Користувач ще не отримав відгуку!'}
            </p>
          )}
          {data?.latestReviews && data?.latestReviews.length > 0 && (
            <ServiceButton isActive className={styles.feed_btn}>
              Дивитись більше
            </ServiceButton>
          )}
        </div>
      </article>
    </section>
  );
}

export default withAuth(GameDetailPage);
