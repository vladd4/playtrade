import { LatestMessage, Message } from './message.type';
import { ChatProduct } from './product.type';
import { User } from './user.type';

export type Chat = {
  id: string;
  messages: Message[];
  participants: User[];
  product: ChatProduct;
  isFavorite: boolean;
  adminComments: {
    id: string;
    author: User;
    comment: string;
    createdAt: string;
  }[];
};

export type AdminChat = {
  chatId: string;
  productName: string;
  productId: string;
  lastMessageDate: string;
  lastMessageContent: string;
  isFavorite: boolean;
  participants: {
    id: string;
    name: string;
    avatar: string;
  }[];
};

export type ChatWithLatestMsg = {
  id: string;
  latestMessage: LatestMessage;
  participants: User[];
  product: ChatProduct;
};

export type AllUserChats = {
  chats: ChatWithLatestMsg[];
  currentPage: number;
  totalPages: number;
};

export type AllAdminChats = {
  chats: AdminChat[];
  currentPage: number;
  totalPages: number;
  totalChats: number;
};
