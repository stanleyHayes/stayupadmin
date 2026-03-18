import {Avatar, Box, CardMedia, Chip, Divider, Stack, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {selectUI, UI_ACTION_CREATORS} from "../../redux/features/ui/ui-slice";
import {selectAuth, logout} from "../../redux/features/authentication/authentication-slice";
import logo from "./../../assets/images/logo/logo_image.png";
import DrawerLink from "../shared/drawer-link.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import {
    CloseRounded, DashboardOutlined, BarChartOutlined, AccountBalanceWalletOutlined,
    ReceiptLongOutlined, AutoStoriesOutlined, MonetizationOnOutlined,
    StorefrontOutlined, CategoryOutlined, AccountTreeOutlined, TagOutlined,
    LocalOfferOutlined, SupportAgentOutlined,
    ArticleOutlined, FormatQuoteOutlined,
    SubscriptionsOutlined, MailOutline,
    PeopleOutline, ReceiptOutlined, LocalShippingOutlined,
    AdminPanelSettingsOutlined, LinkOutlined, SettingsOutlined,
    LogoutOutlined
} from "@mui/icons-material";

const MobileDrawer = () => {
    const {pathname} = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user} = useSelector(selectAuth);

    const handleClose = () => dispatch(UI_ACTION_CREATORS.toggleDrawer(false));

    const isActive = (basePath) => {
        if (!basePath) return false;
        if (basePath === "/") return pathname === "/";
        return pathname.startsWith(basePath);
    };

    const activeStyle = {
        borderRadius: 1, padding: 0.75, fontSize: 32,
        color: "secondary.main", backgroundColor: "light.secondary"
    };

    const defaultStyle = {
        borderRadius: 1, padding: 0.75, fontSize: 32,
        color: "text.secondary", backgroundColor: "transparent"
    };

    const SectionLabel = ({label}) => (
        <Typography variant="overline" sx={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
            color: "text.disabled", pt: 1.5, pb: 0.25, display: "block"
        }}>
            {label}
        </Typography>
    );

    const L = ({label, path, Icon}) => (
        <DrawerLink hasBadge={false} label={label} path={path}
            icon={<Icon sx={isActive(path) ? activeStyle : defaultStyle}/>}/>
    );

    const initials = user?.first_name && user?.last_name
        ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() : "A";

    return (
        <Box sx={{width: "85vw", maxWidth: 340, display: "flex", flexDirection: "column", height: "100%", backgroundColor: "background.paper"}}>
            {/* Header */}
            <Box sx={{px: 2.5, py: 2}}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{
                        p: 1, borderRadius: 1,
                        background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                        flex: 1, mr: 1.5,
                    }}>
                        <Box sx={{
                            width: 32, height: 32, borderRadius: 1,
                            backgroundColor: "rgba(255,255,255,0.2)",
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>
                            <CardMedia component="img" sx={{width: 18, height: 18, objectFit: "contain"}} alt="Logo" src={logo}/>
                        </Box>
                        <Box>
                            <Typography sx={{color: "#fff", fontSize: 15, fontWeight: 800, letterSpacing: -0.3, lineHeight: 1.2}}>StayUp</Typography>
                            <Typography sx={{color: "rgba(255,255,255,0.6)", fontSize: 9, fontWeight: 500}}>Admin Panel</Typography>
                        </Box>
                    </Stack>
                    <Box
                        onClick={handleClose}
                        sx={{
                            width: 36, height: 36, borderRadius: 1,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            backgroundColor: "light.secondary", cursor: "pointer",
                            transition: "all 0.2s", flexShrink: 0,
                            "&:hover": {backgroundColor: "error.main", "& svg": {color: "#fff"}},
                        }}
                    >
                        <CloseRounded sx={{fontSize: 18, color: "secondary.main", transition: "color 0.2s"}}/>
                    </Box>
                </Stack>
            </Box>

            {/* User Card */}
            <Box sx={{px: 2.5, pb: 2}}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{
                    p: 1.5, borderRadius: 1,
                    background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                }}>
                    <Avatar src={user?.avatar_url || user?.image} sx={{width: 40, height: 40, fontSize: 14, fontWeight: 700, bgcolor: "rgba(255,255,255,0.2)", color: "#fff"}}>
                        {initials}
                    </Avatar>
                    <Box sx={{flex: 1, minWidth: 0}}>
                        <Typography variant="body2" sx={{fontWeight: 600, fontSize: 13, color: "#fff"}} noWrap>
                            {user?.first_name || user?.display_name || user?.email}{user?.last_name ? ` ${user.last_name}` : ""}
                        </Typography>
                        <Typography variant="caption" sx={{color: "rgba(255,255,255,0.7)", fontSize: 11}} noWrap>
                            {user?.email}
                        </Typography>
                    </Box>
                    <Chip label={user?.role?.replace("_", " ") || "Admin"} size="small" sx={{
                        height: 20, fontSize: 9, fontWeight: 700, textTransform: "capitalize",
                        backgroundColor: "rgba(255,255,255,0.2)", color: "#fff"
                    }}/>
                </Stack>
            </Box>

            <Divider/>

            {/* Navigation */}
            <Box sx={{flex: 1, overflowY: "auto", px: 2, py: 1.5}}>
                <Stack direction="column" spacing={0.5}>
                    <SectionLabel label="Overview"/>
                    <L label="Dashboard" path="/" Icon={DashboardOutlined}/>
                    <L label="Analytics" path="/analytics" Icon={BarChartOutlined}/>
                    <L label="Revenue" path="/revenue" Icon={AccountBalanceWalletOutlined}/>

                    <SectionLabel label="Orders"/>
                    <L label="Orders" path="/orders" Icon={ReceiptLongOutlined}/>
                    <L label="Order Notes" path="/order-notes" Icon={AutoStoriesOutlined}/>
                    <L label="Refunds" path="/order-refunds" Icon={MonetizationOnOutlined}/>

                    <SectionLabel label="Catalog"/>
                    <L label="Products" path="/products" Icon={StorefrontOutlined}/>
                    <L label="Categories" path="/categories" Icon={CategoryOutlined}/>
                    <L label="Attributes" path="/attributes" Icon={AccountTreeOutlined}/>
                    <L label="Tags" path="/tags" Icon={TagOutlined}/>

                    <SectionLabel label="Marketing"/>
                    <L label="Coupons" path="/coupons" Icon={LocalOfferOutlined}/>
                    <L label="Reviews" path="/reviews" Icon={SupportAgentOutlined}/>

                    <SectionLabel label="Content"/>
                    <L label="Blog Posts" path="/blog" Icon={ArticleOutlined}/>
                    <L label="Testimonials" path="/testimonials" Icon={FormatQuoteOutlined}/>

                    <SectionLabel label="Engagement"/>
                    <L label="Subscribers" path="/subscribers" Icon={SubscriptionsOutlined}/>
                    <L label="Messages" path="/messages" Icon={MailOutline}/>

                    <SectionLabel label="People"/>
                    <L label="Customers" path="/customers" Icon={PeopleOutline}/>
                    <L label="Invitations" path="/invitations" Icon={MonetizationOnOutlined}/>

                    <SectionLabel label="Finance"/>
                    <L label="Payment Gateways" path="/payment-gateways" Icon={MonetizationOnOutlined}/>
                    <L label="Tax Rates" path="/tax-rates" Icon={ReceiptOutlined}/>
                    <L label="Tax Classes" path="/tax-classes" Icon={ReceiptOutlined}/>

                    <SectionLabel label="Shipping"/>
                    <L label="Shipping Classes" path="/shipping-classes" Icon={LocalShippingOutlined}/>
                    <L label="Shipping Methods" path="/shipping-methods" Icon={LocalShippingOutlined}/>

                    <SectionLabel label="System"/>
                    <L label="Admins" path="/admins" Icon={AdminPanelSettingsOutlined}/>
                    <L label="Settings" path="/settings" Icon={SettingsOutlined}/>
                </Stack>
            </Box>

            <Divider/>

            {/* Logout */}
            <Box sx={{px: 2.5, py: 2}}>
                <Stack
                    direction="row" spacing={1.5} alignItems="center"
                    onClick={() => { handleClose(); dispatch(logout()); navigate("/auth/login"); }}
                    sx={{
                        cursor: "pointer", p: 1.5, borderRadius: 1,
                        transition: "all 0.2s",
                        "&:hover": {backgroundColor: "light.red"},
                    }}
                >
                    <LogoutOutlined sx={{fontSize: 18, color: "text.red"}}/>
                    <Typography sx={{color: "text.red", fontSize: 13, fontWeight: 500}}>Sign Out</Typography>
                </Stack>
            </Box>
        </Box>
    );
};

export default MobileDrawer;
