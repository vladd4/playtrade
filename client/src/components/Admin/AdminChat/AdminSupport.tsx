"use client";

import { jost } from "@/font";
import styles from "./AdminChat.module.scss";

import React, { useEffect, useRef, useState } from "react";

import No_Avatar from "@/../public/no-avatar.jpg";
import ChatMsg from "@/components/ChatComponent/ChatMsg";
import { CircleCheck, Paperclip, SendHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { socket } from "@/websocket/socket";
import { FormattedMessages, HistoryMessage } from "@/types/message.type";
import { groupMessagesByDate } from "@/utils/groupMessagesByDate";
import ImageViewer from "@/components/ImageViewer/ImageViewer";
import { Tooltip } from "react-tooltip";

import { useAppSelector } from "@/hooks/redux-hooks";

import MoreUsersAlert from "../MoreUsersAlert/MoreUsersAlert";
import { formatImageFromServer } from "@/utils/formatImageName";
import useSupportChat from "@/hooks/useSupportChat";
import { handleSupportFileChange } from "@/utils/chatImage_helper";
import { USER_PLACEHOLDER_ID } from "@/utils/constants";
import { randomUUID } from "crypto";

export default function AdminSupport() {
  const [currentImage, setCurrentImage] = useState("");
  const [isPending, setIsPending] = useState(true);
  const [messages, setMessages] = useState<HistoryMessage[]>([]);
  const [formatedMessages, setFormatedMessages] = useState<FormattedMessages>(
    []
  );
  const [inputValue, setInputValue] = useState("");
  const [isClosedChat, setIsClosedChat] = useState(false);
  const [disabledInput, setDisabledInput] = useState(false);

  const searchParams = useSearchParams();

  const chatId = searchParams.get("id");

  const { data, isLoading } = useSupportChat({ id: chatId! });

  const { adminId } = useAppSelector((state) => state.user);

  const chatRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLeaveChat = () => {
    if (chatId) {
      socket.emit("leaveSupportChat", { chatId });
    }
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!adminId || !data?.user.id || isClosedChat) return;

    let content = "";

    if (inputValue !== "") {
      content += inputValue;
    }

    if (content) {
      socket.emit("sendMessageToBot", {
        content: content,
        senderId: data?.user.id,
        chatId: chatId,
        adminId: adminId,
      });

      setInputValue("");
    }
  };

  const handleImageClick = () => {
    if (!isClosedChat && !disabledInput) {
      fileInputRef.current?.click();
    }
  };

  const handleDoneSupportChat = async () => {
    if (adminId && data?.user.id && !data.isClosed && !disabledInput) {
      socket.emit("closeSupportChat", { senderId: data?.user.id });
      setIsClosedChat(true);
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [formatedMessages]);

  useEffect(() => {
    socket.emit("joinSupportChat", { chatId });

    socket.on("supportChatHistory", (messages) => {
      setMessages(messages);
      setIsPending(false);
    });

    socket.on("supportMessage", async (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      console.log("support", newMessage);
    });

    socket.on("messageSent", async (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      console.log("message sent", newMessage);
    });

    socket.on("error", (error) => {
      console.error("Failed to send message:", error);
    });

    return () => {
      handleLeaveChat();
      socket.off("supportMessage");
      socket.off("messageSent");
      socket.off("supportChatHistory");
      socket.off("error");
    };
  }, [chatId]);

  useEffect(() => {
    setFormatedMessages(groupMessagesByDate(messages));
  }, [messages]);

  useEffect(() => {
    if (data) {
      setIsClosedChat(data.isClosed);
    }
  }, [data]);

  useEffect(() => {
    if (adminId && data && data.user) {
      if (adminId === data.user.id) {
        setDisabledInput(true);
      }
    }
  }, [adminId, data]);

  if (isLoading) return null;

  if (!data?.user)
    return (
      <p className={styles.no_data}>Щось пішло не так. Спробуйте пізніше!</p>
    );

  return (
    <>
      <article
        className={`${styles.root} ${jost.className} ${styles.support_root}`}
      >
        <div className={styles.top_block}>
          <div className={styles.avatar}>
            <div
              className={styles.support_avatar_div}
              style={{
                backgroundImage: `url(${
                  data.user.avatarPhoto === null
                    ? No_Avatar.src
                    : `${
                        process.env.NEXT_PUBLIC_BACKEND_API_URL
                      }${formatImageFromServer(data.user.avatarPhoto)}`
                })`,
              }}
            />
            <div className={styles.text_block}>
              <h3>Користувач: {data.user.name}</h3>
            </div>
          </div>
          <div className={styles.buttons}>
            <div
              data-tooltip-id="tooltip"
              data-tooltip-content={"Завершити чат"}
              onClick={handleDoneSupportChat}
            >
              <CircleCheck fill={isClosedChat ? "green" : "transparent"} />
            </div>
          </div>
        </div>
        {isPending ? null : (
          <div className={styles.main_block} ref={chatRef}>
            {formatedMessages && formatedMessages.length > 0 ? (
              formatedMessages.map((message, index) => {
                return (
                  <React.Fragment key={message.date + index}>
                    <p className={styles.message_date}>{message.date}</p>
                    {message.messages.map((msg) => {
                      return (
                        <ChatMsg
                          key={msg.id}
                          message={msg?.content}
                          time={msg?.timestamp}
                          setCurrentImage={setCurrentImage}
                          position={
                            msg.receiver.id === USER_PLACEHOLDER_ID
                              ? "you"
                              : "me"
                          }
                        />
                      );
                    })}
                  </React.Fragment>
                );
              })
            ) : (
              <p className={styles.no_msg}>Ще нема повідомлень</p>
            )}
            {isClosedChat && <p className={styles.no_msg}>Чат завершено</p>}
          </div>
        )}

        <form className={styles.bottom_block} onSubmit={handleSendMessage}>
          <div className={styles.input_wrapper}>
            <div className={styles.input_block}>
              <Paperclip
                size={22}
                className={`${styles.pointer} ${styles.attach_file}`}
                onClick={handleImageClick}
              />
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={(e) => {
                  handleSupportFileChange(e, data.user.id, adminId!);
                }}
              />
              <input
                placeholder="Напишіть повідомлення..."
                value={inputValue}
                type="text"
                disabled={isClosedChat || disabledInput}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <button type="submit" className={styles.pointer}>
              <SendHorizontal
                size={22}
                type="submit"
                color="#fff"
                className={styles.pointer}
              />
            </button>
          </div>
        </form>
      </article>
      <Tooltip id="tooltip" place="bottom" className={styles.tooltip} />
      <MoreUsersAlert />
      <ImageViewer imageSrc={currentImage} setCurrentImage={setCurrentImage} />
    </>
  );
}
