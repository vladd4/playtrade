import { User } from "./user.type";

export type Purchase = {
  id: string;
  name: string;
  date: string;
  price: number;
  status: "success" | "rejected";
};

export type MyPurchase = {
  id: string;
  name: string;
  description: string;
  detailDescription: string;
  platform: string;
  server: string;
  date: string;
  price: number;
  inProcess: boolean;
  seller: User;
  imageUrls: string[];
};
