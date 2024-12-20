'use client';

import { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react';

import { usePathname } from 'next/navigation';

import LoaderComponent from '@/components/LoaderComponent/LoaderComponent';

import { setAdminId, setUser, setUserId, setUserRole } from '@/redux/slices/userSlice';

import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import useTelegramWebApp from '@/hooks/useTelegramWebApp';

import { UserRoles } from '@/utils/constants';
import {
  getFromSessionStorage,
  setToSessionStorage,
} from '@/utils/sessionStorage_helper';

import { refreshAdmin, refreshUser } from '@/http/authController';
import { loginClient } from '@/http/sessioController';

interface AuthContextType {
  isAuthenticated: boolean;
  isUserAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  accessToken: string | null;
  accessUserToken: string | null;
  adminToken: string | null;
  setClientAccessToken: (accessToken: string) => void;
  setUserAccessToken: (accessToken: string | null) => void;
  setAdminAccessToken: (adminToken: string | null) => void;
  setIsUserBanned: (isBanned: boolean) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    getFromSessionStorage('accessToken'),
  );
  const [accessUserToken, setAccessUserToken] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isUserBanned, setIsUserBanned] = useState<boolean>(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const dispatch = useAppDispatch();

  const { tg } = useAppSelector((state) => state.tg);

  const pathName = usePathname();

  const initialized = useRef(false);

  const { isLoading } = useTelegramWebApp();

  useEffect(() => {
    const loginFront = async () => {
      const clientBody = {
        username: process.env.NEXT_PUBLIC_CLIENT_USERNAME!,
        password: process.env.NEXT_PUBLIC_CLIENT_PASSWORD!,
        secret: process.env.NEXT_PUBLIC_AUTH_SECRET!,
      };

      const data = await loginClient(clientBody);

      if (data) {
        setClientAccessToken(data.access_token);
      }
    };

    loginFront();
  }, []);

  useEffect(() => {
    const isAdminPath = pathName.includes('admin');

    const initAdminAuth = async () => {
      try {
        const data = await refreshAdmin();
        if (data && data.message === 'Сесія продовжена' && data.role !== UserRoles.USER) {
          setIsAdminAuthenticated(true);
          dispatch(setAdminId(data.userId));
          dispatch(setUserRole(data.role));
          setAdminAccessToken(data.userId);

          console.log('Admin authenticated successfully');
        }
      } catch (error) {
        console.log('Failed to refresh admin token:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAdminPath) {
      initAdminAuth();
    }
  }, []);

  useEffect(() => {
    const isAdminPath = pathName.includes('admin');

    if (!initialized.current && tg) {
      initialized.current = true;

      const initAuth = async () => {
        try {
          if (!isUserBanned) {
            const data = await refreshUser();
            if (data && data.message === 'Сесія подовжена') {
              dispatch(setUserId(data.userId));
              setAccessUserToken(data.userId);
              setIsUserAuthenticated(true);
              console.log('User authenticated successfully');
            }
          }
        } catch (error) {
          console.log('Failed to refresh user token:', error);
        } finally {
          setLoading(false);
        }
      };

      if (tg && !isAdminPath) {
        initAuth();
      }
    }

    return () => {
      initialized.current = false;
    };
  }, [tg, dispatch]);

  useEffect(() => {
    setIsAuthenticated(!!accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!loading) {
      setIsUserAuthenticated(!!accessUserToken);
    }
  }, [loading, accessUserToken]);

  useEffect(() => {
    if (!loading) {
      setIsAdminAuthenticated(!!adminToken);
    }
  }, [loading, adminToken]);

  const setClientAccessToken = (token: string) => {
    setToSessionStorage('accessToken', token);
    setAccessToken(token);
    setIsAuthenticated(!!token);
  };

  const setUserAccessToken = (token: string | null) => {
    setAccessUserToken(token);
  };

  const setAdminAccessToken = (token: string | null) => {
    setAdminToken(token);
  };

  if (isLoading) return <LoaderComponent />;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isUserAuthenticated,
        isAdminAuthenticated,
        accessToken,
        accessUserToken,
        setClientAccessToken,
        setUserAccessToken,
        setAdminAccessToken,
        setIsUserBanned,
        loading,
        adminToken,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
