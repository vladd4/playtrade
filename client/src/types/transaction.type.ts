import { User } from "./user.type";

export type Transaction = {
  id: string;
  amount: number;
  createdAt: string;
  sender: User;
  receiver: User;
  status: string;
};

export type TransactionsWithPagination = {
  transactions: Transaction[];
  totalPages: number;
  currentPage: string;
  totalTransactions: number;
};

export type CreateTransaction = {
  amount: number;
  senderId: string;
  receiverId: string;
  status: string;
};
