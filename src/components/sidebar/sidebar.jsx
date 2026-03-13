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
    BarChart,
    BarChartOutlined,
    Category,
    CategoryOutlined,
    LocalOffer,
    LocalOfferOutlined,
    People,
    PeopleOutline,
    Settings,
    SettingsOutlined,
    LocalShipping,
    LocalShippingOutlined,
    ReceiptLong,
    ReceiptLongOutlined,
    Receipt,
    ReceiptOutlined,
    SupportAgent,
    SupportAgentOutlined,
    Tag,
    TagOutlined,
    MonetizationOn,
    MonetizationOnOutlined,
    Storefront,
    StorefrontOutlined,
    AccountTree,
    AccountTreeOutlined,
    AutoStories,
    AutoStoriesOutlined,
    AdminPanelSettings,
    AdminPanelSettingsOutlined,
    Link,
    LinkOutlined,
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
                    {/* Dashboard & Analytics */}
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
                            label="Analytics"
                            path="/analytics"
                            icon={isActive("/analytics") ? <BarChart sx={activeStyle} /> : <BarChartOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    {/* Orders */}
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

                    {/* Products */}
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

                    {/* Sales & Marketing */}
                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Coupons"
                            path="/coupons"
                            icon={isActive("/coupons") ? <LocalOffer sx={activeStyle} /> : <LocalOfferOutlined sx={defaultStyle} />}
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

                    {/* People */}
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
                            icon={isActive("/invitations") ? <MonetizationOn sx={activeStyle} /> : <MonetizationOnOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    {/* Finance */}
                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Payment Gateways"
                            path="/payment-gateways"
                            icon={isActive("/payment-gateways") ? <MonetizationOn sx={activeStyle} /> : <MonetizationOnOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Tax Rates"
                            path="/tax-rates"
                            icon={isActive("/tax-rates") ? <Receipt sx={activeStyle} /> : <ReceiptOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Tax Classes"
                            path="/tax-classes"
                            icon={isActive("/tax-classes") ? <Receipt sx={activeStyle} /> : <ReceiptOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    {/* Shipping */}
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
                </Stack>
            </Container>

            <Divider variant="fullWidth" light={true} />

            <Container sx={{ py: 6 }}>
                <Stack component={motion.div} variants={container} sx={{ px: { xs: 0, lg: sidebarExpanded ? 8 : 0 } }} direction="column" spacing={4}>
                    {/* People & System */}
                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Admins"
                            path="/admins"
                            icon={isActive("/admins") ? <AdminPanelSettings sx={activeStyle} /> : <AdminPanelSettingsOutlined sx={defaultStyle} />}
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

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Webhooks"
                            path="/webhooks"
                            icon={isActive("/webhooks") ? <Link sx={activeStyle} /> : <LinkOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Settings"
                            path="/settings"
                            icon={isActive("/settings") ? <Settings sx={activeStyle} /> : <SettingsOutlined sx={defaultStyle} />}
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
