// src/components/layout/Sidebar.jsx
import { Box, CardMedia, Container, Divider, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { selectUI } from "../../redux/features/ui/ui-slice";
import logo from "./../../assets/images/logo/logo_image.png";
import { AnimatePresence, motion } from "framer-motion";
import SidebarLink from "../shared/sidebar-link.jsx";
import { useLocation } from "react-router-dom";
import {
    Dashboard,
    DashboardOutlined,
    Analytics,
    Category,
    CategoryOutlined,
    LocalOffer,
    LocalOfferOutlined,
    People,
    PeopleOutline,
    Inventory,
    Inventory2Outlined,
    Settings,
    SettingsOutlined,
    LocalShipping,
    LocalShippingOutlined,
    ReceiptLong,
    ReceiptLongOutlined,
    SupportAgent,
    SupportAgentOutlined,
    Tag,
    TagOutlined,
    Widgets,
    WidgetsOutlined,
    MonetizationOn,
    MonetizationOnOutlined,
    Storefront,
    StorefrontOutlined,
    AccountTree,
    AccountTreeOutlined,
    AutoStories,
    AutoStoriesOutlined,
    Campaign,
    CampaignOutlined,
    Help,
    HelpOutline,
    LogoutOutlined
} from "@mui/icons-material";

/**
 * Note:
 * - I reused your existing motion wrappers and style pattern.
 * - I used descriptive route prefixes (e.g. "/orders", "/products", "/shipping-methods") — adjust to your routing if needed.
 * - SidebarLink should accept props: {label, path, icon, hasBadge} as in your project.
 */

const container = {};
const item = {};

const Sidebar = () => {
    const { sidebarExpanded } = useSelector(selectUI);
    const { pathname } = useLocation();

    const activeStyle = {
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: "100%",
        borderColor: "border.secondary",
        padding: 1,
        fontSize: 36,
        color: "secondary.main",
        backgroundColor: "light.secondary"
    };

    const defaultStyle = {
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: "100%",
        borderColor: "border.default",
        padding: 1,
        fontSize: 36,
        color: "icon.default",
        backgroundColor: "light.default"
    };

    // small helper to check startsWith with fallback root
    const isActive = (basePath) => {
        if (!basePath) return false;
        if (basePath === "/") return pathname === "/";
        return pathname.startsWith(basePath);
    };

    return (
        <Box>
            <Container sx={{ py: { xs: 0, md: 2.05 } }}>
                <Box sx={{ px: { xs: 0, lg: sidebarExpanded ? 8 : 0 } }} component={motion.div}>
                    <AnimatePresence initial={true} presenceAffectsLayout={true} mode="wait">
                        {sidebarExpanded ? (
                            <Box component={motion.div} exit={{}}>
                                <Stack spacing={3} direction="row" alignItems="center">
                                    <CardMedia component="img" sx={{ width: 30, height: 30, objectFit: "contain" }} alt="Logo" src={logo} />
                                    <Typography sx={{ color: "secondary.main", fontSize: 20, fontWeight: 700 }} variant="body1">
                                        Stay Up
                                    </Typography>
                                </Stack>
                            </Box>
                        ) : (
                            <Stack direction="row" justifyContent="center" component={motion.div} exit={{}}>
                                <CardMedia component="img" sx={{ width: 30, height: 30, objectFit: "contain" }} alt="Logo" src={logo} />
                            </Stack>
                        )}
                    </AnimatePresence>
                </Box>
            </Container>

            <Divider variant="fullWidth" />

            <Container sx={{ py: 6 }}>
                <Stack component={motion.div} variants={container} sx={{ px: { xs: 0, lg: sidebarExpanded ? 8 : 0 } }} direction="column" spacing={4}>
                    {/* Primary / core admin items */}
                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Dashboard"
                            path="/"
                            icon={isActive("/") ? <Dashboard sx={activeStyle} /> : <DashboardOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Overview"
                            path="/overview"
                            icon={isActive("/overview") ? <Analytics sx={activeStyle} /> : <Analytics sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Orders"
                            path="/orders"
                            icon={isActive("/orders") ? <ReceiptLong sx={activeStyle} /> : <ReceiptLongOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Order Actions"
                            path="/order-actions"
                            icon={isActive("/order-actions") ? <Widgets sx={activeStyle} /> : <WidgetsOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Order Notes"
                            path="/order-notes"
                            icon={isActive("/order-notes") ? <AutoStories sx={activeStyle} /> : <AutoStoriesOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Order Refunds"
                            path="/order-refunds"
                            icon={isActive("/order-refunds") ? <MonetizationOn sx={activeStyle} /> : <MonetizationOnOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Products"
                            path="/products"
                            icon={isActive("/products") ? <Storefront sx={activeStyle} /> : <StorefrontOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Variations"
                            path="/variations"
                            icon={isActive("/variations") ? <AutoStories sx={activeStyle} /> : <AutoStoriesOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Attributes"
                            path="/attributes"
                            icon={isActive("/attributes") ? <AccountTree sx={activeStyle} /> : <AccountTreeOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Categories"
                            path="/categories"
                            icon={isActive("/categories") ? <Category sx={activeStyle} /> : <CategoryOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Tags"
                            path="/tags"
                            icon={isActive("/tags") ? <Tag sx={activeStyle} /> : <TagOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Coupons"
                            path="/attributes"
                            icon={isActive("/attributes") ? <LocalOffer sx={activeStyle} /> : <LocalOfferOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Customers"
                            path="/customers"
                            icon={isActive("/customers") ? <People sx={activeStyle} /> : <PeopleOutline sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Invitations"
                            path="/invitations"
                            icon={isActive("/invitations") ? <Campaign sx={activeStyle} /> : <CampaignOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Reviews"
                            path="/reviews"
                            icon={isActive("/reviews") ? <SupportAgent sx={activeStyle} /> : <SupportAgentOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Sales"
                            path="/sales"
                            icon={isActive("/sales") ? <MonetizationOn sx={activeStyle} /> : <MonetizationOnOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Payment Gateways"
                            path="/payment-gateways"
                            icon={isActive("/payment-gateways") ? <LocalOffer sx={activeStyle} /> : <LocalOfferOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Shipping Classes"
                            path="/shipping-classes"
                            icon={isActive("/shipping-classes") ? <LocalShipping sx={activeStyle} /> : <LocalShippingOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Shipping Methods"
                            path="/shipping-methods"
                            icon={isActive("/shipping-methods") ? <LocalShipping sx={activeStyle} /> : <LocalShippingOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Shipping Zone Methods"
                            path="/shipping-zone-methods"
                            icon={isActive("/shipping-zone-methods") ? <LocalShipping sx={activeStyle} /> : <LocalShippingOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Stocks"
                            path="/stocks"
                            icon={isActive("/stocks") ? <Inventory sx={activeStyle} /> : <Inventory2Outlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Payment Overview"
                            path="/overview/payment"
                            icon={isActive("/overview/payment") ? <MonetizationOn sx={activeStyle} /> : <MonetizationOnOutlined sx={defaultStyle} />}
                        />
                    </Box>
                </Stack>
            </Container>

            <Divider variant="fullWidth" light={true} />

            <Container sx={{ py: 6 }}>
                <Stack component={motion.div} variants={container} sx={{ px: { xs: 0, lg: sidebarExpanded ? 8 : 0 } }} direction="column" spacing={4}>
                    {/* Settings / System */}
                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Settings"
                            path="/settings"
                            icon={isActive("/settings") ? <Settings sx={activeStyle} /> : <SettingsOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Authentication"
                            path="/authentication"
                            icon={isActive("/authentication") ? <AccountTree sx={activeStyle} /> : <AccountTreeOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Support"
                            path="/support"
                            icon={isActive("/support") ? <Help sx={activeStyle} /> : <HelpOutline sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Users"
                            path="/users"
                            icon={isActive("/users") ? <People sx={activeStyle} /> : <PeopleOutline sx={defaultStyle} />}
                        />
                    </Box>
                </Stack>
            </Container>

            <Divider variant="fullWidth" light={true} />

            <Container sx={{ py: 6 }}>
                <Stack component={motion.div} variants={container} sx={{ px: { xs: 0, lg: sidebarExpanded ? 8 : 0 } }} direction="column" spacing={4}>
                    <Box animate={{}} initial={{}} whileHover={{}} component={motion.div}>
                        <AnimatePresence initial={true} presenceAffectsLayout={true} mode="wait">
                            {sidebarExpanded ? (
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <LogoutOutlined
                                        sx={{
                                            color: "text.red",
                                            backgroundColor: "light.red",
                                            borderWidth: 1,
                                            borderStyle: "solid",
                                            borderRadius: "100%",
                                            borderColor: "light.red",
                                            padding: 1,
                                            fontSize: 36
                                        }}
                                    />
                                    <Typography sx={{ color: "text.red", fontSize: 12, textTransform: "uppercase", fontWeight: 500 }} size="body2">
                                        Logout
                                    </Typography>
                                </Stack>
                            ) : (
                                <Stack direction="row" justifyContent="center" component={motion.div} exit={{}}>
                                    <LogoutOutlined
                                        sx={{
                                            color: "text.red",
                                            backgroundColor: "light.red",
                                            borderWidth: 1,
                                            borderStyle: "solid",
                                            borderRadius: "100%",
                                            borderColor: "light.red",
                                            padding: 1,
                                            fontSize: 36
                                        }}
                                    />
                                </Stack>
                            )}
                        </AnimatePresence>
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
};

export default Sidebar;
