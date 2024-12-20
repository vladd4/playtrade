'use client';

import StarRating from '../GameCards/StarRating';
import ServiceButton from '../ServiceButtons/ServiceButton';

import styles from './SellerCard.module.scss';

import { MyPurchase } from '@/types/purchase.type';

import { useRouter } from 'next/navigation';

import { formatImageFromServer } from '@/utils/formatImageName';

import No_Avatar from '@/../public/no-avatar.jpg';
import { jost, mont } from '@/font';

type SellerCardProps = {
  isNotification?: boolean;
  isActiveNotification?: boolean;
  buttonLabel?: 'Продати' | 'Купити';
  product?: MyPurchase;
};

export default function SellerPurchaseCard({
  isNotification,
  isActiveNotification,
  buttonLabel,
  product,
}: SellerCardProps) {
  const router = useRouter();

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
            <span>
              {product?.seller?.name ? product?.seller?.name[0]?.toUpperCase() : 'U'}
            </span>
          </div>
          <h1>Продавець {product?.seller?.name}</h1>
          <StarRating
            rating={product?.seller?.rating ? product.seller.rating : 0}
            className={styles.stars}
            size={11}
          />
        </div>
      </div>
      <div className={styles.info}>
        <p className={jost.className}>Назва: {product?.name}</p>
        <p className={jost.className}>Опис: {product?.description}</p>
      </div>
      <div className={styles.bottom_block}>
        <h1 className={`${styles.price} ${mont.className}`}>
          Ціна:
          <br /> {product?.price} $
        </h1>
      </div>
    </div>
  );
}
