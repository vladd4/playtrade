import { HistoryMessage } from "@/types/message.type";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ChatHistory = {
  chatHistory: HistoryMessage[] | null;
};

const initialState: ChatHistory = {
  chatHistory: null,
};

export const chatHistorySlice = createSlice({
  name: "chatHistory",
  initialState,
  reducers: {
    setChatHistory: (state, action: PayloadAction<HistoryMessage[]>) => {
      state.chatHistory = action.payload;
    },
  },
});

export const { setChatHistory } = chatHistorySlice.actions;
export default chatHistorySlice.reducer;
