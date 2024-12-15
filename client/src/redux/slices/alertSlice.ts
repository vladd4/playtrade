import { AdminProducts, Product } from "@/types/product.type";
import { User } from "@/types/user.type";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type AlertrSlice = {
  showChangeAlert: boolean;
  changeAlertType: "password" | "name";
  showCreateGameAlert: boolean;
  createGameAlertType: "create" | "edit";
  editGameAlertGameId: string | null;
  showEditGameTypesAlert: boolean;
  editGameTypesAlertType: "region" | "server" | "platform";
  showBanAlert: boolean;
  userToBanId: string | null;
  showEditUsersAdmin: boolean;
  editUsersAdminType: "user" | "product" | "manager";
  adminUserToEdit: User | null;
  adminAdvertToEdit: AdminProducts | null;
  showAdminUsersInfo: boolean;
  adminUsersInfoType: "selectUser" | "currentUser";
  adminUsersInfoUsers: User[] | null;
};

const initialState: AlertrSlice = {
  showChangeAlert: false,
  changeAlertType: "password",
  showCreateGameAlert: false,
  editGameTypesAlertType: "platform",
  showEditGameTypesAlert: false,
  showBanAlert: false,
  userToBanId: null,
  showEditUsersAdmin: false,
  editUsersAdminType: "user",
  adminUserToEdit: null,
  adminAdvertToEdit: null,
  createGameAlertType: "create",
  editGameAlertGameId: null,
  showAdminUsersInfo: false,
  adminUsersInfoType: "selectUser",
  adminUsersInfoUsers: null,
};

export const alertrSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    setShowChangeAlert: (state, action: PayloadAction<boolean>) => {
      state.showChangeAlert = action.payload;
    },
    setChangeAlertType: (state, action: PayloadAction<"password" | "name">) => {
      state.changeAlertType = action.payload;
    },
    setShowCreateGameAlert: (state, action: PayloadAction<boolean>) => {
      state.showCreateGameAlert = action.payload;
    },
    setShowEditGameTypesAlert: (state, action: PayloadAction<boolean>) => {
      state.showEditGameTypesAlert = action.payload;
    },
    setEditGameTypesAlertType: (
      state,
      action: PayloadAction<"region" | "server" | "platform">
    ) => {
      state.editGameTypesAlertType = action.payload;
    },
    setShowBanAlert: (state, action: PayloadAction<boolean>) => {
      state.showBanAlert = action.payload;
    },
    setUserToBanId: (state, action: PayloadAction<string | null>) => {
      state.userToBanId = action.payload;
    },
    setShowEditUsersAdmin: (state, action: PayloadAction<boolean>) => {
      state.showEditUsersAdmin = action.payload;
    },
    setEditUsersAdminType: (
      state,
      action: PayloadAction<"user" | "product" | "manager">
    ) => {
      state.editUsersAdminType = action.payload;
    },
    setAdminUserToEdit: (state, action: PayloadAction<User>) => {
      state.adminUserToEdit = action.payload;
    },
    setAdminAdvertToEdit: (state, action: PayloadAction<AdminProducts>) => {
      state.adminAdvertToEdit = action.payload;
    },
    setCreateGameAlertType: (
      state,
      action: PayloadAction<"create" | "edit">
    ) => {
      state.createGameAlertType = action.payload;
    },
    setEditGameId: (state, action: PayloadAction<string>) => {
      state.editGameAlertGameId = action.payload;
    },
    setShowAdminUsersInfo: (state, action: PayloadAction<boolean>) => {
      state.showAdminUsersInfo = action.payload;
    },
    setAdminUsersInfoType: (
      state,
      action: PayloadAction<"selectUser" | "currentUser">
    ) => {
      state.adminUsersInfoType = action.payload;
    },
    setAdminUsersInfoUsers: (state, action: PayloadAction<User[] | null>) => {
      state.adminUsersInfoUsers = action.payload;
    },
  },
});

export const {
  setShowChangeAlert,
  setChangeAlertType,
  setShowCreateGameAlert,
  setShowEditGameTypesAlert,
  setEditGameTypesAlertType,
  setShowBanAlert,
  setUserToBanId,
  setShowEditUsersAdmin,
  setEditUsersAdminType,
  setAdminUserToEdit,
  setAdminAdvertToEdit,
  setCreateGameAlertType,
  setEditGameId,
  setShowAdminUsersInfo,
  setAdminUsersInfoType,
  setAdminUsersInfoUsers,
} = alertrSlice.actions;
export default alertrSlice.reducer;
