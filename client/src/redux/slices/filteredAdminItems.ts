import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { AdminChat } from '@/types/chat.type';
import { Game } from '@/types/game.type';
import { AdminProducts } from '@/types/product.type';
import { SupportChat } from '@/types/support.type';
import { UserWithPurchases } from '@/types/user.type';

type FilteredAdminItems = {
  filteredProducts: AdminProducts[] | null;
  filteredUsers: UserWithPurchases[] | null;
  filteredChat: AdminChat | null | undefined;
  filteredSupportChat: SupportChat | null | undefined;
  filteredGames: Game[] | null;
  sortedGames: Game[] | null;
};
const initialState: FilteredAdminItems = {
  filteredProducts: null,
  filteredUsers: null,
  filteredChat: null,
  filteredGames: null,
  sortedGames: null,
  filteredSupportChat: null,
};

export const filteredAdminItemsSlice = createSlice({
  name: 'filteredAdminItems',
  initialState,
  reducers: {
    setFilteredProducts: (state, action: PayloadAction<AdminProducts[] | null>) => {
      state.filteredProducts = action.payload;
    },
    setFilteredUsers: (state, action: PayloadAction<UserWithPurchases[] | null>) => {
      state.filteredUsers = action.payload;
    },
    setFilteredChat: (state, action: PayloadAction<AdminChat | null | undefined>) => {
      state.filteredChat = action.payload;
    },
    setFilteredSupportChat: (
      state,
      action: PayloadAction<SupportChat | null | undefined>,
    ) => {
      state.filteredSupportChat = action.payload;
    },
    setFilteredGames: (state, action: PayloadAction<Game[] | null>) => {
      state.filteredGames = action.payload;
    },
    setSortedGames: (state, action: PayloadAction<Game[] | null>) => {
      state.sortedGames = action.payload;
    },
  },
});

export const {
  setFilteredProducts,
  setFilteredUsers,
  setFilteredChat,
  setFilteredGames,
  setSortedGames,
  setFilteredSupportChat,
} = filteredAdminItemsSlice.actions;
export default filteredAdminItemsSlice.reducer;
