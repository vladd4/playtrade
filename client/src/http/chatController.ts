import { AdminChat, AllAdminChats, Chat, ChatWithLatestMsg } from '@/types/chat.type';

import { privateAxios } from './axios';

interface CreateChatParams {
  ownerId: string;
  receiverId: string;
  productId: string;
}

export async function getChatsByUserId(
  userId: string,
): Promise<{ chats: ChatWithLatestMsg[] } | null> {
  try {
    const { data } = await privateAxios.get<{ chats: ChatWithLatestMsg[] }>(
      `/chats/${userId}`,
    );
    return data;
  } catch (error: any) {
    console.log(
      `Error getting chats for user ${userId}:`,
      error.response?.data || error.message,
    );
    return null;
  }
}

export async function createChat({
  ownerId,
  receiverId,
  productId,
}: CreateChatParams): Promise<Chat | null> {
  try {
    const newChat = {
      receiverId,
      ownerId,
      productId,
    };
    const { data } = await privateAxios.post<Chat>('/chats', newChat);
    return data;
  } catch (error: any) {
    console.log(`Error creating chat:`, error.response?.data || error.message);
    return null;
  }
}

export async function checkChatExistance(
  senderId: string,
  receiverId: string,
  productId: string,
) {
  try {
    const { data } = await privateAxios.get(
      `/chats/existing?ownerId=${senderId}&receiverId=${receiverId}&productId=${productId}`,
    );
    return data;
  } catch (error: any) {
    console.log(
      `Error checking chat existance for sender ${senderId}, receiver ${receiverId}, product ${productId}:`,
      error.response?.data || error.message,
    );
    return null;
  }
}

export async function markMessageAsRead({
  chatId,
  userId,
}: {
  chatId: string;
  userId: string;
}) {
  try {
    const { data } = await privateAxios.patch(
      `/messages/mark-as-read?chatId=${chatId}&userId=${userId}`,
    );
    return data;
  } catch (error: any) {
    console.log(
      `Error mark messages as read for user ${userId}, chat ${chatId}:`,
      error.response?.data || error.message,
    );
    return null;
  }
}

export async function uploadChatImage({ fileFormData }: { fileFormData: any }) {
  try {
    const { data } = await privateAxios.post(`/photo/upload-image`, fileFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error: any) {
    console.log(`Error uploading image:`, error.response?.data || error.message);
    return null;
  }
}

export async function deleteChatImage(imageName: string) {
  try {
    const { data } = await privateAxios.delete(`/photo/delete-image/${imageName}`);
    return data;
  } catch (error: any) {
    console.log(`Error deleting image:`, error.response?.data || error.message);
    return null;
  }
}

export async function getAllAdminChats(page: number): Promise<AllAdminChats | null> {
  try {
    const { data } = await privateAxios.get<AllAdminChats>(
      `/chats/all/admin?page=${page}&limit=10`,
    );
    return data;
  } catch (error: any) {
    console.log(`Error getting all admin chats:`, error.response?.data || error.message);
    return null;
  }
}

export async function changeChatFavoriteStatus({
  chatId,
  status,
}: {
  chatId: string;
  status: boolean;
}) {
  try {
    const { data } = await privateAxios.patch(`/chats/${chatId}/favorite`, {
      isFavorite: status,
    });
    return data;
  } catch (error: any) {
    console.log(
      `Error changing favorite status for chat ${chatId}:`,
      error.response?.data || error.message,
    );
    return null;
  }
}

export async function getChatByChatId(chatId: string): Promise<Chat | null> {
  try {
    const { data } = await privateAxios.get<Chat>(`/chats/one/${chatId}`);
    return data;
  } catch (error: any) {
    console.log(`Error getting chat ${chatId}:`, error.response?.data || error.message);
    return null;
  }
}

export async function searchChatByChatId(chatId: string): Promise<AdminChat | null> {
  try {
    const { data } = await privateAxios.get<AdminChat>(`/chats/search/${chatId}`);
    return data;
  } catch (error: any) {
    console.log(`Error getting chat ${chatId}:`, error.response?.data || error.message);
    return null;
  }
}

export async function createChatComment({
  chatId,
  authorId,
  comment,
}: {
  chatId: string;
  authorId: string;
  comment: string;
}): Promise<Chat | null> {
  try {
    const newComment = {
      author: authorId,
      comment,
    };
    const { data } = await privateAxios.post<Chat>(
      `/chats/${chatId}/comments`,
      newComment,
    );
    return data;
  } catch (error: any) {
    console.log(
      `Error creating comment for chat ${chatId}:`,
      error.response?.data || error.message,
    );
    return null;
  }
}
export async function uploadSupportChatImage(fileFormData: FormData) {
  try {
    const { data } = await privateAxios.post(
      `/support-chats/upload-image`,
      fileFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return data;
  } catch (error: any) {
    console.log(`Error uploading support image:`, error.response?.data || error.message);
    return null;
  }
}
