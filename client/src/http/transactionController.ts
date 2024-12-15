import {
  Transaction,
  TransactionsWithPagination,
} from "@/types/transaction.type";
import { privateAxios } from "./axios";

export async function getTransactions(
  page: number
): Promise<TransactionsWithPagination | null> {
  try {
    const { data } = await privateAxios.get<TransactionsWithPagination>(
      `/transactions?page=${page}`
    );
    return data;
  } catch (error: any) {
    console.log(
      "Error getting transactions:",
      error.response?.data || error.message
    );
    return null;
  }
}

export async function getTransactionById(
  id: string
): Promise<Transaction | null> {
  try {
    const { data } = await privateAxios.get<Transaction>(`/transactions/${id}`);
    return data;
  } catch (error: any) {
    console.log(
      `Error getting transaction by id ${id}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

export async function createTransaction(
  newTransaction: Transaction
): Promise<Transaction | null> {
  try {
    const { data } = await privateAxios.post<Transaction>(
      "/transactions",
      newTransaction
    );
    return data;
  } catch (error: any) {
    console.log(
      `Error creating transaction ${JSON.stringify(newTransaction)}:`,
      error.response?.data || error.message
    );
    return null;
  }
}
