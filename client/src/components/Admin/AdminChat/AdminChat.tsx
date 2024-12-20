'use client';

import MoreUsersAlert from '../MoreUsersAlert/MoreUsersAlert';
import { useQueryClient } from '@tanstack/react-query';
import { Check, CircleEllipsis, Pencil, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

import styles from './AdminChat.module.scss';

import { FormattedMessages, HistoryMessage } from '@/types/message.type';

import React, { useEffect, useRef, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import ChatMsg from '@/components/ChatComponent/ChatMsg';
import ImageViewer from '@/components/ImageViewer/ImageViewer';

import {
  setAdminUsersInfoType,
  setAdminUsersInfoUsers,
  setShowAdminUsersInfo,
} from '@/redux/slices/alertSlice';

import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import useAdminChat from '@/hooks/useAdminChat';

import { formatImageFromServer } from '@/utils/formatImageName';
import { groupMessagesByDate } from '@/utils/groupMessagesByDate';

import { changeChatFavoriteStatus, createChatComment } from '@/http/chatController';

import AdminMessageItem from './AdminMessageItem';
import No_Avatar from '@/../public/no-avatar.jpg';
import { jost } from '@/font';
import { socket } from '@/websocket/socket';

export default function AdminChat() {
  const [showAdminMessages, setShowAdminMessages] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [isPending, setIsPending] = useState(true);
  const [messages, setMessages] = useState<HistoryMessage[]>([]);
  const [formatedMessages, setFormatedMessages] = useState<FormattedMessages>([]);
  const [commentValue, setCommentValue] = useState('');

  const queryClient = useQueryClient();

  const searchParams = useSearchParams();

  const chatId = searchParams.get('id');

  const { data, isLoading } = useAdminChat({ id: chatId! });

  const { adminId } = useAppSelector((state) => state.user);
  const { showAdminUsersInfo } = useAppSelector((state) => state.alert);

  const dispatch = useAppDispatch();

  const chatRef = useRef<HTMLDivElement>(null);

  const handleChatFavoriteStatus = async () => {
    if (chatId && data) {
      await changeChatFavoriteStatus({ chatId, status: !data.isFavorite });
      toast.success(
        `Чат ${data.isFavorite ? 'видалено з обраного' : 'додано до обраного!'}`,
      );
      queryClient.invalidateQueries({ queryKey: [`chat-${chatId}`] });
    }
  };

  const handleLeaveChat = () => {
    if (chatId) {
      socket.emit('leaveChat', { chatId });
    }
  };

  const handleAddChatComment = async () => {
    if (adminId && commentValue !== '' && chatId) {
      const result = await createChatComment({
        chatId,
        comment: commentValue,
        authorId: adminId,
      });
      if (result) {
        queryClient.invalidateQueries({ queryKey: [`chat-${chatId}`] });
        setCommentValue('');
      }
    }
  };

  const handleOpenUsersInfo = () => {
    if (data && data.participants) {
      const users = [data.participants[1], data.participants[0]];

      dispatch(setAdminUsersInfoUsers(users));
      dispatch(setAdminUsersInfoType('selectUser'));
      dispatch(setShowAdminUsersInfo(!showAdminUsersInfo));
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [formatedMessages]);

  useEffect(() => {
    socket.emit('joinChat', { chatId });

    socket.on('chatHistory', (messages) => {
      setMessages(messages);
      setIsPending(false);
    });

    socket.on('message', async (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    socket.on('error', (error) => {
      console.error('Failed to send message:', error);
    });

    return () => {
      handleLeaveChat();
      socket.off('message');
      socket.off('chatHistory');
      socket.off('error');
    };
  }, [chatId]);

  useEffect(() => {
    setFormatedMessages(groupMessagesByDate(messages));
  }, [messages]);

  if (isLoading) return null;

  if (!data?.participants || !data?.participants[0])
    return <p className={styles.no_data}>Щось пішло не так. Спробуйте пізніше!</p>;

  return (
    <>
      <article className={`${styles.root} ${jost.className} `}>
        <div className={styles.top_block}>
          <div className={styles.avatar}>
            <div className={styles.avatars_block}>
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
                className={styles.avatar_div}
              >
                <span>
                  {data.participants[0]?.name
                    ? data.participants[0]?.name[0]?.toUpperCase()
                    : 'S'}
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
                className={styles.avatar_div}
              >
                <span>
                  {data.participants[1]?.name
                    ? data.participants[1]?.name[0]?.toUpperCase()
                    : 'U'}
                </span>
              </div>
            </div>
            <div className={styles.text_block}>
              <h3>
                Користувачі:{' '}
                {`${data.participants[0].name}, ${data.participants[1].name}`}
              </h3>
              <h4>Товар: {data.product.name}</h4>
            </div>
          </div>
          <div className={styles.buttons}>
            <div
              data-tooltip-id="tooltip"
              data-tooltip-content={
                data?.isFavorite ? 'Видалити з обраного' : 'Додати в обране'
              }
              onClick={handleChatFavoriteStatus}
            >
              <Star
                fill={data?.isFavorite ? '#E8D635' : 'transparent'}
                color={data?.isFavorite ? '#E8D635' : '#fff'}
              />
            </div>

            <>
              <div
                data-tooltip-id="tooltip"
                data-tooltip-content="Додати примітку"
                className={`${showAdminMessages ? styles.pencil_div : ''}`}
                onClick={() => setShowAdminMessages(!showAdminMessages)}
              >
                <Pencil />
              </div>
              <div
                data-tooltip-id="tooltip"
                data-tooltip-content="Переглянути дані"
                className={`${showAdminUsersInfo ? styles.pencil_div : ''}`}
                onClick={handleOpenUsersInfo}
              >
                <CircleEllipsis />
              </div>
              <div
                className={`${styles.admin_messages_block} ${
                  showAdminMessages ? styles.show_msg : ''
                }`}
              >
                {data && data.adminComments && data.adminComments.length > 0 ? (
                  data.adminComments.map((msg) => {
                    return <AdminMessageItem key={msg.id} comment={msg} />;
                  })
                ) : (
                  <p className={styles.no_comments}>Коментарів немає</p>
                )}

                <div className={`${styles.input_msg} `}>
                  <input
                    placeholder="Напишіть повідомлення..."
                    value={commentValue}
                    onChange={(e) => setCommentValue(e.target.value)}
                  />
                  <div onClick={handleAddChatComment}>
                    <Check color="#5ec2c3" />
                  </div>
                </div>
              </div>
            </>
          </div>
        </div>
        {isPending ? null : (
          <div className={styles.main_block} ref={chatRef}>
            {formatedMessages && formatedMessages.length > 0 ? (
              formatedMessages.map((message) => {
                return (
                  <>
                    <p className={styles.message_date}>{message.date}</p>
                    {message.messages.map((msg) => {
                      return (
                        <ChatMsg
                          key={msg.id}
                          message={msg.content}
                          time={msg.timestamp}
                          setCurrentImage={setCurrentImage}
                          senderName={data.participants[0].name}
                          receiverName={data.participants[1].name}
                          position={
                            msg.sender.id === data.participants[0].id ? 'me' : 'you'
                          }
                        />
                      );
                    })}
                  </>
                );
              })
            ) : (
              <p className={styles.no_msg}>Ще нема повідомлень</p>
            )}
          </div>
        )}
      </article>
      {!showAdminMessages && (
        <Tooltip id="tooltip" place="bottom" className={styles.tooltip} />
      )}
      <MoreUsersAlert />
      <ImageViewer imageSrc={currentImage} setCurrentImage={setCurrentImage} />
    </>
  );
}
