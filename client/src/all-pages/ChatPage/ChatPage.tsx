'use client';

import styles from './ChatPage.module.scss';

import Chat from '@/components/ChatComponent/Chat';

import withAuth from '@/utils/withAuth';

import { mont } from '@/font';

interface ChatProps {
  chatId: string;
}

function ChatPage({ chatId }: ChatProps) {
  return (
    <section className={styles.root}>
      <article className={styles.wrapper}>
        <h1 className={mont.className}>Повідомлення</h1>
        <Chat chatId={chatId} />
      </article>
    </section>
  );
}

export default withAuth(ChatPage);
