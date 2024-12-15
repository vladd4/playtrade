import { jost } from "@/font";
import styles from "./AdminEdit.module.scss";

import React, { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ServiceButton from "@/components/ServiceButtons/ServiceButton";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { setShowEditUsersAdmin } from "@/redux/slices/alertSlice";

import SelectBlock from "@/components/SelectBlock/SelectBlock";
import { verify_options } from "@/static_store/edit_admin_options";
import { isNumeric } from "validator";
import {
  updateBalance,
  updateStatus,
  updateUserRole,
} from "@/http/userController";
import { useQueryClient } from "@tanstack/react-query";

import { privateAxios } from "@/http/axios";
import { UserRoles } from "@/utils/constants";

interface UserFormValues {
  balance: string;
  isVerified: string;
  userId: string;
}

interface ManagerFormValues {
  userId: string;
  role: UserRoles;
}

interface AdvertFormValues {
  name: string;
  price: string;
  description: string;
  productId: string;
}

export default function AdminEditAlert() {
  const [userFormValues, setUserFormValues] = useState<UserFormValues>();
  const [managerFormValues, setManagerFormValues] =
    useState<ManagerFormValues>();
  const [advertFormValues, setAdvertFormValues] = useState<AdvertFormValues>();
  const [label, setLabel] = useState("");

  const dispatch = useAppDispatch();
  const {
    showEditUsersAdmin,
    editUsersAdminType,
    adminAdvertToEdit,
    adminUserToEdit,
  } = useAppSelector((state) => state.alert);

  const queryClient = useQueryClient();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    setValues:
      | React.Dispatch<React.SetStateAction<UserFormValues | undefined>>
      | React.Dispatch<React.SetStateAction<AdvertFormValues | undefined>>
      | React.Dispatch<React.SetStateAction<ManagerFormValues | undefined>>
  ) => {
    const { name, value } = e.target;
    setValues((prevValues: any) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleCloseAlert = () => {
    dispatch(setShowEditUsersAdmin(false));
  };

  const handleUpdateUserBalance = async (e: FormEvent) => {
    e.preventDefault();

    if (userFormValues) {
      if (
        !isNumeric(userFormValues.balance) ||
        parseFloat(userFormValues?.balance) <= 0
      ) {
        toast.error("Некоректне значення балансу!");
      } else {
        const result = await updateBalance(
          userFormValues.userId,
          parseFloat(userFormValues.balance)
        );
        if (result) {
          toast.success("Значення балансу оновлено!");
          queryClient.invalidateQueries({ queryKey: [`all-users`] });
        } else {
          toast.error("Щось пішло не так. Спробуйте пізніше!");
        }
      }
    }
  };

  const handleUpdateUserStatus = async (e: FormEvent) => {
    e.preventDefault();

    if (userFormValues?.isVerified) {
      const status = userFormValues.isVerified === "yes" ? true : false;
      const result = await updateStatus(userFormValues.userId, status);
      if (result) {
        toast.success("Статус верифікації оновлено!");
        queryClient.invalidateQueries({ queryKey: [`all-users`] });
      } else {
        toast.error("Щось пішло не так. Спробуйте пізніше!");
      }
    }
  };

  const handleUpdateUserRole = async (e: FormEvent) => {
    e.preventDefault();

    if (managerFormValues?.role) {
      const result = await updateUserRole(
        managerFormValues.userId,
        managerFormValues.role
      );
      if (result) {
        toast.success("Роль користувача оновлено!");
        queryClient.invalidateQueries({ queryKey: [`all-managers`] });
        dispatch(setShowEditUsersAdmin(false));
      } else {
        toast.error("Щось пішло не так. Спробуйте пізніше!");
      }
    }
  };

  const handleEditProduct = async (e: FormEvent) => {
    e.preventDefault();

    if (advertFormValues) {
      if (
        !isNumeric(advertFormValues.price) ||
        parseFloat(advertFormValues?.price) <= 0
      ) {
        toast.error("Некоректне значення ціни!");
      } else {
        const formData = new FormData();
        Object.entries(advertFormValues).forEach(([key, value]) =>
          formData.append(key, value.trim())
        );

        const result = await privateAxios.put(
          `/products/${advertFormValues.productId}`,
          formData
        );

        if (result.data !== null && result.status === 200) {
          toast.success("Оголошення успішно змінено!");
          queryClient.invalidateQueries({ queryKey: [`all-products`] });
          dispatch(setShowEditUsersAdmin(false));
        }
      }
    }
  };

  useEffect(() => {
    if (editUsersAdminType === "user" && adminUserToEdit !== null) {
      setLabel("користувача");
      setUserFormValues({
        balance: adminUserToEdit.balance?.toString() ?? "0",
        isVerified: adminUserToEdit.isVerified ? "yes" : "no",
        userId: adminUserToEdit.id!,
      });
    } else if (editUsersAdminType === "product" && adminAdvertToEdit !== null) {
      setLabel("оголошення");
      setAdvertFormValues({
        price: adminAdvertToEdit.price ?? "0",
        name: adminAdvertToEdit.name,
        description: adminAdvertToEdit.description,
        productId: adminAdvertToEdit.id,
      });
    } else if (editUsersAdminType === "manager" && adminUserToEdit !== null) {
      setLabel("користувача");
      setManagerFormValues({
        role: adminUserToEdit.role as UserRoles,
        userId: adminUserToEdit.id!,
      });
    }
  }, [editUsersAdminType, adminUserToEdit, adminAdvertToEdit]);

  return (
    <>
      <section
        className={`${styles.root} ${jost.className} ${
          showEditUsersAdmin ? styles.show_form : ""
        }`}
      >
        <article className={styles.wrapper}>
          <h1>Редагувати {label}</h1>
          {editUsersAdminType === "user" ? (
            <>
              <form onSubmit={handleUpdateUserBalance}>
                <p>Баланс користувача</p>
                <input
                  placeholder="Баланс користувача"
                  value={userFormValues?.balance}
                  name="balance"
                  onChange={(e) => handleInputChange(e, setUserFormValues)}
                />
                <ServiceButton isActive className={styles.button} type="submit">
                  Оновити баланс
                </ServiceButton>
              </form>
              <form onSubmit={handleUpdateUserStatus}>
                <SelectBlock
                  value={userFormValues?.isVerified!}
                  defaultValue={{
                    value: "placeholder",
                    label: "Оберіть опцію",
                  }}
                  options={verify_options}
                  name="isVerified"
                  label="Статус верифікації"
                  onStateChange={(e) => handleInputChange(e, setUserFormValues)}
                  className={styles.select}
                />
                <ServiceButton isActive className={styles.button} type="submit">
                  Оновити статус
                </ServiceButton>
              </form>
            </>
          ) : editUsersAdminType === "product" ? (
            <form onSubmit={handleEditProduct}>
              <p>Назва продукту</p>
              <input
                placeholder="Назва продукту"
                value={advertFormValues?.name}
                name="name"
                onChange={(e) => handleInputChange(e, setAdvertFormValues)}
              />
              <p>Опис продукту</p>
              <textarea
                placeholder="Опис продукту"
                value={advertFormValues?.description}
                name="description"
                onChange={(e) => handleInputChange(e, setAdvertFormValues)}
              />
              <p>Ціна продукту</p>
              <input
                placeholder="Ціна продукту"
                value={advertFormValues?.price}
                name="price"
                onChange={(e) => handleInputChange(e, setAdvertFormValues)}
              />
              <ServiceButton isActive className={styles.button} type="submit">
                Зберегти зміни
              </ServiceButton>
            </form>
          ) : (
            <form onSubmit={handleUpdateUserRole}>
              <p>Роль користувача</p>
              <select
                className={styles.manager_select}
                defaultValue="placeholder"
                value={managerFormValues?.role}
                name="role"
                onChange={(e) => handleInputChange(e, setManagerFormValues)}
              >
                <option value="placeholder" disabled>
                  Роль користувача
                </option>
                {Object.values(UserRoles).map((role) => {
                  return (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  );
                })}
              </select>
              <ServiceButton isActive className={styles.button} type="submit">
                Оновити роль
              </ServiceButton>
            </form>
          )}
        </article>
      </section>
      <div
        onClick={handleCloseAlert}
        className={`${styles.overlay} ${
          showEditUsersAdmin ? styles.show_form : ""
        }`}
      />
    </>
  );
}
