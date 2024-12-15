import { jost } from "@/font";
import styles from "./AdminTable.module.scss";
import {
  Ban,
  KeyRound,
  Pencil,
  ShieldCheck,
  ShieldMinus,
  UserCog,
} from "lucide-react";
import { UserWithPurchases } from "@/types/user.type";

import { Tooltip } from "react-tooltip";

import { AdminProducts, Product } from "@/types/product.type";
import { unbanUser } from "@/http/userController";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import {
  setAdminAdvertToEdit,
  setAdminUserToEdit,
  setCreateGameAlertType,
  setEditGameId,
  setEditUsersAdminType,
  setShowBanAlert,
  setShowCreateGameAlert,
  setShowEditUsersAdmin,
  setUserToBanId,
} from "@/redux/slices/alertSlice";
import { updateProductStatus } from "@/http/productController";
import { Transaction } from "@/types/transaction.type";
import AdminEditAlert from "../AdminEditAlert/AdminEditAlert";
import { Game } from "@/types/game.type";
import { thead_variants } from "@/static_store/admin_table_head";

interface AdminTableProps {
  type: "operations" | "users" | "advertisement" | "games" | "managers";
  usersTableData?: UserWithPurchases[];
  advertTableData?: AdminProducts[];
  operationsTableData?: Transaction[];
  gamesTableData?: Game[];
  page?: number;
}

export default function AdminTable({
  type,
  usersTableData,
  advertTableData,
  gamesTableData,
  page,
}: AdminTableProps) {
  const headers = thead_variants[type] || [];

  const queryClient = useQueryClient();

  const dispatch = useAppDispatch();

  const userSlice = useAppSelector((state) => state.user);

  const handleBanUser = (userId: string) => {
    dispatch(setUserToBanId(userId));
    dispatch(setShowBanAlert(true));
  };

  const handleUnBanUser = async (userId: string) => {
    if (userId) {
      const result = await unbanUser(userId);

      if (result) {
        toast.success(`Користувач ${userId} був розблокований.`);
        queryClient.invalidateQueries({ queryKey: [`all-users`, page] });
      } else {
        toast.error(
          `Користувач ${userId} не був розблокований. Спробуйте пізніше!`
        );
      }
    }
  };

  const handleChangeProductStatus = async (
    productId: string,
    setIsActive: boolean
  ) => {
    if (productId) {
      const result = await updateProductStatus(productId, setIsActive);
      if (result) {
        toast.success(
          `Оголошення ${setIsActive ? "активовано" : "деактивовано"}!`
        );
        queryClient.invalidateQueries({
          queryKey: [`all-products`, page],
        });
      } else {
        toast.success("Щось пішло не так. Спробуйте пізніше.");
      }
    }
  };

  const handleGameEdit = async (gameId: string) => {
    if (gameId) {
      dispatch(setEditGameId(gameId));
      dispatch(setCreateGameAlertType("edit"));
      dispatch(setShowCreateGameAlert(true));
    }
  };

  return (
    <>
      <table className={`${styles.root} ${jost.className}`}>
        <thead>
          <tr>
            {headers.map((item) => {
              return <th key={item}>{item}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {type === "users" && usersTableData && usersTableData?.length > 0
            ? usersTableData.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email || "----"}</td>
                  <td>
                    {user.isVerified ? "Підтверджено" : "Не підтверджено"}
                  </td>
                  <td style={{ fontSize: "13px" }}>
                    {user.transactions && user.transactions.length > 0
                      ? user.transactions.map((trans) => {
                          return ` ------------------------------------------------
                            <br /> Товар: ${trans.productName} <br />
                            id: ${trans.id} <br />
                            дата: ${trans.createdAt} <br />
                            вартість: ${trans.amount} GB coins <br />
                            статус: ${trans.status} <br />
                  ------------------------------------------------
                    `;
                        })
                      : "----"}
                  </td>
                  <td>{user.balance ? user.balance : 0} GB coins</td>

                  <td className={styles.icons}>
                    {user.isBanned ? (
                      <div
                        data-tooltip-id="tooltip"
                        data-tooltip-content="Розблокувати"
                        onClick={() => handleUnBanUser(user.id)}
                      >
                        <KeyRound />
                      </div>
                    ) : (
                      <div
                        data-tooltip-id="tooltip"
                        data-tooltip-content="Заблокувати"
                        onClick={() => handleBanUser(user.id)}
                      >
                        <Ban />
                      </div>
                    )}
                    <div
                      data-tooltip-id="tooltip"
                      data-tooltip-content="Редагувати"
                      onClick={() => {
                        dispatch(setEditUsersAdminType("user"));
                        dispatch(setShowEditUsersAdmin(true));
                        dispatch(setAdminUserToEdit(user));
                      }}
                    >
                      <Pencil />
                    </div>
                    {userSlice?.userRole === "admin" && (
                      <div
                        data-tooltip-id="tooltip"
                        data-tooltip-content="Редагувати роль"
                        onClick={() => {
                          dispatch(setEditUsersAdminType("manager"));
                          dispatch(setShowEditUsersAdmin(true));
                          dispatch(setAdminUserToEdit(user));
                        }}
                      >
                        <UserCog />
                      </div>
                    )}
                  </td>
                </tr>
              ))
            : type === "advertisement" && advertTableData
            ? advertTableData.map((row) => (
                <tr key={row.id}>
                  <td>{row.name || "----"}</td>
                  <td>{row.game.name || "----"}</td>
                  <td>{row.owner?.id || "----"}</td>
                  <td>{row.price} GB coins</td>
                  <td>0</td>
                  <td className={styles.icons}>
                    <div
                      data-tooltip-id="tooltip"
                      data-tooltip-content="Редагувати"
                      onClick={() => {
                        dispatch(setEditUsersAdminType("product"));
                        dispatch(setShowEditUsersAdmin(true));
                        dispatch(setAdminAdvertToEdit(row));
                      }}
                    >
                      <Pencil />
                    </div>
                    {row.isActive ? (
                      <div
                        data-tooltip-id="tooltip"
                        data-tooltip-content="Деактивувати"
                        onClick={() => handleChangeProductStatus(row.id, false)}
                      >
                        <ShieldMinus />
                      </div>
                    ) : (
                      <div
                        data-tooltip-id="tooltip"
                        data-tooltip-content="Активувати"
                        className={styles.activate}
                        onClick={() => handleChangeProductStatus(row.id, true)}
                      >
                        <ShieldCheck />
                      </div>
                    )}
                  </td>
                </tr>
              ))
            : type === "games" && gamesTableData
            ? gamesTableData.map((game) => (
                <tr key={game.id}>
                  <td>{game.name || "----"}</td>
                  <td>{game.description || "----"}</td>
                  <td>{game.platforms?.join(", ") || "----"}</td>
                  <td>{game.region?.join(", ") || "----"}</td>
                  <td>{game.servers?.join(", ") || "----"}</td>
                  <td className={styles.icons}>
                    <div
                      data-tooltip-id="tooltip"
                      data-tooltip-content="Редагувати"
                      onClick={() => handleGameEdit(game.id)}
                    >
                      <Pencil />
                    </div>
                  </td>
                </tr>
              ))
            : type === "managers" &&
              usersTableData &&
              usersTableData?.length > 0
            ? usersTableData.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name || "----"}</td>
                  <td>{user.email || "----"}</td>
                  <td>{user.phoneNumber || "----"}</td>
                  <td>{user.role}</td>
                  <td className={styles.icons}>
                    <div
                      data-tooltip-id="tooltip"
                      data-tooltip-content="Редагувати"
                      onClick={() => {
                        dispatch(setEditUsersAdminType("manager"));
                        dispatch(setShowEditUsersAdmin(true));
                        dispatch(setAdminUserToEdit(user));
                      }}
                    >
                      <Pencil />
                    </div>
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
      <Tooltip id="tooltip" place="bottom" className={styles.tooltip} />
      <AdminEditAlert />
    </>
  );
}
