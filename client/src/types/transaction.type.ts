import { User } from "./user.type";

export type Transaction = {
  id: string;
  amount: number;
  createdAt: string;
  sender: User;
  receiver: User;
  status: string;
  productId: string;
  productName: string;
};

export type TransactionsWithPagination = {
  transactions: Transaction[];
  totalPages: number;
  currentPage: string;
  totalTransactions: number;
};
