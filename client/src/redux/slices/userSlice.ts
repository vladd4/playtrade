import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { User } from '@/types/user.type';

import { UserRoles } from '@/utils/constants';

type UserSlice = {
  user: User | null;
  userRole: UserRoles | null;
  userId: string | null;
  adminId: string | null;
  adminOtpId: string | null;
};

const initialState: UserSlice = {
  user: null,
  userId: null,
  adminId: null,
  adminOtpId: null,
  userRole: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setUserRole: (state, action: PayloadAction<UserRoles>) => {
      state.userRole = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setAdminId: (state, action: PayloadAction<string>) => {
      state.adminId = action.payload;
    },
    setAdminOtpId: (state, action: PayloadAction<string>) => {
      state.adminOtpId = action.payload;
    },
  },
});

export const { setUser, setUserId, setAdminId, setAdminOtpId, setUserRole } =
  userSlice.actions;
export default userSlice.reducer;
