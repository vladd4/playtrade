export type Purchase = {
  id: string;
  name: string;
  date: string;
  price: number;
  status: "success" | "rejected";
};
