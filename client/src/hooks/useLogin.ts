import { loginUser } from "@/http/authController";
import { setUserId } from "@/redux/slices/userSlice";
import { parseAndFormatDate } from "@/utils/formatTimestamp";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "./redux-hooks";
import { useAuth } from "@/context/AuthContext";

interface LoginProps {
  password: string;
}

const useLogin = ({ password }: LoginProps) => {
  const dispatch = useAppDispatch();

  const { setUserAccessToken, setClientAccessToken } = useAuth();

  const { tgUser } = useAppSelector((state) => state.tg);

  const [isLoading, setIsLoading] = useState(false);

  const [banTargetData, setBanTargetData] = useState<Date | null>(null);

  const handleUserLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password) return;

    setIsLoading(true);
    try {
      const userId =
        tgUser?.id ??
        (process.env.NODE_ENV === "development" ? "490607899" : "");

      const userData = await loginUser({
        telegramId: userId.toString(),
        password,
      });

      if (userData.message === "Login successful") {
        setUserAccessToken(userData.userId);
        dispatch(setUserId(userData.userId!));
      } else if (
        userData.message === "Неправильні облікові дані. Помилка з паролем"
      ) {
        toast.error("Перевірте правильність пароля!");
      } else if (userData.message?.includes("заблоковано")) {
        const { targetDate } = parseAndFormatDate(userData.message);
        setBanTargetData(targetDate);
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      toast.error(`Щось пішло не так! Спробуйте пізніше.`);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleUserLogin, banTargetData };
};

export default useLogin;
