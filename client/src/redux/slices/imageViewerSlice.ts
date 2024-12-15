import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ImageViewerSlice = {
  showImageViewer: boolean;
};

const initialState: ImageViewerSlice = {
  showImageViewer: false,
};

export const imageViewerSlice = createSlice({
  name: "imageViewer",
  initialState,
  reducers: {
    setShowImageViewer: (state, action: PayloadAction<boolean>) => {
      state.showImageViewer = action.payload;
    },
  },
});

export const { setShowImageViewer } = imageViewerSlice.actions;
export default imageViewerSlice.reducer;
