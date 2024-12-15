import { configureStore } from "@reduxjs/toolkit";
import filterSlice from "./slices/filterSlice";
import tgSlice from "./slices/tgSlice";
import userSlice from "./slices/userSlice";
import imageViewerSlice from "./slices/imageViewerSlice";
import sellerSlice from "./slices/sellerSlice";
import alertSlice from "./slices/alertSlice";
import filteredGamesSlice from "./slices/filteredGames";
import chatHistory from "./slices/chatHistory";
import filteredProductsSlice from "./slices/filteredProducts";
import filteredAdminItemsSlice from "./slices/filteredAdminItems";

const store = configureStore({
  reducer: {
    filter: filterSlice,
    tg: tgSlice,
    user: userSlice,
    imageViewer: imageViewerSlice,
    seller: sellerSlice,
    alert: alertSlice,
    filteredGames: filteredGamesSlice,
    chatHistory: chatHistory,
    filteredProducts: filteredProductsSlice,
    filteredAdminItems: filteredAdminItemsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
