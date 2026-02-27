// src/components/layout/MobileDrawer.jsx
import {Box, CardMedia, Container, Divider, Stack, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {selectUI, UI_ACTION_CREATORS} from "../../redux/features/ui/ui-slice";
import logo from "./../../assets/images/logo/logo_text.png";
import {motion} from "framer-motion";
import DrawerLink from "../shared/drawer-link.jsx";
import {useLocation} from "react-router-dom";
import {
    AccountTree,
    AccountTreeOutlined,
    AdminPanelSettings,
    AdminPanelSettingsOutlined,
    AutoStories,
    AutoStoriesOutlined,
    Campaign,
    CampaignOutlined,
    Category,
    CategoryOutlined,
    Checkroom,
    CheckroomOutlined,
    Close,
    Dashboard,
    DashboardOutlined,
    Face,
    FaceOutlined,
    Help,
    HelpOutline,
    Inventory,
    Inventory2Outlined,
    LocalShipping,
    LocalShippingOutlined,
    LogoutOutlined,
    MonetizationOn,
    MonetizationOnOutlined,
    Percent,
    PercentOutlined,
    ReceiptLong,
    ReceiptLongOutlined,
    Settings,
    SettingsOutlined,
    SignalCellularAlt,
    SignalCellularAltOutlined,
    SupportAgent,
    SupportAgentOutlined,
    Tag,
    TagOutlined,
    Widgets,
    WidgetsOutlined
} from "@mui/icons-material";

const container = {};
const item = {};

const MobileDrawer = () => {
    const { sidebarExpanded } = useSelector(selectUI);
    const { pathname } = useLocation();
    const dispatch = useDispatch();

    const activeStyle = {
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: "100%",
        borderColor: "light.secondary",
        padding: 1,
        fontSize: 36,
        color: "secondary.main",
        backgroundColor: "light.secondary"
    };

    const defaultStyle = {
        padding: 1,
        fontSize: 36,
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: "100%",
        borderColor: "light.default",
        color: "icon.default",
        backgroundColor: "light.default"
    };

    const isActive = (basePath) => {
        if (!basePath) return false;
        if (basePath === "/") return pathname === "/";
        return pathname.startsWith(basePath);
    };

    // helper to close drawer on link click
    const handleClose = () => dispatch(UI_ACTION_CREATORS.toggleDrawer(false));

    return (
        <Box sx={{ width: "90vw" }}>
            <Container sx={{ px: 6, py: 4 }}>
                <Box
                    sx={{ px: { xs: 0, lg: sidebarExpanded ? 8 : 0 } }}
                    animate={{}}
                    initial={{}}
                    whileHover={{}}
                    component={motion.div}
                >
                    <Stack sx={{ width: "100%" }} justifyContent="space-between" direction="row" component={motion.div}>
                        <Stack spacing={3} direction="row" alignItems="center">
                            <CardMedia component="img" sx={{ width: 30, height: 30, objectFit: "contain" }} alt="Logo" src={logo} />
                        </Stack>

                        <Close
                            sx={{
                                padding: 1,
                                fontSize: 36,
                                borderWidth: 2,
                                borderStyle: "solid",
                                borderRadius: "100%",
                                borderColor: "light.secondary",
                                color: "secondary.main",
                                backgroundColor: "light.secondary",
                                cursor: "pointer"
                            }}
                            onClick={() => dispatch(UI_ACTION_CREATORS.toggleDrawer(false))}
                        />
                    </Stack>
                </Box>
            </Container>

            <Divider variant="fullWidth" />

            <Container sx={{ py: 6, px: 6 }}>
                <Stack component={motion.div} variants={container} sx={{ px: { xs: 0, lg: sidebarExpanded ? 8 : 0 } }} direction="column" spacing={4}>
                    {/* Primary / core admin items */}
                    <Box component={motion.div} variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Dashboard"
                            path="/"
                            onClick={handleClose}
                            icon={isActive("/") || isActive("/overview") ? <Dashboard sx={activeStyle} /> : <DashboardOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Overview"
                            path="/overview"
                            onClick={handleClose}
                            icon={isActive("/overview") ? <SignalCellularAlt sx={activeStyle} /> : <SignalCellularAltOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Orders"
                            path="/orders"
                            onClick={handleClose}
                            icon={isActive("/orders") ? <ReceiptLong sx={activeStyle} /> : <ReceiptLongOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Order Actions"
                            path="/order-actions"
                            onClick={handleClose}
                            icon={isActive("/order-actions") ? <Widgets sx={activeStyle} /> : <WidgetsOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Order Notes"
                            path="/order-notes"
                            onClick={handleClose}
                            icon={isActive("/order-notes") ? <AutoStories sx={activeStyle} /> : <AutoStoriesOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Order Refunds"
                            path="/order-refunds"
                            onClick={handleClose}
                            icon={isActive("/order-refunds") ? <MonetizationOn sx={activeStyle} /> : <MonetizationOnOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Products"
                            path="/products"
                            onClick={handleClose}
                            icon={isActive("/products") ? <Checkroom sx={activeStyle} /> : <CheckroomOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Variations"
                            path="/variations"
                            onClick={handleClose}
                            icon={isActive("/variations") ? <AutoStories sx={activeStyle} /> : <AutoStoriesOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Attributes"
                            path="/attributes"
                            onClick={handleClose}
                            icon={isActive("/attributes") ? <Category sx={activeStyle} /> : <CategoryOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Categories"
                            path="/categories"
                            onClick={handleClose}
                            icon={isActive("/categories") ? <Category sx={activeStyle} /> : <CategoryOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Tags"
                            path="/tags"
                            onClick={handleClose}
                            icon={isActive("/tags") ? <Tag sx={activeStyle} /> : <TagOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Coupons"
                            path="/attributes"
                            onClick={handleClose}
                            icon={isActive("/attributes") ? <Percent sx={activeStyle} /> : <PercentOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Customers"
                            path="/customers"
                            onClick={handleClose}
                            icon={isActive("/customers") ? <Face sx={activeStyle} /> : <FaceOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Invitations"
                            path="/invitations"
                            onClick={handleClose}
                            icon={isActive("/invitations") ? <Campaign sx={activeStyle} /> : <CampaignOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Reviews"
                            path="/reviews"
                            onClick={handleClose}
                            icon={isActive("/reviews") ? <SupportAgent sx={activeStyle} /> : <SupportAgentOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Sales"
                            path="/sales"
                            onClick={handleClose}
                            icon={isActive("/sales") ? <MonetizationOn sx={activeStyle} /> : <MonetizationOnOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Payment Gateways"
                            path="/payment-gateways"
                            onClick={handleClose}
                            icon={isActive("/payment-gateways") ? <LocalShipping sx={activeStyle} /> : <LocalShippingOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Shipping Classes"
                            path="/shipping-classes"
                            onClick={handleClose}
                            icon={isActive("/shipping-classes") ? <LocalShipping sx={activeStyle} /> : <LocalShippingOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Shipping Methods"
                            path="/shipping-methods"
                            onClick={handleClose}
                            icon={isActive("/shipping-methods") ? <LocalShipping sx={activeStyle} /> : <LocalShippingOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Shipping Zone Methods"
                            path="/shipping-zone-methods"
                            onClick={handleClose}
                            icon={isActive("/shipping-zone-methods") ? <LocalShipping sx={activeStyle} /> : <LocalShippingOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Stocks"
                            path="/stocks"
                            onClick={handleClose}
                            icon={isActive("/stocks") ? <Inventory sx={activeStyle} /> : <Inventory2Outlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Payment Overview"
                            path="/overview/payment"
                            onClick={handleClose}
                            icon={isActive("/overview/payment") ? <MonetizationOn sx={activeStyle} /> : <MonetizationOnOutlined sx={defaultStyle} />}
                        />
                    </Box>
                </Stack>
            </Container>

            <Divider variant="fullWidth" />

            <Container sx={{ py: 6, px: 6 }}>
                <Stack component={motion.div} variants={container} sx={{ px: { xs: 0, lg: sidebarExpanded ? 8 : 0 } }} direction="column" spacing={4}>
                    {/* Settings / System */}
                    <Box component={motion.div} variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Settings"
                            path="/settings"
                            onClick={handleClose}
                            icon={isActive("/settings") ? <Settings sx={activeStyle} /> : <SettingsOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Authentication"
                            path="/authentication"
                            onClick={handleClose}
                            icon={isActive("/authentication") ? <AccountTree sx={activeStyle} /> : <AccountTreeOutlined sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Support"
                            path="/support"
                            onClick={handleClose}
                            icon={isActive("/support") ? <Help sx={activeStyle} /> : <HelpOutline sx={defaultStyle} />}
                        />
                    </Box>

                    <Box component={motion.div} variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Users"
                            path="/users"
                            onClick={handleClose}
                            icon={isActive("/users") ? <AdminPanelSettings sx={activeStyle} /> : <AdminPanelSettingsOutlined sx={defaultStyle} />}
                        />
                    </Box>
                </Stack>
            </Container>

            <Divider variant="fullWidth" />

            <Container sx={{ py: 6, px: 6 }}>
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
            </Container>
        </Box>
    );
};

export default MobileDrawer;
