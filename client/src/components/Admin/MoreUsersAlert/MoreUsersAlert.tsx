"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import styles from "./MoreUsersAlert.module.scss";
import {
  setAdminUsersInfoType,
  setAdminUsersInfoUsers,
  setShowAdminUsersInfo,
} from "@/redux/slices/alertSlice";
import { jost } from "@/font";
import No_Avatar from "@/../public/no-avatar.jpg";
import ServiceButton from "@/components/ServiceButtons/ServiceButton";
import StarRating from "@/components/GameCards/StarRating";
import { User } from "@/types/user.type";
import { formatImageFromServer } from "@/utils/formatImageName";

export default function MoreUsersAlert() {
  const dispatch = useAppDispatch();
  const { showAdminUsersInfo, adminUsersInfoType, adminUsersInfoUsers } =
    useAppSelector((state) => state.alert);

  const handleCloseAlert = () => {
    dispatch(setShowAdminUsersInfo(false));
  };

  const handleUserSelect = (user: User) => {
    dispatch(setAdminUsersInfoUsers([user]));
    dispatch(setAdminUsersInfoType("currentUser"));
  };

  const handleChatOpen = () => {
    handleCloseAlert();
    dispatch(setAdminUsersInfoUsers(null));
    dispatch(setAdminUsersInfoType("selectUser"));
  };

  return (
    <>
      <div
        className={`${styles.root} ${jost.className} ${
          showAdminUsersInfo ? styles.show_form : ""
        }`}
      >
        <div className={styles.wrapper}>
          {adminUsersInfoUsers === null ? null : adminUsersInfoType ===
            "selectUser" ? (
            <>
              <h1>Оберіть користувача</h1>
              <div className={styles.users}>
                <div onClick={() => handleUserSelect(adminUsersInfoUsers[0])}>
                  <div
                    className={styles.avatar}
                    style={{
                      backgroundImage: `url(${
                        !adminUsersInfoUsers[0]?.avatarPhoto
                          ? No_Avatar.src
                          : `${
                              process.env.NEXT_PUBLIC_BACKEND_API_URL
                            }${formatImageFromServer(
                              adminUsersInfoUsers[0]?.avatarPhoto
                            )}`
                      })`,
                    }}
                  />
                  <p>{adminUsersInfoUsers[0].name}</p>
                </div>
                <div onClick={() => handleUserSelect(adminUsersInfoUsers[1])}>
                  <div
                    className={styles.avatar}
                    style={{
                      backgroundImage: `url(${
                        !adminUsersInfoUsers[1]?.avatarPhoto
                          ? No_Avatar.src
                          : `${
                              process.env.NEXT_PUBLIC_BACKEND_API_URL
                            }${formatImageFromServer(
                              adminUsersInfoUsers[1]?.avatarPhoto
                            )}`
                      })`,
                    }}
                  />
                  <p>{adminUsersInfoUsers[1].name}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div
                className={styles.avatar}
                style={{
                  backgroundImage: `url(${
                    adminUsersInfoUsers[0].avatarPhoto
                      ? process.env.NEXT_PUBLIC_BACKEND_API_URL +
                        formatImageFromServer(
                          adminUsersInfoUsers[0].avatarPhoto
                        )
                      : No_Avatar.src
                  })`,
                }}
              />
              <p className={styles.p}>
                Користувач: {adminUsersInfoUsers[0].name}
              </p>
              <p className={styles.p}>
                Рейтинг:{" "}
                <StarRating rating={adminUsersInfoUsers[0].rating} size={11} />
              </p>
              <p className={styles.p}>E-mail: {adminUsersInfoUsers[0].email}</p>
              <ServiceButton className={styles.button} onClick={handleChatOpen}>
                Відкрити чат
              </ServiceButton>
            </>
          )}
        </div>
      </div>
      <div
        onClick={handleCloseAlert}
        className={`${styles.overlay} ${
          showAdminUsersInfo ? styles.show_form : ""
        }`}
      />
    </>
  );
}
