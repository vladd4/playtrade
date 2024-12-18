import { UserRoles } from "@/utils/constants";
import {
  Handshake,
  MessagesSquare,
  Shapes,
  TableCellsMerge,
  UserCog,
  Users,
} from "lucide-react";

export const admin_links = [
  {
    label: "Угоди",
    icon: <Handshake size={20} />,
    href: "/admin",
    roles: [UserRoles.ADMIN, UserRoles.MANAGER],
  },
  {
    label: "Користувачі",
    icon: <Users size={20} />,
    href: "/admin/users",
    roles: [UserRoles.ADMIN, UserRoles.MANAGER],
  },
  {
    label: "Оголошення",
    icon: <TableCellsMerge size={20} />,
    href: "/admin/advertisement",
    roles: [UserRoles.ADMIN, UserRoles.MANAGER],
  },
  // {
  //   label: "Фінанси",
  //   icon: <Wallet size={20} />,
  //   href: "/admin/finances",
  //   roles: [UserRoles.ADMIN, UserRoles.MANAGER],
  // },
  {
    label: "Ігри",
    icon: <Shapes size={20} />,
    href: "/admin/category",
    roles: [UserRoles.ADMIN, UserRoles.MANAGER],
  },
  {
    label: "Технічна підтримка",
    icon: <MessagesSquare size={20} />,
    href: "/admin/support",
    roles: [UserRoles.ADMIN, UserRoles.MANAGER],
  },
  {
    label: "Менеджери",
    icon: <UserCog size={20} />,
    href: "/admin/managers",
    roles: [UserRoles.ADMIN],
  },
];
