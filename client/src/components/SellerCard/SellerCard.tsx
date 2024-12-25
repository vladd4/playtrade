'use client';

import StarRating from '../GameCards/StarRating';
import ServiceButton from '../ServiceButtons/ServiceButton';

import styles from './SellerCard.module.scss';

import { MiniProduct } from '@/types/product.type';

import { useRouter } from 'next/navigation';

import { setSeller } from '@/redux/slices/sellerSlice';

import { useAppDispatch } from '@/hooks/redux-hooks';

import { formatImageFromServer } from '@/utils/formatImageName';
import { setToSessionStorage } from '@/utils/sessionStorage_helper';

import No_Avatar from '@/../public/no-avatar.jpg';
import { jost, mont } from '@/font';

type SellerCardProps = {
  isNotification?: boolean;
  isActiveNotification?: boolean;
  product?: MiniProduct;
};

export default function SellerCard({
  isNotification,
  isActiveNotification,
  product,
}: SellerCardProps) {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const handleMoreClick = () => {
    router.push(`/game-details/seller-details/product?id=${product?.id}`);
    const sellerData = {
      id: product?.sellerId!,
      name: product?.seller!,
      imageUrl: product?.imageUrl!,
      rating: product?.sellerRating!,
    };
    setToSessionStorage(
      'seller',
      JSON.stringify({
        name: product?.seller!,
        imageUrl: product?.imageUrl!,
        rating: product?.sellerRating!,
        id: product?.sellerId!,
      }),
    );

    dispatch(setSeller(sellerData));
  };

  return (
    <div className={styles.root}>
      {isNotification && isActiveNotification && <div className={styles.notification} />}
      <div className={`${styles.top_block} ${jost.className}`}>
        <div className={styles.seller_info}>
          <div
            style={{
              backgroundColor: '#B0C4DE',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
            className={styles.avatar_div}
          >
            <span>{product?.seller ? product?.seller[0]?.toUpperCase() : 'U'}</span>
          </div>
          <h1>Продавець {product?.seller}</h1>
          <StarRating
            rating={product?.sellerRating ? product.sellerRating : 0}
            className={styles.stars}
            size={11}
          />
        </div>
      </div>
      <p className={`${styles.platform} ${jost.className}`}>
        Платформа : {product?.platform}
      </p>
      <p className={`${styles.platform} ${jost.className}`}>Сервер : {product?.server}</p>
      <p className={jost.className}>{product?.description}</p>
      <div className={styles.bottom_block}>
        <h1 className={`${styles.price} ${mont.className}`}>
          Ціна:
          <br /> {product?.price} $
        </h1>

        <ServiceButton className={styles.more_btn} isActive onClick={handleMoreClick}>
          Дивитись більше
        </ServiceButton>
      </div>
    </div>
  );
}
