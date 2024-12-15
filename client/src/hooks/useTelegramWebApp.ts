import { setBackButton, setTg, setTgUser } from "@/redux/slices/tgSlice";
import { useEffect, useState } from "react";
import { useAppDispatch } from "./redux-hooks";

const useTelegramWebApp = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    function initTg() {
      if (
        typeof window !== "undefined" &&
        window.Telegram &&
        window.Telegram.WebApp
      ) {
        console.log("Telegram WebApp is set");
        const tgData = window.Telegram.WebApp;
        dispatch(setTg(tgData));
        dispatch(setBackButton(tgData.BackButton));

        if (tgData.initDataUnsafe.user) {
          dispatch(setTgUser(tgData.initDataUnsafe.user));
        }

        tgData.expand();
        document.documentElement.setAttribute(
          "data-theme",
          tgData.colorScheme || "light"
        );

        setIsLoading(false);
      } else {
        console.log("Telegram WebApp is undefined, retrying…");
        setTimeout(initTg, 1500);
      }
    }

    initTg();
  }, [dispatch]);

  return { isLoading };
};

export default useTelegramWebApp;
