import {
  AdminUsersWithPagination,
  BlockTime,
  User,
  UserWithPurchases,
} from "@/types/user.type";
import { privateAxios } from "./axios";
import { MiniProduct } from "@/types/product.type";
import { UserRoles } from "@/utils/constants";

export async function getUsers(
  page: number
): Promise<AdminUsersWithPagination | null> {
  try {
    const { data } = await privateAxios.get<AdminUsersWithPagination>(
      `/users?page=${page}`
    );
    return data;
  } catch (error: any) {
    console.log("Error getting users:", error.response?.data || error.message);
    return null;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const { data } = await privateAxios.get<User>(`/users/${id}`);
    return data;
  } catch (error: any) {
    console.log(
      `Error getting user by id ${id}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

export async function checkIsUserBanned(telegramId: string) {
  try {
    const { data } = await privateAxios.get(
      `/users/check-ban/admin?telegramId=${telegramId}`
    );
    return data;
  } catch (error: any) {
    console.log(
      `Error check ban for user by tg id ${telegramId}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

export async function getUserPurchases(
  userId: string
): Promise<MiniProduct[] | null> {
  try {
    const { data } = await privateAxios.get<MiniProduct[]>(
      `/users/${userId}/purchases`
    );
    return data;
  } catch (error: any) {
    console.log(
      `Error getting purchases for user with id ${userId}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

export async function changeUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  try {
    const data = await privateAxios.put(`/password/${userId}`, {
      currentPassword,
      newPassword,
    });
    return data.status;
  } catch (error: any) {
    console.log(
      `Error changing password for user with id ${userId}:`,
      error.response?.data || error.message
    );
    return error.response?.status || 500;
  }
}

export async function resetUserPassword(userId: string, userEmail: string) {
  try {
    const data = await privateAxios.post(`/password/${userId}/reset`, {
      userEmail,
    });
    return data.status;
  } catch (error: any) {
    console.error(
      `Error reseting password for user with id ${userId}:`,
      error.response?.data || error.message
    );
    return error.response?.status || 500;
  }
}

export async function changeUserName(userId: string, newName: string) {
  try {
    const data = await privateAxios.put(`/users/${userId}/name`, {
      newName,
    });
    return data;
  } catch (error: any) {
    console.error(
      `Error changing name for user with id ${userId}:`,
      error.response?.data || error.message
    );
    return error.response?.status || 500;
  }
}

export async function banUser(userId: string, banPeriod: BlockTime) {
  try {
    const data = await privateAxios.put(`/users/${userId}/ban`, {
      period: banPeriod,
    });
    return data;
  } catch (error: any) {
    console.error(
      `Error banning user with id ${userId}:`,
      error.response?.data || error.message
    );
    return error.response?.status || 500;
  }
}

export async function unbanUser(userId: string) {
  try {
    const data = await privateAxios.put(`/users/${userId}/unban`);
    return data;
  } catch (error: any) {
    console.error(
      `Error unbanning user with id ${userId}:`,
      error.response?.data || error.message
    );
    return error.response?.status || 500;
  }
}

export async function updateBalance(userId: string, amount: number) {
  try {
    const data = await privateAxios.put(`/users/${userId}/balance`, {
      balance: amount,
    });
    return data;
  } catch (error: any) {
    console.error(
      `Error updating user balance with id ${userId}:`,
      error.response?.data || error.message
    );
    return error.response?.status || 500;
  }
}

export async function updateStatus(userId: string, status: boolean) {
  try {
    const data = await privateAxios.put(`/users/${userId}/verification`, {
      isVerified: status,
    });
    return data;
  } catch (error: any) {
    console.error(
      `Error updating user status with id ${userId}:`,
      error.response?.data || error.message
    );
    return error.response?.status || 500;
  }
}

export async function searchUsersByName(
  name: string
): Promise<UserWithPurchases[] | null> {
  try {
    const { data } = await privateAxios.get<UserWithPurchases[]>(
      `/users/admin/search?name=${name}`
    );
    return data;
  } catch (error: any) {
    console.log(
      `Error getting users with name ${name}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

export async function updateUserRole(userId: string, role: UserRoles) {
  try {
    const data = await privateAxios.put(`/users/admin/${userId}/role`, {
      role,
    });
    return data;
  } catch (error: any) {
    console.error(
      `Error updating user role with id ${userId}:`,
      error.response?.data || error.message
    );
    return error.response?.status || 500;
  }
}

export async function getAllManagers(
  page: number
): Promise<AdminUsersWithPagination | null> {
  try {
    const { data } = await privateAxios.get<AdminUsersWithPagination>(
      `/users/admin/roles/admins-managers?page=${page}`
    );
    return data;
  } catch (error: any) {
    console.log(
      "Error getting managers:",
      error.response?.data || error.message
    );
    return null;
  }
}
