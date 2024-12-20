import { AxiosResponse } from 'axios';

import { LoginSessionBody, LoginSessionResponse } from '@/types/session.type';

import { publicAxios } from './axios';

export async function loginClient(
  loginBody: LoginSessionBody,
): Promise<LoginSessionResponse | null> {
  try {
    const response: AxiosResponse<LoginSessionResponse> =
      await publicAxios.post<LoginSessionResponse>('/auth/login', loginBody);

    return response.data;
  } catch (error: any) {
    console.log(
      `Error logging client ${loginBody.username}:`,
      error.response?.data || error.message,
    );
    return null;
  }
}

export async function refreshClient(): Promise<LoginSessionResponse | null> {
  try {
    const { data } = await publicAxios.post<LoginSessionResponse>(
      '/auth/refresh-token',
      null,
    );
    return data;
  } catch (error: any) {
    console.log(`Error refreshing client:`, error.response?.data || error.message);
    return null;
  }
}
