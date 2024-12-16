"use client";

import styles from "./SellerCard.module.scss";
import ServiceButton from "../ServiceButtons/ServiceButton";

import No_Avatar from "@/../public/no-avatar.jpg";
import { jost, mont } from "@/font";
import { useRouter } from "next/navigation";
import StarRating from "../GameCards/StarRating";

import { formatImageFromServer } from "@/utils/formatImageName";
import { MyPurchase } from "@/types/purchase.type";

type SellerCardProps = {
  isNotification?: boolean;
  isActiveNotification?: boolean;
  buttonLabel?: "Продати" | "Купити";
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
      {isNotification && isActiveNotification && (
        <div className={styles.notification} />
      )}
      <div className={`${styles.top_block} ${jost.className}`}>
        <div className={styles.seller_info}>
          <div
            style={{
              backgroundImage: `url(${
                product?.seller?.avatarPhoto
                  ? `${
                      process.env.NEXT_PUBLIC_BACKEND_API_URL
                    }${formatImageFromServer(product.seller?.avatarPhoto)}`
                  : No_Avatar.src
              })`,
            }}
            className={styles.avatar_div}
          />
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
