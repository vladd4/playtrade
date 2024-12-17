import styles from "./SellerSmall.module.scss";

import No_Avatar from "@/../public/no-avatar.jpg";
import { jost } from "@/font";
import { MessageSquareText } from "lucide-react";
import StarRating from "../GameCards/StarRating";
import { formatImageFromServer } from "@/utils/formatImageName";

type SellerSmallCardProps = {
  isFeed?: boolean;
  date?: string;
  userAvatar?: string;
  userName: string;
  userRating: number;
  reviewsCount?: number;
};

export default function SellerSmallCard({
  isFeed,
  date,
  userName,
  userRating,
  userAvatar,
  reviewsCount,
}: SellerSmallCardProps) {
  return (
    <div className={`${styles.root} ${isFeed ? styles.feed_root : ""}`}>
      <div className={`${styles.top_block} ${jost.className}`}>
        <div className={styles.seller_info}>
          <div
            style={{
              backgroundColor: "#B0C4DE",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff",
              fontSize: "12px",
              fontWeight: "bold",
            }}
            className={styles.avatar_div}
          >
            <span>{userName ? userName[0]?.toUpperCase() : "U"}</span>
          </div>
          <div className={styles.info_block}>
            <h1>{userName}</h1>
            <StarRating
              size={11}
              rating={userRating ? userRating : 0}
              className={styles.stars}
            />
            {!isFeed && (
              <p>{reviewsCount ? reviewsCount : 0} відгуків за 1 рік</p>
            )}
          </div>
        </div>
        {isFeed ? (
          <p className={styles.date}>{date}</p>
        ) : (
          <MessageSquareText size={26} />
        )}
      </div>
      {isFeed && <p className={`${styles.comment} ${jost.className}`}>Супер</p>}
    </div>
  );
}
