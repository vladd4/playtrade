"use client";

import withGuest from "@/utils/withGuest";
import ServiceButton from "../ServiceButtons/ServiceButton";
import styles from "./ResetPassword.module.scss";
import { ChangeEvent, useState } from "react";
import Logo from "../Logo/Logo";
import { jost } from "@/font";

import useResetPassword from "@/hooks/useResetPassword";
import { EMAIL_REGEX } from "@/utils/constants";

interface ResetPassProps {
  isEmail: boolean;
  link: string;
}

function ResetPassword({ isEmail, link }: ResetPassProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { isLoading, handleSubmit } = useResetPassword({
    inputValue,
    error,
    isEmail,
    link,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setError(
      isEmail && value && !EMAIL_REGEX.test(value)
        ? "Введіть дійсну електронну адресу"
        : null
    );
  };

  return (
    <section className={`${styles.root} ${jost.className}`}>
      <Logo className={styles.logo} fill="#000" />
      <article className={styles.form_block}>
        <p>
          {isEmail
            ? "Введіть електронну адресу, яку вказували при реєстрації (для отримання тимчасового паролю)"
            : "Введіть тимчасовий пароль"}
        </p>
        <form onSubmit={handleSubmit}>
          <div className={styles.input}>
            <input
              value={inputValue}
              onChange={handleInputChange}
              type={isEmail ? "email" : "text"}
              placeholder={isEmail ? "Електронна адреса" : "Тимчасовий пароль"}
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <ServiceButton type="submit" disabled={isLoading}>
            {isLoading ? "Завантаження..." : isEmail ? "Продовжити" : "Увійти"}
          </ServiceButton>
        </form>
      </article>
    </section>
  );
}

export default withGuest(ResetPassword);
