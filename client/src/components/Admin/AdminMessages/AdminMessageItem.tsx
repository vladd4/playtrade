"use client";

import styles from "./AdminMessages.module.scss";

import No_Avatar from "@/../public/no-avatar.jpg";
import { formatChatCardTimestamp } from "@/utils/formatTimestamp";
import { formatImageFromServer, formatMessages } from "@/utils/formatImageName";
import { jost } from "@/font";
import { AdminChat } from "@/types/chat.type";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

interface AdminMessageProps {
  chat: AdminChat;
}

export default function AdminMessageItem({ chat }: AdminMessageProps) {
  const router = useRouter();

  const handleOpenChat = () => {
    if (chat && chat.chatId && chat.productName) {
      router.push(`messages/chat?id=${chat.chatId}`);
    }
  };

  if (chat === undefined) return null;

  return (
    <div
      className={`${styles.message_root} ${jost.className}`}
      onClick={handleOpenChat}
    >
      <div className={styles.users_info}>
        <div className={styles.icons_block}>
          <div
            className={styles.avatar}
            style={{
              backgroundImage: `url(${
                !chat.participants[1]?.avatar
                  ? No_Avatar.src
                  : `${
                      process.env.NEXT_PUBLIC_BACKEND_API_URL
                    }${formatImageFromServer(chat.participants[1].avatar)}`
              })`,
            }}
          />
          <div
            className={styles.avatar}
            style={{
              backgroundImage: `url(${
                !chat.participants[0]?.avatar
                  ? No_Avatar.src
                  : `${
                      process.env.NEXT_PUBLIC_BACKEND_API_URL
                    }${formatImageFromServer(chat.participants[0].avatar)}`
              })`,
            }}
          />
        </div>
        <div className={styles.info_block}>
          <h1>
            Користувачі:{" "}
            {`${chat.participants[1]?.name}, ${chat.participants[0]?.name}`}{" "}
            {chat.isFavorite && <Star fill="#E8D635" color="#E8D635" />}
          </h1>
          <p>Товар: {chat.productName}</p>
          {chat.lastMessageContent !== null && (
            <p className={styles.text}>
              {formatMessages(chat.lastMessageContent)}
            </p>
          )}
        </div>
      </div>
      <div className={styles.date_block}>
        <p className={styles.date}>
          {formatChatCardTimestamp(chat.lastMessageDate)}
        </p>
      </div>
    </div>
  );
}
