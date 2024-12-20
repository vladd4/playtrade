'use client';

import ImageViewer from '../ImageViewer/ImageViewer';
import ServiceButton from '../ServiceButtons/ServiceButton';
import { CircleX, Paperclip, SendHorizontal } from 'lucide-react';

import styles from './Chat.module.scss';

import type { FormattedMessages, HistoryMessage } from '@/types/message.type';

import React, { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useAppSelector } from '@/hooks/redux-hooks';

import { handleFileChange } from '@/utils/chatImage_helper';
import { formatImageFromServer } from '@/utils/formatImageName';
import { groupMessagesByDate } from '@/utils/groupMessagesByDate';
import { getFromSessionStorage } from '@/utils/sessionStorage_helper';

import { deleteChatImage, markMessageAsRead } from '@/http/chatController';

import ChatMsg from './ChatMsg';
import No_Avatar from '@/../public/no-avatar.jpg';
import { jost } from '@/font';
import { socket } from '@/websocket/socket';

interface ChatProps {
  chatId: string;
}

export default function Chat({ chatId }: ChatProps) {
  const [messages, setMessages] = useState<HistoryMessage[]>([]);
  const [formatedMessages, setFormatedMessages] = useState<FormattedMessages>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [currentImage, setCurrentImage] = useState('');
  const [isPayment, setIsPayment] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { userId } = useAppSelector((state) => state.user);

  const chatInfo = JSON.parse(getFromSessionStorage('chatInfo')!);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId || !chatInfo) return;
    let content = '';

    if (inputValue !== '') {
      content += inputValue;
    }
    if (uploadedImageUrl) {
      if (content) {
        content += `&&imageUrl=${uploadedImageUrl}`;
      } else {
        content = `&&imageUrl=${uploadedImageUrl}`;
      }
    }
    if (content) {
      const messageData = {
        content,
        timestamp: new Date().toISOString(),
        senderId: userId,
        receiverId: chatInfo.sellerId,
        productId: chatInfo.productId,
      };
      socket.emit('sendMessage', messageData);
      console.log('msg chat sent');

      setInputValue('');
      setUploadedImageUrl('');
    }
  };

  const handleLeaveChat = () => {
    if (chatId) {
      socket.emit('leaveChat', { chatId: chatId });
      console.log('Leaving chat:', chatId);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteImage = async () => {
    const uploadedImageName = uploadedImageUrl.split('/').pop();

    setUploadedImageUrl('');
    if (uploadedImageName) {
      await deleteChatImage(uploadedImageName);
    }
  };

  useEffect(() => {
    const markMessages = async () => {
      if (chatId && userId) {
        await markMessageAsRead({ chatId: chatId, userId });
      }
    };
    markMessages();
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [formatedMessages]);

  useEffect(() => {
    socket.emit('joinChat', { chatId });

    socket.on('chatHistory', (messages) => {
      console.log('chat history');
      setMessages(messages);
      setIsLoading(false);
    });

    socket.on('message', async (newMessage) => {
      console.log('new msg');
      setMessages((prev) => [...prev, newMessage]);
      if (chatId && userId) {
        await markMessageAsRead({ chatId: chatId, userId });
      }
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

  return (
    <>
      <article className={`${styles.root} ${jost.className}`}>
        <div className={styles.top_block}>
          <div className={styles.avatar}>
            <div>
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
                <span>
                  {chatInfo?.sellerName ? chatInfo?.sellerName[0]?.toUpperCase() : 'U'}
                </span>
              </div>
              <h3>{chatInfo?.sellerName}</h3>
            </div>
          </div>
        </div>
        {isLoading ? null : (
          <div
            className={styles.main_block}
            ref={chatRef}
            style={
              uploadedImageUrl ? { marginBottom: '125px' } : { marginBottom: '65px' }
            }
          >
            {formatedMessages && formatedMessages.length > 0 ? (
              formatedMessages.map((message) => {
                return (
                  <React.Fragment key={message.date}>
                    <p className={styles.message_date}>{message.date}</p>
                    {message.messages.map((msg) => {
                      return (
                        <ChatMsg
                          key={msg.id}
                          message={msg.content}
                          time={msg.timestamp}
                          position={msg.sender.id === userId ? 'me' : 'you'}
                          setCurrentImage={setCurrentImage}
                        />
                      );
                    })}
                  </React.Fragment>
                );
              })
            ) : (
              <p className={styles.no_msg}>Напишіть щоб розпочати чат</p>
            )}
          </div>
        )}
        <form className={styles.bottom_block} onSubmit={handleSendMessage}>
          {uploadedImageUrl && (
            <div
              className={styles.image_preview}
              style={{ backgroundImage: `url(${uploadedImageUrl})` }}
            >
              <CircleX
                onClick={handleDeleteImage}
                color="#fff"
                size={16}
                fill="red"
                className={styles.image_delete}
              />
            </div>
          )}
          <div className={styles.input_wrapper}>
            <div className={styles.input_block}>
              <Paperclip
                size={20}
                className={`${styles.pointer} ${styles.attach_file}`}
                onClick={handleImageClick}
              />
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange(e, setUploadedImageUrl)}
              />
              <input
                placeholder="Напишіть повідомлення..."
                value={inputValue}
                type="text"
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <button type="submit" className={styles.pointer}>
              <SendHorizontal
                size={20}
                type="submit"
                color="var(--font-color)"
                className={styles.pointer}
              />
            </button>
          </div>
        </form>
      </article>
      <ImageViewer imageSrc={currentImage} setCurrentImage={setCurrentImage} />
    </>
  );
}
