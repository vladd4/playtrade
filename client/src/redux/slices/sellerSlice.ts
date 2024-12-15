import { Seller } from "@/types/user.type";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ShortSellerType = Omit<Seller, "id">;

type SellerSlice = {
  seller: ShortSellerType | null;
};

const initialState: SellerSlice = {
  seller: null,
};

export const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    setSeller: (state, action: PayloadAction<ShortSellerType>) => {
      state.seller = action.payload;
    },
  },
});

export const { setSeller } = sellerSlice.actions;
export default sellerSlice.reducer;
