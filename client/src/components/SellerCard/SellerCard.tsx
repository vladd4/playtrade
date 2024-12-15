"use client";

import styles from "./SellerCard.module.scss";
import ServiceButton from "../ServiceButtons/ServiceButton";

import No_Avatar from "@/../public/no-avatar.jpg";
import { jost, mont } from "@/font";
import { useRouter } from "next/navigation";
import StarRating from "../GameCards/StarRating";
import { MiniProduct } from "@/types/product.type";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { setSeller } from "@/redux/slices/sellerSlice";
import { setToSessionStorage } from "@/utils/sessionStorage_helper";
import { formatImageFromServer } from "@/utils/formatImageName";

type SellerCardProps = {
  isMyPurchases?: boolean;
  isNotification?: boolean;
  isActiveNotification?: boolean;
  buttonLabel?: "Продати" | "Купити";
  product?: MiniProduct;
};

export default function SellerCard({
  isMyPurchases,
  isNotification,
  isActiveNotification,
  buttonLabel,
  product,
}: SellerCardProps) {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const handleMoreClick = () => {
    router.push(`/game-details/seller-details/product?id=${product?.id}`);
    const sellerData = {
      name: product?.seller!,
      imageUrl: product?.imageUrl!,
      rating: product?.rating!,
    };
    setToSessionStorage(
      "seller",
      JSON.stringify({
        name: product?.seller!,
        imageUrl: product?.imageUrl!,
        rating: product?.rating!,
      })
    );

    dispatch(setSeller(sellerData));
  };

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
                product?.imageUrl
                  ? `${
                      process.env.NEXT_PUBLIC_BACKEND_API_URL
                    }${formatImageFromServer(product.imageUrl)}`
                  : No_Avatar.src
              })`,
            }}
            className={styles.avatar_div}
          />
          <h1>Продавець {product?.seller}</h1>
          <StarRating
            rating={product?.rating ? product.rating : 0}
            className={styles.stars}
            size={11}
          />
        </div>
      </div>
      <p className={`${styles.platform} ${jost.className}`}>
        Платформа : {product?.platform}
      </p>
      <p className={`${styles.platform} ${jost.className}`}>
        Сервер : {product?.server}
      </p>
      <p className={jost.className}>{product?.description}</p>
      <div className={styles.bottom_block}>
        <h1 className={`${styles.price} ${mont.className}`}>
          Ціна:
          <br /> {product?.price} $
        </h1>
        {!isMyPurchases && (
          <ServiceButton
            className={styles.more_btn}
            isActive
            onClick={handleMoreClick}
          >
            Дивитись більше
          </ServiceButton>
        )}
      </div>
      {isMyPurchases && (
        <div className={styles.purchases_btns}>
          {isNotification ? (
            <ServiceButton
              className={styles.btn}
              isActive
              onClick={() => router.push("/profile/purchase-conditions")}
            >
              {buttonLabel!}
            </ServiceButton>
          ) : (
            <ServiceButton className={styles.btn} isActive>
              Історія чату
            </ServiceButton>
          )}
          {isNotification ? (
            <ServiceButton className={styles.btn}>Відкрити чат</ServiceButton>
          ) : (
            <ServiceButton className={styles.btn}>Допомога</ServiceButton>
          )}
        </div>
      )}
    </div>
  );
}
