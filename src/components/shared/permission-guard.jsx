import usePermissions from "../../hooks/usePermissions";

/**
 * Conditionally renders children based on the current user's permissions.
 *
 * Props:
 *   - permission: string — single permission to check
 *   - any: string[] — render if user has ANY of these permissions
 *   - all: string[] — render if user has ALL of these permissions
 *   - fallback: ReactNode — optional content to show when denied
 *
 * Usage:
 *   <Can permission="edit_products">
 *       <Button>Edit</Button>
 *   </Can>
 *
 *   <Can any={["edit_products", "delete_products"]}>
 *       <ActionsMenu />
 *   </Can>
 */
const Can = ({ permission, any, all, fallback = null, children }) => {
    const { can, canAny, canAll } = usePermissions();

    let allowed = false;

    if (permission) {
        allowed = can(permission);
    } else if (any) {
        allowed = canAny(any);
    } else if (all) {
        allowed = canAll(all);
    }

    return allowed ? children : fallback;
};

export default Can;
