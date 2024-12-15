"use client";

import styles from "./AdminMessages.module.scss";

import No_Avatar from "@/../public/no-avatar.jpg";
import { formatChatCardTimestamp } from "@/utils/formatTimestamp";
import { formatImageFromServer, formatMessages } from "@/utils/formatImageName";
import { jost } from "@/font";
import { useRouter } from "next/navigation";
import { SupportChat } from "@/types/support.type";

interface AdminSupportProps {
  chat: SupportChat;
}

export default function AdminSupportItem({ chat }: AdminSupportProps) {
  const router = useRouter();

  const handleOpenChat = () => {
    if (chat && chat.id) {
      router.push(`support/chat?id=${chat.id}`);
    }
  };

  if (chat === undefined) return null;

  return (
    <div
      className={`${styles.message_root} ${jost.className}`}
      onClick={handleOpenChat}
    >
      <div className={styles.users_info}>
        <div
          className={styles.support_avatar}
          style={{
            backgroundImage: `url(${
              !chat.user.avatarPhoto
                ? No_Avatar.src
                : `${
                    process.env.NEXT_PUBLIC_BACKEND_API_URL
                  }${formatImageFromServer(chat.user.avatarPhoto)}`
            })`,
          }}
        />
        <div className={styles.info_block}>
          <h1>Користувач: {chat.user?.name}</h1>
          {chat.lastMessage !== null && chat.lastMessage.content !== null && (
            <p className={styles.text}>
              {formatMessages(chat.lastMessage.content)}
            </p>
          )}
        </div>
      </div>
      <div className={styles.date_block}>
        <p className={styles.date}>
          {formatChatCardTimestamp(chat.lastMessage?.timestamp)}
        </p>
      </div>
    </div>
  );
}
