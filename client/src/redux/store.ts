import { configureStore } from '@reduxjs/toolkit';

import alertSlice from './slices/alertSlice';
import chatHistory from './slices/chatHistory';
import filterSlice from './slices/filterSlice';
import filteredAdminItemsSlice from './slices/filteredAdminItems';
import filteredGamesSlice from './slices/filteredGames';
import filteredProductsSlice from './slices/filteredProducts';
import imageViewerSlice from './slices/imageViewerSlice';
import sellerSlice from './slices/sellerSlice';
import tgSlice from './slices/tgSlice';
import userSlice from './slices/userSlice';

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
