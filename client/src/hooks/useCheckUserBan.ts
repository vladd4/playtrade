import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { checkIsUserBanned } from '@/http/userController';

import { useAuth } from '@/context/AuthContext';

import { useAppSelector } from './redux-hooks';

const useCheckUserBan = () => {
  const { setUserAccessToken, setIsUserBanned } = useAuth();

  const { tgUser } = useAppSelector((state) => state.tg);

  const pathName = usePathname();

  const [isBanned, setIsBanned] = useState(false);

  useEffect(() => {
    const checkIsBanned = async () => {
      const id =
        tgUser?.id ?? (process.env.NODE_ENV === 'development' ? '6215892022' : '');

      if (id) {
        const userData = await checkIsUserBanned(id.toString());

        if (userData && userData.isBanned) {
          setIsUserBanned(true);
          setUserAccessToken(null);
          setIsBanned(true);
        }
      }
    };

    checkIsBanned();
  }, [pathName]);

  return { isBanned };
};

export default useCheckUserBan;
