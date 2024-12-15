import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "./redux-hooks";
import { useAuth } from "@/context/AuthContext";
import { FormEvent, useState } from "react";
import { loginAdmin, verifyAdmin } from "@/http/authController";
import { useRouter } from "next/navigation";
import {
  setAdminId,
  setAdminOtpId,
  setUserRole,
} from "@/redux/slices/userSlice";

interface LoginProps {
  email?: string;
  password?: string;
  code?: string;
}

const useAdminLogin = ({ email, password, code }: LoginProps) => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { adminOtpId } = useAppSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);

  const { setAdminAccessToken } = useAuth();

  const handleAdminLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password && !email) return;

    setIsLoading(true);
    try {
      if (email && password) {
        const userData = await loginAdmin({
          email,
          password,
        });

        if (userData.message === "OTP отправлен на почту" && userData.otpId) {
          dispatch(setAdminOtpId(userData.otpId));
          router.push("admin-login/verify-otp");
        } else if (userData.message.includes("Неправильні облікові дані")) {
          toast.error("Неправильні облікові дані або доступ заборонено!");
        } else {
          throw new Error("Admin login failed");
        }
      }
    } catch (error) {
      toast.error(`Щось пішло не так! Спробуйте пізніше.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAdmin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      if (!adminOtpId) {
        router.push("/admin-login");
      } else if (code) {
        const userData = await verifyAdmin({
          otpId: adminOtpId,
          code,
        });

        if (
          userData.message === "OTP підтверджено, вхід успішний" &&
          userData.userId
        ) {
          dispatch(setAdminId(userData.userId));
          dispatch(setUserRole(userData.role));
          setAdminAccessToken(userData.userId);
        } else if (userData.message === "Неправильний OTP код") {
          toast.error("Перевірте правильність даних!");
        } else {
          throw new Error("Admin login failed");
        }
      }
    } catch (error) {
      toast.error(`Щось пішло не так! Спробуйте пізніше.`);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleAdminLogin, handleVerifyAdmin };
};

export default useAdminLogin;
