import { Home, Users, Package, ClipboardList, CupSoda, ShelvingUnit, Logs } from 'lucide-react';


export const USER_MODULE_ROLES = ['ADMIN'];
export const MATERIAL_MODULE_ROLES = ['ADMIN', 'MANAGER'];
export const CUP_MODULE_ROLES = ['ADMIN', 'MANAGER'];
export const INVENTORY_MODULE_ROLES = ['ADMIN', 'MANAGER'];
export const ORDERS_MODULE_ROLES = ['ADMIN', 'MANAGER'];

export const NAV_ITEMS = [
    {
        label: 'Home',
        path: '/',
        icon: Home,
        roles: null,
    },
    {
        label: 'Users',
        path: '/users',
        icon: Users,
        roles: USER_MODULE_ROLES,
    },
    {
        label: 'Materials',
        path: '/materials',
        icon: Package,
        roles: MATERIAL_MODULE_ROLES,
    },
    {
        label: 'Cups',
        path: '/cups',
        icon: CupSoda,
        roles: CUP_MODULE_ROLES,
    },
    {
        label: 'Inventory',
        path: '/inventory',
        icon: ShelvingUnit,
        roles: INVENTORY_MODULE_ROLES,
    },
    {
        label: 'Orders',
        path: '/orders',
        icon: Logs,
        roles: ORDERS_MODULE_ROLES,
    }
];