import { User } from './user.type';

export type Message = {
  id: string;
  content: string;
  timestamp: string;
  isDealCompleted: boolean;
  seenByUser: boolean;
};

export type HistoryMessage = {
  id: string;
  content: string;
  timestamp: string;
  isDealCompleted: boolean;
  receiver: User;
  sender: User;
};

export type LatestMessage = {
  id: string;
  content: string;
  timestamp: string;
  isDealCompleted: boolean;
  senderId: string;
  sender: User;
  seenByUser: boolean;
};

export type SendMessageBody = {
  receiverId: string;
  senderId: string;
  productId: string;
  content: string;
  timestamp: string;
};

export type FormattedMessages = {
  date: string;
  messages: HistoryMessage[];
}[];
