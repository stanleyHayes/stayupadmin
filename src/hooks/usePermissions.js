import { useSelector } from "react-redux";
import { selectAuth } from "../redux/features/authentication/authentication-slice";

/**
 * Hook that returns permission checking utilities for the current user.
 *
 * The user object from the backend should contain:
 *   - role: string (role slug)
 *   - permissions: string[] (effective permissions, computed server-side from role + overrides)
 *
 * Usage:
 *   const { can, canAny, canAll } = usePermissions();
 *   if (can("edit_products")) { ... }
 *   if (canAny(["edit_products", "delete_products"])) { ... }
 */
const usePermissions = () => {
    const { user } = useSelector(selectAuth);
    const userPermissions = user?.permissions || [];
    const isSuperAdmin = user?.role === "super_admin";

    const can = (permission) => {
        if (isSuperAdmin) return true;
        return userPermissions.includes(permission);
    };

    const canAny = (permissions) => {
        if (isSuperAdmin) return true;
        return permissions.some(p => userPermissions.includes(p));
    };

    const canAll = (permissions) => {
        if (isSuperAdmin) return true;
        return permissions.every(p => userPermissions.includes(p));
    };

    return { can, canAny, canAll, permissions: userPermissions, isSuperAdmin };
};

export default usePermissions;
