'use client';

import BanCountDown from '../BanCountDown/BanCountDown';
import Logo from '../Logo/Logo';
import ServiceButton from '../ServiceButtons/ServiceButton';
import { Eye, EyeOff } from 'lucide-react';

import styles from './Login.module.scss';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useAppSelector } from '@/hooks/redux-hooks';
import useLogin from '@/hooks/useLogin';

import withGuest from '@/utils/withGuest';

import { jost } from '@/font';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  const router = useRouter();

  const { isLoading, handleUserLogin, banTargetData } = useLogin({ password });

  const { tgUser } = useAppSelector((state) => state.tg);

  return (
    <section className={`${styles.root} ${jost.className}`}>
      <Logo className={styles.logo} fill="var(--button-active-color)" />
      {banTargetData ? (
        <BanCountDown targetDate={banTargetData} />
      ) : (
        <article className={styles.form_block}>
          <p>Авторизація</p>
          <p>Користувач {tgUser?.first_name}</p>
          <form onSubmit={handleUserLogin}>
            <div className={styles.input}>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                placeholder="Пароль"
                required
              />
              {showPassword ? (
                <Eye
                  className={styles.icon}
                  size={20}
                  onClick={() => setShowPassword(false)}
                  color="#000"
                />
              ) : (
                <EyeOff
                  size={20}
                  color="#000"
                  className={styles.icon}
                  onClick={() => setShowPassword(true)}
                />
              )}
              <p
                className={styles.reset_pass}
                onClick={() => router.push('/login/reset')}
              >
                Забули пароль?
              </p>
            </div>
            <ServiceButton type="submit" disabled={isLoading}>
              {isLoading ? 'Завантаження...' : 'Увійти'}
            </ServiceButton>
          </form>
        </article>
      )}
    </section>
  );
}

export default withGuest(Login);
