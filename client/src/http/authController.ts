import { AdminLoginBody, AdminVerifyBody, LoginBody } from "@/types/user.type";
import { privateAxios } from "./axios";
import { AxiosResponse } from "axios";
import { RefreshUserResponse } from "@/types/session.type";
import { UserRoles } from "@/utils/constants";

export async function loginUser(
  loginBody: LoginBody
): Promise<
  { message: string; userId: string } | { message: string; userId: null }
> {
  try {
    const response: AxiosResponse<{ message: string; userId: string }> =
      await privateAxios.post("/auth-user/login", loginBody);

    return {
      message: response.data.message,
      userId: response.data.userId,
    };
  } catch (error: any) {
    console.log(
      `Error logging user with user id ${loginBody.telegramId}:`,
      error.response?.data || error.message
    );
    return {
      message: error.response.data.message,
      userId: null,
    };
  }
}

export async function refreshUser(): Promise<RefreshUserResponse | null> {
  try {
    const { data } = await privateAxios.post<RefreshUserResponse>(
      "/auth-user/refresh-session",
      null
    );
    return data;
  } catch (error: any) {
    console.log(
      `Error refreshing user:`,
      error.response?.data || error.message
    );
    return null;
  }
}

export async function loginAdmin(
  loginBody: AdminLoginBody
): Promise<
  { message: string; otpId: string } | { message: string; otpId: null }
> {
  try {
    const response: AxiosResponse<{ message: string; otpId: string }> =
      await privateAxios.post("/auth-admin/login", loginBody);

    return {
      message: response.data.message,
      otpId: response.data.otpId,
    };
  } catch (error: any) {
    console.log(
      `Error logging admin ${loginBody.email}:`,
      error.response?.data || error.message
    );
    return {
      message: error.response.data.message,
      otpId: null,
    };
  }
}

export async function verifyAdmin(
  loginBody: AdminVerifyBody
): Promise<
  | { message: string; userId: string; role: UserRoles }
  | { message: string; userId: null }
> {
  try {
    const response: AxiosResponse<{
      message: string;
      userId: string;
      role: UserRoles;
    }> = await privateAxios.post("/auth-admin/verify-otp", loginBody);

    return {
      message: response.data.message,
      userId: response.data.userId,
      role: response.data.role,
    };
  } catch (error: any) {
    console.log(
      `Error verifying admin ${loginBody.otpId}:`,
      error.response?.data || error.message
    );
    return {
      message: error.response.data.message,
      userId: null,
    };
  }
}

export async function refreshAdmin(): Promise<RefreshUserResponse | null> {
  try {
    const { data } = await privateAxios.post<RefreshUserResponse>(
      "/auth-admin/refresh-session",
      null
    );
    return data;
  } catch (error: any) {
    console.log(
      `Error refreshing admin:`,
      error.response?.data || error.message
    );
    return null;
  }
}

export async function adminLogout() {
  try {
    const { data } = await privateAxios.post("/auth-admin/logout", null);
    return data;
  } catch (error: any) {
    console.log(`Error logout admin:`, error.response?.data || error.message);
    return null;
  }
}
