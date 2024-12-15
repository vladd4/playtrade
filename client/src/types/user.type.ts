import { UserRoles } from "@/utils/constants";
import { Transaction } from "./transaction.type";

export type User = {
  id: string;
  avatarPhoto: string;
  name: string;
  telegramId: string;
  phoneNumber: string;
  email: string;
  userNameInTelegram: string;
  isBanned: boolean;
  isVerified: boolean;
  isOnline: boolean;
  balance: number;
  rating: number;
  role: UserRoles;
  sessionId: string;
  banUntil: string;
};

export type UserWithPurchases = User & {
  transactions: Transaction[];
};

export type LoginBody = {
  telegramId: string;
  password: string;
};

export type AdminLoginBody = {
  email: string;
  password: string;
};

export type AdminVerifyBody = {
  otpId: string;
  code: string;
};

export type RefreshResponse = {
  accessToken: string;
};

export type Seller = {
  name: string;
  rating: number;
  imageUrl: string;
  id: string;
};

export type BlockTime = "24h" | "7d" | "forever";

export type AdminUsersWithPagination = {
  users: UserWithPurchases[];
  totalPages: number;
  currentPage: string;
  totalUsers: number;
};
