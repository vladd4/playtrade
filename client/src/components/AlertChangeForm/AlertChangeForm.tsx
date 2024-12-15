"use client";

import { jost } from "@/font";
import styles from "./Alert.module.scss";
import React, { useState } from "react";
import ServiceButton from "../ServiceButtons/ServiceButton";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { setShowChangeAlert } from "@/redux/slices/alertSlice";
import { changeUserName, changeUserPassword } from "@/http/userController";
import { Eye, EyeOff, X } from "lucide-react";

import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface AlertProps {
  currentUserName: string;
}

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  name: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder,
  name,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.input}>
      <input
        value={value}
        name={name}
        onChange={onChange}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
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
    </div>
  );
};

export default function AlertChangeForm({ currentUserName }: AlertProps) {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [userName, setUserName] = useState(
    currentUserName ? currentUserName : ""
  );
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const { showChangeAlert, changeAlertType } = useAppSelector(
    (state) => state.alert
  );
  const { userId } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  const resetState = () => {
    setFormData((prev) => ({ ...prev, oldPassword: "", newPassword: "" }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error("Користувача не знайдено. Спробуйте пізніше!");
      return;
    }

    setIsLoading(true);
    try {
      if (changeAlertType === "password") {
        await handlePasswordChange(userId);
      } else {
        await handleNameChange(userId);
      }
    } catch (error) {
      toast.error("Щось пішло не так. Спробуйте пізніше!");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (userId: string) => {
    const { oldPassword, newPassword } = formData;
    if (newPassword === oldPassword) {
      toast.error("Новий пароль має відрізнятися!");
      return;
    }

    const statusCode = await changeUserPassword(
      userId,
      oldPassword,
      newPassword
    );
    if (statusCode === 200) {
      toast.success("Пароль успішно змінено.");
      dispatch(setShowChangeAlert(false));
      resetState();
    } else if (statusCode === 400) {
      toast.error("Неправильний пароль. Спробуйте ще раз.");
    } else {
      toast.error("Щось пішло не так. Спробуйте ще раз пізніше.");
    }
  };

  const handleNameChange = async (userId: string) => {
    const response = await changeUserName(userId, userName.trim());
    if (response.status === 200) {
      toast.success("Ім'я успішно змінено.");
      queryClient.invalidateQueries({ queryKey: [`user-${userId}`] });
      dispatch(setShowChangeAlert(false));
      setFormData((prev) => ({ ...prev, userName: response.data.name }));
    } else {
      toast.error("Щось пішло не так. Спробуйте ще раз пізніше.");
    }
  };

  return (
    <section
      className={`${styles.root} ${jost.className} ${
        showChangeAlert ? styles.show_root : ""
      }`}
    >
      <article className={styles.form_block}>
        <X
          onClick={() => {
            dispatch(setShowChangeAlert(false));
            resetState();
          }}
          className={styles.svg}
        />
        <p>
          {changeAlertType === "password"
            ? "Зміна паролю"
            : "Зміна ім'я користувача"}
        </p>
        <form onSubmit={handleSubmit}>
          {changeAlertType === "password" ? (
            <>
              <PasswordInput
                value={formData.oldPassword}
                onChange={handleInputChange}
                placeholder="Поточний пароль"
                name="oldPassword"
              />
              <PasswordInput
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Новий пароль"
                name="newPassword"
              />
            </>
          ) : (
            <div className={styles.input}>
              <input
                name="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                type="text"
                placeholder="Нове ім'я"
                required
              />
            </div>
          )}
          <ServiceButton type="submit" disabled={isLoading}>
            {isLoading ? "Завантаження..." : "Зберегти"}
          </ServiceButton>
        </form>
      </article>
    </section>
  );
}
