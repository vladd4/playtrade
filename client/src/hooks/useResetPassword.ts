import toast from 'react-hot-toast';

import { FormEvent, useState } from 'react';

import { useRouter } from 'next/navigation';

import { setUserId } from '@/redux/slices/userSlice';

import { loginUser } from '@/http/authController';
import { resetUserPassword } from '@/http/userController';

import { useAuth } from '@/context/AuthContext';

import { useAppDispatch, useAppSelector } from './redux-hooks';
import useCheckUserBan from './useCheckUserBan';

interface ResetProps {
  inputValue: string;
  error: string | null;
  isEmail: boolean;
  link: string;
}

const useResetPassword = ({ inputValue, error, isEmail, link }: ResetProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const { setUserAccessToken } = useAuth();

  const router = useRouter();

  const { tgUser } = useAppSelector((state) => state.tg);

  const dispatch = useAppDispatch();

  const { isBanned } = useCheckUserBan();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (error || !inputValue) return;

    if (isBanned) {
      toast.error('Ваш обліковий запис заблоковано!');
      return;
    }

    const userId =
      tgUser?.id ?? (process.env.NODE_ENV === 'development' ? '490607899' : '');

    setIsLoading(true);

    try {
      if (isEmail) {
        const result = await resetUserPassword(userId.toString(), inputValue);
        if (result === 200) router.push(link);
      } else {
        const userData = await loginUser({
          telegramId: userId.toString(),
          password: inputValue,
        });

        if (userData.message === 'Login successful') {
          setUserAccessToken(userData.userId);
          dispatch(setUserId(userData.userId!));
        } else if (userData.message === 'Неправильні облікові дані. Помилка з паролем') {
          toast.error('Перевірте правильність пароля!');
        } else {
          throw new Error('Login failed');
        }
      }
    } catch (error) {
      toast.error(`Щось пішло не так! Спробуйте пізніше. ${userId}`);
    } finally {
      setIsLoading(false);
    }
  };
  return { isLoading, handleSubmit };
};

export default useResetPassword;
