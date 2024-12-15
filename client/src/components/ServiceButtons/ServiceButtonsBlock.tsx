"use client";

import styles from "./ServiceButtons.module.scss";

import { useEffect, useState } from "react";
import ServiceButton from "./ServiceButton";

import { useRouter, useSearchParams } from "next/navigation";
import { product_types } from "@/static_store/product_types";

export default function ServiceButtonsBlock() {
  const params = useSearchParams();
  const router = useRouter();

  const [activeQuery, setActiveQuery] = useState(
    params.get("type") || product_types[0].value
  );

  useEffect(() => {
    const currentType = params.get("type") || product_types[0].value;
    setActiveQuery(currentType);
  }, [params]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set("type", activeQuery);
    router.push(`?${queryParams.toString()}`, undefined);
  }, [activeQuery, router]);

  return (
    <div className={styles.root}>
      {product_types.map((item) => {
        return (
          <ServiceButton
            key={item.value}
            type="button"
            isActive={activeQuery === item.value}
            onClick={() => {
              setActiveQuery(item.value);
            }}
          >
            {item.label}
          </ServiceButton>
        );
      })}
    </div>
  );
}
