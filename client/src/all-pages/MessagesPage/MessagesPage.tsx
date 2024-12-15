"use client";

import styles from "./Messages.module.scss";

import { mont } from "@/font";

import MsgCard from "@/components/MsgCard/MsgCard";

import withAuth from "@/utils/withAuth";

import useChats from "@/hooks/useChats";

import { useEffect, useState } from "react";
import { ChatWithLatestMsg } from "@/types/chat.type";
import { socket } from "@/websocket/socket";
import { useAppSelector } from "@/hooks/redux-hooks";

function MessagesPage() {
  const { userId } = useAppSelector((state) => state.user);

  const [chats, setChats] = useState<ChatWithLatestMsg[]>([]);
  const [loading, setLoading] = useState(true);

  const { data, isLoading } = useChats({ userId: userId! });

  useEffect(() => {
    if (data && data.chats.length > 0) {
      const sortedChats = data.chats
        .map((chat) => {
          const latestMessage = chat.latestMessage;
          if (latestMessage && latestMessage.senderId === userId) {
            latestMessage.seenByUser = true;
          }
          return { ...chat, latestMessage };
        })
        .sort(
          (a, b) =>
            new Date(b.latestMessage?.timestamp).getTime() -
            new Date(a.latestMessage?.timestamp).getTime()
        );

      setChats(sortedChats);
      sortedChats.forEach((chat) => {
        socket.emit("joinChat", { chatId: chat.id });
      });
    }
    setLoading(false);
  }, [data, userId]);

  useEffect(() => {
    const handleNewMessage = (newMessage: any) => {
      setLoading(true);
      setChats((prevChats) => {
        const updatedChats = prevChats
          .map((chat) => {
            if (chat.id === newMessage.chatId) {
              const latestMessage = {
                ...newMessage,
                seenByUser: userId === newMessage.sender.id,
              };
              return { ...chat, latestMessage };
            }
            return chat;
          })
          .sort(
            (a, b) =>
              new Date(b.latestMessage?.timestamp).getTime() -
              new Date(a.latestMessage?.timestamp).getTime()
          );
        setLoading(false);
        return updatedChats;
      });
    };

    socket.on("message", handleNewMessage);

    return () => {
      socket.off("message", handleNewMessage);
    };
  }, [userId]);

  return (
    <section className={styles.root}>
      <article className={styles.wrapper}>
        <h1 className={mont.className}>Повідомлення</h1>
        <div className={styles.msg_block}>
          {isLoading || loading ? null : chats && chats.length > 0 ? (
            chats.map((chat) => {
              return (
                <MsgCard
                  key={chat.id}
                  chat={chat}
                  isAlert={!chat.latestMessage?.seenByUser}
                />
              );
            })
          ) : (
            <p className={styles.no_chats}>Схоже у вас ще нема чатів.</p>
          )}
        </div>
      </article>
    </section>
  );
}

export default withAuth(MessagesPage);
