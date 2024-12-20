import { LatestMessage } from './message.type';
import { User } from './user.type';

export type SupportChat = {
  id: string;
  isClosed: boolean;
  user: User;
  lastMessage: LatestMessage;
  createdAt: string;
};

export type AllSupportChats = {
  chats: SupportChat[];
  currentPage: number;
  totalPages: number;
  totalChats: number;
};
