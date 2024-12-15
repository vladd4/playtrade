"use client";

import styles from "./Admin.module.scss";
import { useState } from "react";

import { jost } from "@/font";
import Logo from "@/components/Logo/Logo";
import ServiceButton from "@/components/ServiceButtons/ServiceButton";
import withAdminGuest from "@/utils/withAdminGuest";
import useAdminLogin from "@/hooks/useAdminLogin";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/redux-hooks";

function AdminVerifyOtp() {
  const [code, setCode] = useState("");

  const router = useRouter();

  const { adminOtpId } = useAppSelector((state) => state.user);

  const { isLoading, handleVerifyAdmin } = useAdminLogin({
    code,
  });

  if (!adminOtpId) {
    router.push("/admin-login");
  }

  return (
    <section className={`${styles.root} ${jost.className}`}>
      <Logo className={styles.logo} fill="#5ec2c3" />
      <article className={styles.form_block}>
        <p>Введіть код, який ми відправили вам на пошту</p>
        <form onSubmit={handleVerifyAdmin}>
          <div className={styles.input}>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              type="text"
              placeholder="Введіть код"
            />
          </div>
          <ServiceButton disabled={isLoading} type="submit">
            {isLoading ? "Завантаження..." : "Увійти"}
          </ServiceButton>
        </form>
      </article>
    </section>
  );
}

export default withAdminGuest(AdminVerifyOtp);
