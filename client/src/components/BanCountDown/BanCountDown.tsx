"use client";

import { useEffect, useState } from "react";
import ServiceButton from "../ServiceButtons/ServiceButton";
import styles from "./BanCountDown.module.scss";

interface BanProps {
  targetDate: Date | null;
}

export default function BanCountDown({ targetDate }: BanProps) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!targetDate) return;

    const interval = setInterval(() => {
      const now = new Date();
      const distance = targetDate.getTime() - now.getTime();

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft("Час бану закінчився. Спробуйте авторизуватись знову!");
        return;
      }

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft === "") return null;

  return (
    <article className={styles.form_block}>
      <p>Ваш аккаунт заблоковано</p>
      {timeLeft !== "" && <p>{timeLeft}</p>}
      <ServiceButton isActive>Підтримка</ServiceButton>
    </article>
  );
}
