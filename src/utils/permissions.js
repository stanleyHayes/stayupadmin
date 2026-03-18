/**
 * All available permissions in the system, grouped by resource.
 * Each permission is a string constant used for checks throughout the app.
 */
export const PERMISSIONS = {
    // Dashboard
    VIEW_DASHBOARD: "view_dashboard",
    VIEW_ANALYTICS: "view_analytics",
    VIEW_REVENUE: "view_revenue",

    // Products
    VIEW_PRODUCTS: "view_products",
    CREATE_PRODUCTS: "create_products",
    EDIT_PRODUCTS: "edit_products",
    DELETE_PRODUCTS: "delete_products",

    // Orders
    VIEW_ORDERS: "view_orders",
    CREATE_ORDERS: "create_orders",
    EDIT_ORDERS: "edit_orders",
    DELETE_ORDERS: "delete_orders",

    // Customers
    VIEW_CUSTOMERS: "view_customers",
    CREATE_CUSTOMERS: "create_customers",
    EDIT_CUSTOMERS: "edit_customers",
    DELETE_CUSTOMERS: "delete_customers",

    // Coupons
    VIEW_COUPONS: "view_coupons",
    CREATE_COUPONS: "create_coupons",
    EDIT_COUPONS: "edit_coupons",
    DELETE_COUPONS: "delete_coupons",

    // Categories & Tags & Attributes
    VIEW_CATALOG: "view_catalog",
    MANAGE_CATALOG: "manage_catalog",

    // Reviews
    VIEW_REVIEWS: "view_reviews",
    MANAGE_REVIEWS: "manage_reviews",

    // Blog
    VIEW_BLOG: "view_blog",
    CREATE_BLOG: "create_blog",
    EDIT_BLOG: "edit_blog",
    DELETE_BLOG: "delete_blog",

    // Messages & Subscribers
    VIEW_MESSAGES: "view_messages",
    DELETE_MESSAGES: "delete_messages",
    VIEW_SUBSCRIBERS: "view_subscribers",
    DELETE_SUBSCRIBERS: "delete_subscribers",

    // Testimonials
    VIEW_TESTIMONIALS: "view_testimonials",
    MANAGE_TESTIMONIALS: "manage_testimonials",

    // Admin & User management
    VIEW_ADMINS: "view_admins",
    CREATE_ADMINS: "create_admins",
    EDIT_ADMINS: "edit_admins",
    DELETE_ADMINS: "delete_admins",
    VIEW_USERS: "view_users",
    CREATE_USERS: "create_users",
    EDIT_USERS: "edit_users",
    DELETE_USERS: "delete_users",

    // Invitations
    VIEW_INVITATIONS: "view_invitations",
    CREATE_INVITATIONS: "create_invitations",
    EDIT_INVITATIONS: "edit_invitations",
    DELETE_INVITATIONS: "delete_invitations",

    // Roles & Permissions
    VIEW_ROLES: "view_roles",
    MANAGE_ROLES: "manage_roles",

    // Settings (tax, payment, shipping, webhooks)
    VIEW_SETTINGS: "view_settings",
    MANAGE_SETTINGS: "manage_settings",
};

/**
 * Permission groups for display in the UI.
 */
export const PERMISSION_GROUPS = [
    {
        label: "Dashboard",
        permissions: [
            { key: PERMISSIONS.VIEW_DASHBOARD, label: "View dashboard" },
            { key: PERMISSIONS.VIEW_ANALYTICS, label: "View analytics" },
            { key: PERMISSIONS.VIEW_REVENUE, label: "View revenue" },
        ]
    },
    {
        label: "Products",
        permissions: [
            { key: PERMISSIONS.VIEW_PRODUCTS, label: "View products" },
            { key: PERMISSIONS.CREATE_PRODUCTS, label: "Create products" },
            { key: PERMISSIONS.EDIT_PRODUCTS, label: "Edit products" },
            { key: PERMISSIONS.DELETE_PRODUCTS, label: "Delete products" },
        ]
    },
    {
        label: "Orders",
        permissions: [
            { key: PERMISSIONS.VIEW_ORDERS, label: "View orders" },
            { key: PERMISSIONS.CREATE_ORDERS, label: "Create orders" },
            { key: PERMISSIONS.EDIT_ORDERS, label: "Edit orders" },
            { key: PERMISSIONS.DELETE_ORDERS, label: "Delete orders" },
        ]
    },
    {
        label: "Customers",
        permissions: [
            { key: PERMISSIONS.VIEW_CUSTOMERS, label: "View customers" },
            { key: PERMISSIONS.CREATE_CUSTOMERS, label: "Create customers" },
            { key: PERMISSIONS.EDIT_CUSTOMERS, label: "Edit customers" },
            { key: PERMISSIONS.DELETE_CUSTOMERS, label: "Delete customers" },
        ]
    },
    {
        label: "Coupons",
        permissions: [
            { key: PERMISSIONS.VIEW_COUPONS, label: "View coupons" },
            { key: PERMISSIONS.CREATE_COUPONS, label: "Create coupons" },
            { key: PERMISSIONS.EDIT_COUPONS, label: "Edit coupons" },
            { key: PERMISSIONS.DELETE_COUPONS, label: "Delete coupons" },
        ]
    },
    {
        label: "Catalog (Categories, Tags, Attributes)",
        permissions: [
            { key: PERMISSIONS.VIEW_CATALOG, label: "View catalog" },
            { key: PERMISSIONS.MANAGE_CATALOG, label: "Manage catalog" },
        ]
    },
    {
        label: "Reviews",
        permissions: [
            { key: PERMISSIONS.VIEW_REVIEWS, label: "View reviews" },
            { key: PERMISSIONS.MANAGE_REVIEWS, label: "Manage reviews" },
        ]
    },
    {
        label: "Blog",
        permissions: [
            { key: PERMISSIONS.VIEW_BLOG, label: "View blog posts" },
            { key: PERMISSIONS.CREATE_BLOG, label: "Create blog posts" },
            { key: PERMISSIONS.EDIT_BLOG, label: "Edit blog posts" },
            { key: PERMISSIONS.DELETE_BLOG, label: "Delete blog posts" },
        ]
    },
    {
        label: "Messages & Subscribers",
        permissions: [
            { key: PERMISSIONS.VIEW_MESSAGES, label: "View messages" },
            { key: PERMISSIONS.DELETE_MESSAGES, label: "Delete messages" },
            { key: PERMISSIONS.VIEW_SUBSCRIBERS, label: "View subscribers" },
            { key: PERMISSIONS.DELETE_SUBSCRIBERS, label: "Delete subscribers" },
        ]
    },
    {
        label: "Testimonials",
        permissions: [
            { key: PERMISSIONS.VIEW_TESTIMONIALS, label: "View testimonials" },
            { key: PERMISSIONS.MANAGE_TESTIMONIALS, label: "Manage testimonials" },
        ]
    },
    {
        label: "Admin & User Management",
        permissions: [
            { key: PERMISSIONS.VIEW_ADMINS, label: "View admins" },
            { key: PERMISSIONS.CREATE_ADMINS, label: "Create admins" },
            { key: PERMISSIONS.EDIT_ADMINS, label: "Edit admins" },
            { key: PERMISSIONS.DELETE_ADMINS, label: "Delete admins" },
            { key: PERMISSIONS.VIEW_USERS, label: "View users" },
            { key: PERMISSIONS.CREATE_USERS, label: "Create users" },
            { key: PERMISSIONS.EDIT_USERS, label: "Edit users" },
            { key: PERMISSIONS.DELETE_USERS, label: "Delete users" },
        ]
    },
    {
        label: "Invitations",
        permissions: [
            { key: PERMISSIONS.VIEW_INVITATIONS, label: "View invitations" },
            { key: PERMISSIONS.CREATE_INVITATIONS, label: "Create invitations" },
            { key: PERMISSIONS.EDIT_INVITATIONS, label: "Edit invitations" },
            { key: PERMISSIONS.DELETE_INVITATIONS, label: "Delete invitations" },
        ]
    },
    {
        label: "Roles & Permissions",
        permissions: [
            { key: PERMISSIONS.VIEW_ROLES, label: "View roles" },
            { key: PERMISSIONS.MANAGE_ROLES, label: "Manage roles" },
        ]
    },
    {
        label: "Settings (Tax, Payment, Shipping, Webhooks)",
        permissions: [
            { key: PERMISSIONS.VIEW_SETTINGS, label: "View settings" },
            { key: PERMISSIONS.MANAGE_SETTINGS, label: "Manage settings" },
        ]
    },
];

/** All permission keys as a flat array */
export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

/**
 * Default role templates. The backend is the source of truth —
 * these are just convenient defaults for the "create role" UI.
 */
export const DEFAULT_ROLE_TEMPLATES = {
    super_admin: {
        name: "Super Admin",
        description: "Full access to everything",
        permissions: [...ALL_PERMISSIONS],
    },
    admin: {
        name: "Admin",
        description: "Full access except role management",
        permissions: ALL_PERMISSIONS.filter(p => p !== PERMISSIONS.MANAGE_ROLES),
    },
    editor: {
        name: "Editor",
        description: "Manage content (products, blog, categories)",
        permissions: [
            PERMISSIONS.VIEW_DASHBOARD,
            PERMISSIONS.VIEW_PRODUCTS, PERMISSIONS.CREATE_PRODUCTS, PERMISSIONS.EDIT_PRODUCTS,
            PERMISSIONS.VIEW_ORDERS,
            PERMISSIONS.VIEW_CUSTOMERS,
            PERMISSIONS.VIEW_COUPONS,
            PERMISSIONS.VIEW_CATALOG, PERMISSIONS.MANAGE_CATALOG,
            PERMISSIONS.VIEW_REVIEWS, PERMISSIONS.MANAGE_REVIEWS,
            PERMISSIONS.VIEW_BLOG, PERMISSIONS.CREATE_BLOG, PERMISSIONS.EDIT_BLOG, PERMISSIONS.DELETE_BLOG,
            PERMISSIONS.VIEW_TESTIMONIALS, PERMISSIONS.MANAGE_TESTIMONIALS,
        ],
    },
    moderator: {
        name: "Moderator",
        description: "View and moderate content",
        permissions: [
            PERMISSIONS.VIEW_DASHBOARD,
            PERMISSIONS.VIEW_PRODUCTS,
            PERMISSIONS.VIEW_ORDERS,
            PERMISSIONS.VIEW_CUSTOMERS,
            PERMISSIONS.VIEW_REVIEWS, PERMISSIONS.MANAGE_REVIEWS,
            PERMISSIONS.VIEW_BLOG,
            PERMISSIONS.VIEW_MESSAGES, PERMISSIONS.DELETE_MESSAGES,
            PERMISSIONS.VIEW_TESTIMONIALS, PERMISSIONS.MANAGE_TESTIMONIALS,
        ],
    },
    viewer: {
        name: "Viewer",
        description: "Read-only access",
        permissions: [
            PERMISSIONS.VIEW_DASHBOARD,
            PERMISSIONS.VIEW_PRODUCTS,
            PERMISSIONS.VIEW_ORDERS,
            PERMISSIONS.VIEW_CUSTOMERS,
            PERMISSIONS.VIEW_COUPONS,
            PERMISSIONS.VIEW_CATALOG,
            PERMISSIONS.VIEW_REVIEWS,
            PERMISSIONS.VIEW_BLOG,
            PERMISSIONS.VIEW_MESSAGES,
            PERMISSIONS.VIEW_SUBSCRIBERS,
            PERMISSIONS.VIEW_TESTIMONIALS,
        ],
    },
};
