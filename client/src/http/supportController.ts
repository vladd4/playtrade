import { AllSupportChats, SupportChat } from '@/types/support.type';

import { privateAxios } from './axios';

export async function getSupportChatByChatId(
  chatId: string,
): Promise<SupportChat | null> {
  try {
    const { data } = await privateAxios.get<SupportChat>(`/support-chats/${chatId}`);
    return data;
  } catch (error: any) {
    console.log(`Error getting chat ${chatId}:`, error.response?.data || error.message);
    return null;
  }
}

export async function getAllSupportChats(page: number): Promise<AllSupportChats | null> {
  try {
    const { data } = await privateAxios.get<AllSupportChats>(
      `/support-chats?page=${page}&limit=10`,
    );
    return data;
  } catch (error: any) {
    console.log(`Error getting all admin chats:`, error.response?.data || error.message);
    return null;
  }
}
