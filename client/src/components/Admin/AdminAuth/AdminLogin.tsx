'use client';

import { Eye, EyeOff } from 'lucide-react';

import styles from './Admin.module.scss';

import { useState } from 'react';

import Logo from '@/components/Logo/Logo';
import ServiceButton from '@/components/ServiceButtons/ServiceButton';

import useAdminLogin from '@/hooks/useAdminLogin';

import withAdminGuest from '@/utils/withAdminGuest';

import { jost } from '@/font';

function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const { isLoading, handleAdminLogin } = useAdminLogin({
    email: login,
    password,
  });

  return (
    <section className={`${styles.root} ${jost.className}`}>
      <Logo className={styles.logo} fill="#5ec2c3" />
      <article className={styles.form_block}>
        <p>Авторизація в адмін панель</p>
        <form onSubmit={handleAdminLogin}>
          <div className={styles.input}>
            <input
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              type="text"
              placeholder="Електронна пошта"
            />
          </div>
          <div className={styles.input}>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              placeholder="Пароль"
            />
            {showPassword ? (
              <Eye
                className={styles.icon}
                size={20}
                onClick={() => setShowPassword(false)}
                color="#1f211f99"
              />
            ) : (
              <EyeOff
                size={20}
                color="#1f211f99"
                className={styles.icon}
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
          <ServiceButton disabled={isLoading} type="submit">
            {isLoading ? 'Завантаження...' : 'Увійти'}
          </ServiceButton>
        </form>
      </article>
    </section>
  );
}

export default withAdminGuest(AdminLogin);
