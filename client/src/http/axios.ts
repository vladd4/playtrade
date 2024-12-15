import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { refreshClient } from "./sessioController";
import {
  getFromSessionStorage,
  removeFromSessionStorage,
  setToSessionStorage,
} from "@/utils/sessionStorage_helper";

const publicAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL!,
  withCredentials: true,
});

const privateAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL!,
  withCredentials: true,
});

const handleRefreshError = () => {
  removeFromSessionStorage("accessToken");
};

const authInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token = getFromSessionStorage("accessToken");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

privateAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const isLoginRequest =
      originalRequest.url?.includes("/auth-admin") ||
      originalRequest.url?.includes("/auth-user");

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isLoginRequest
    ) {
      originalRequest._retry = true;

      try {
        const data = await refreshClient();

        if (data !== null) {
          const newAccessToken = data.access_token;

          setToSessionStorage("accessToken", newAccessToken);
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return privateAxios(originalRequest);
        } else {
          handleRefreshError();
        }
      } catch (refreshError) {
        handleRefreshError();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

privateAxios.interceptors.request.use(authInterceptor);

export { publicAxios, privateAxios };
