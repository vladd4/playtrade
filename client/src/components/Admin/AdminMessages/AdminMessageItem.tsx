'use client';

import { Star } from 'lucide-react';

import styles from './AdminMessages.module.scss';

import { AdminChat } from '@/types/chat.type';

import { useRouter } from 'next/navigation';

import { formatImageFromServer, formatMessages } from '@/utils/formatImageName';
import { formatChatCardTimestamp } from '@/utils/formatTimestamp';

import No_Avatar from '@/../public/no-avatar.jpg';
import { jost } from '@/font';

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
    <div className={`${styles.message_root} ${jost.className}`} onClick={handleOpenChat}>
      <div className={styles.users_info}>
        <div className={styles.icons_block}>
          <div
            style={{
              backgroundColor: '#B0C4DE',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff',
              fontSize: '20px',
              fontWeight: 'bold',
            }}
            className={styles.avatar}
          >
            <span>
              {chat.participants[1]?.name
                ? chat.participants[1]?.name[0]?.toUpperCase()
                : 'U'}
            </span>
          </div>
          <div
            style={{
              backgroundColor: '#B0C4DE',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff',
              fontSize: '20px',
              fontWeight: 'bold',
            }}
            className={styles.avatar}
          >
            <span>
              {chat.participants[0]?.name
                ? chat.participants[0]?.name[0]?.toUpperCase()
                : 'S'}
            </span>
          </div>
        </div>
        <div className={styles.info_block}>
          <h1>
            Користувачі: {`${chat.participants[1]?.name}, ${chat.participants[0]?.name}`}{' '}
            {chat.isFavorite && <Star fill="#E8D635" color="#E8D635" />}
          </h1>
          <p>Товар: {chat.productName}</p>
          {chat.lastMessageContent !== null && (
            <p className={styles.text}>{formatMessages(chat.lastMessageContent)}</p>
          )}
        </div>
      </div>
      <div className={styles.date_block}>
        <p className={styles.date}>{formatChatCardTimestamp(chat.lastMessageDate)}</p>
      </div>
    </div>
  );
}
