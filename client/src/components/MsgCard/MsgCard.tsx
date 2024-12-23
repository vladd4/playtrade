'use client';

import styles from './MsgCard.module.scss';

import { ChatWithLatestMsg } from '@/types/chat.type';

import { useRouter } from 'next/navigation';

import { useAppSelector } from '@/hooks/redux-hooks';

import { formatImageFromServer, formatMessages } from '@/utils/formatImageName';
import { formatChatCardTimestamp } from '@/utils/formatTimestamp';
import { setToSessionStorage } from '@/utils/sessionStorage_helper';

import No_Avatar from '@/../public/no-avatar.jpg';
import { jost } from '@/font';

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

      setToSessionStorage('chatInfo', JSON.stringify(chatInfo));
    }
  };

  return (
    <div className={`${styles.root}`} onClick={handleOpenChat}>
      <div className={`${styles.top_block} ${jost.className}`}>
        {opponent && (
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
              className={styles.image_div}
            >
              <span>{opponent?.name ? opponent?.name[0]?.toUpperCase() : 'U'}</span>
            </div>
            <div className={styles.info_block}>
              <h1>{opponent.name!}</h1>
              <p>Товар: {chat.product?.name}</p>
              <p className={styles.text}>{formatMessages(chat.latestMessage?.content)}</p>
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
