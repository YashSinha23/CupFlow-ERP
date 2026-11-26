import {
  Home,
  ClipboardList,
  Factory,
  Package,
  CupSoda,
  ShelvingUnit,
  ArrowLeftRight,
  Link2,
  Users,
  Settings,
  UserRound,
  CalendarDays,
} from "lucide-react";

export const USER_MODULE_ROLES = ["ADMIN"];
export const EMPLOYEE_MODULE_ROLES = ["ADMIN", "HR_MANAGER"];
export const SHIFT_MODULE_ROLES = ["ADMIN", "HR_MANAGER", "MANAGER", "FLOOR_SUPERVISOR"];
export const MATERIAL_MODULE_ROLES = ["ADMIN", "MANAGER"];
export const CUP_MODULE_ROLES = ["ADMIN", "MANAGER"];
export const INVENTORY_MODULE_ROLES = [
  "ADMIN",
  "MANAGER",
  "FLOOR_SUPERVISOR",
];
export const ORDERS_MODULE_ROLES = ["ADMIN", "MANAGER"];
export const PRODUCTION_MODULE_ROLES = [
  "ADMIN",
  "MANAGER",
  "FLOOR_SUPERVISOR",
  "WORKER",
];

export const NAV_GROUPS = [
  {
    label: "Workspace",
    items: [
      {
        label: "Dashboard",
        path: "/",
        icon: Home,
        roles: null,
        available: true,
      },
    ],
  },
  {
    label: "Manufacturing",
    items: [
      {
        label: "Orders",
        path: "/orders",
        icon: ClipboardList,
        roles: ORDERS_MODULE_ROLES,
        available: true,
      },
      {
        label: "Production",
        path: "/manufacturing/production",
        icon: Factory,
        roles: PRODUCTION_MODULE_ROLES,
        available: true,
      },
      {
        label: "Products",
        path: "/cups",
        icon: CupSoda,
        roles: CUP_MODULE_ROLES,
        available: true,
      },
      {
        label: "Materials",
        path: "/materials",
        icon: Package,
        roles: MATERIAL_MODULE_ROLES,
        available: true,
      },
    ],
  },
  {
    label: "Inventory",
    items: [
      {
        label: "Stock overview",
        path: "/inventory",
        icon: ShelvingUnit,
        roles: INVENTORY_MODULE_ROLES,
        available: true,
      },
      {
        label: "Stock movements",
        path: "/inventory/movements",
        icon: ArrowLeftRight,
        roles: INVENTORY_MODULE_ROLES,
        available: true,
      },
      {
        label: "Reservations",
        path: "/inventory/reservations",
        icon: Link2,
        roles: INVENTORY_MODULE_ROLES,
          available: true,
      },
    ],
  },
  {
    label: "People",
    items: [
      {
        label: "Employees",
        path: "/employees",
        icon: UserRound,
        roles: EMPLOYEE_MODULE_ROLES,
        available: true,
        end: true,
      },
      {
        label: "Shift schedule",
        path: "/employees/shifts",
        icon: CalendarDays,
        roles: SHIFT_MODULE_ROLES,
        available: true,
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        label: "User accounts",
        path: "/users",
        icon: Users,
        roles: USER_MODULE_ROLES,
        available: true,
      },
      {
        label: "Settings",
        path: "/admin/settings",
        icon: Settings,
        roles: ["ADMIN"],
        available: false,
      },
    ],
  },
];

