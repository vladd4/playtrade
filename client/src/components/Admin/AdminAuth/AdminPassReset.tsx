"use client";

import styles from "./Admin.module.scss";
import { useState } from "react";

import { jost } from "@/font";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo/Logo";
import ServiceButton from "@/components/ServiceButtons/ServiceButton";
import withAdminGuest from "@/utils/withAdminGuest";
import { useAuth } from "@/context/AuthContext";

interface ResetPassProps {
  isEmail: boolean;
  link: string;
}

function AdminPassReset({ isEmail, link }: ResetPassProps) {
  const [value, setValue] = useState("some@example.com");
  const router = useRouter();

  const { setAdminAccessToken } = useAuth();

  return (
    <section className={`${styles.root} ${jost.className}`}>
      <Logo className={styles.logo} fill="#5ec2c3" />
      <article className={styles.form_block}>
        {isEmail ? (
          <p>Введіть електронну адресу (для отримання тимчасового паролю)</p>
        ) : (
          <p>Введіть “тимчасовий пароль”</p>
        )}
        <form>
          <div className={styles.input}>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              type="text"
              placeholder={isEmail ? "Електронна адреса" : "Тимчасовий пароль"}
            />
            {!isEmail && (
              <p>*Замініть “тимчасовий пароль” в особистому кабінеті</p>
            )}
          </div>
          <ServiceButton
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              router.push(link);
              if (!isEmail) {
                setAdminAccessToken("adminToken");
              }
            }}
          >
            Увійти
          </ServiceButton>
        </form>
      </article>
    </section>
  );
}

export default withAdminGuest(AdminPassReset);
