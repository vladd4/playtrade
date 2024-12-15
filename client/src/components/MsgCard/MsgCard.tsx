"use client";

import styles from "./MsgCard.module.scss";

import No_Avatar from "@/../public/no-avatar.jpg";
import { jost } from "@/font";
import { useAppSelector } from "@/hooks/redux-hooks";
import { ChatWithLatestMsg } from "@/types/chat.type";
import { formatImageFromServer, formatMessages } from "@/utils/formatImageName";
import { formatChatCardTimestamp } from "@/utils/formatTimestamp";
import { setToSessionStorage } from "@/utils/sessionStorage_helper";

import { useRouter } from "next/navigation";

type MsgCardProps = {
  chat: ChatWithLatestMsg;
  isAlert?: boolean;
};

export default function MsgCard({ chat, isAlert }: MsgCardProps) {
  const router = useRouter();

  const { userId } = useAppSelector((state) => state.user);

  const opponent = chat.participants.filter((user) => user.id !== userId)[0];

  const handleOpenChat = () => {
    if (chat && opponent && chat.product) {
      router.push(`/messages/chat?chatId=${chat.id}`);

      const chatInfo = {
        sellerName: opponent.name,
        sellerAvatar: opponent.avatarPhoto,
        sellerId: opponent.id,
        productName: chat.product.name,
        productId: chat.product.id,
      };

      setToSessionStorage("chatInfo", JSON.stringify(chatInfo));
    }
  };

  return (
    <div className={`${styles.root}`} onClick={handleOpenChat}>
      <div className={`${styles.top_block} ${jost.className}`}>
        {opponent && (
          <div className={styles.seller_info}>
            <div
              className={styles.image_div}
              style={{
                backgroundImage: `url(${
                  opponent.avatarPhoto === null
                    ? No_Avatar.src
                    : `${
                        process.env.NEXT_PUBLIC_BACKEND_API_URL
                      }${formatImageFromServer(opponent.avatarPhoto)}`
                })`,
              }}
            />
            <div className={styles.info_block}>
              <h1>{opponent.name!}</h1>
              <p>Товар: {chat.product?.name}</p>
              <p className={styles.text}>
                {formatMessages(chat.latestMessage?.content)}
              </p>
            </div>
          </div>
        )}

        <div className={styles.date_block}>
          <p className={styles.date}>
            {formatChatCardTimestamp(chat.latestMessage?.timestamp)}
          </p>
          {isAlert && <div className={styles.alert} />}
        </div>
      </div>
    </div>
  );
}
