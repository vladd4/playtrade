import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type TgSice = {
  tg: WebApp | null;
  backButton: BackButton | null;
  tgUser: WebAppUser | null;
};

const initialState: TgSice = {
  tg: null,
  backButton: null,
  tgUser: null,
};

export const tgSlice = createSlice({
  name: "tg",
  initialState,
  reducers: {
    setTg: (state, action: PayloadAction<WebApp>) => {
      state.tg = action.payload;
    },
    setBackButton: (state, action: PayloadAction<BackButton>) => {
      state.backButton = action.payload;
    },
    setTgUser: (state, action: PayloadAction<WebAppUser>) => {
      state.tgUser = action.payload;
    },
  },
});

export const { setTg, setTgUser, setBackButton } = tgSlice.actions;
export default tgSlice.reducer;
