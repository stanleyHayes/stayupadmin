import {Avatar, Box, CardMedia, Container, Divider, Stack, Tooltip, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {selectUI} from "../../redux/features/ui/ui-slice";
import {selectAuth, logout} from "../../redux/features/authentication/authentication-slice";
import {selectOrder} from "../../redux/features/orders/orders-slice";
import {selectMessages} from "../../redux/features/messages/messages-slice";
import {selectSubscribers} from "../../redux/features/subscribers/subscribers-slice";
import {selectReviews} from "../../redux/features/reviews/reviews-slice";
import {selectCustomer} from "../../redux/features/customers/customers-slice";
import logo from "./../../assets/images/logo/logo_image.png";
import {AnimatePresence, motion} from "framer-motion";
import SidebarLink from "../shared/sidebar-link.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import {
    DashboardOutlined, BarChartOutlined, AccountBalanceWalletOutlined,
    ReceiptLongOutlined, AutoStoriesOutlined, MonetizationOnOutlined,
    StorefrontOutlined, CategoryOutlined, AccountTreeOutlined, TagOutlined,
    LocalOfferOutlined, SupportAgentOutlined, CollectionsOutlined,
    ArticleOutlined, FormatQuoteOutlined,
    SubscriptionsOutlined, MailOutline,
    PeopleOutline, MonetizationOn,
    ReceiptOutlined, LocalShippingOutlined,
    AdminPanelSettingsOutlined, ShieldOutlined, LinkOutlined, SettingsOutlined,
    LogoutOutlined
} from "@mui/icons-material";

const Sidebar = () => {
    const dispatch = useDispatch();
    const {sidebarExpanded} = useSelector(selectUI);
    const {user} = useSelector(selectAuth);
    const {orders} = useSelector(selectOrder);
    const {messages} = useSelector(selectMessages);
    const {subscribers} = useSelector(selectSubscribers);
    const {reviews} = useSelector(selectReviews);
    const {customers} = useSelector(selectCustomer);
    const {pathname} = useLocation();
    const navigate = useNavigate();

    const pendingOrders = (orders || []).filter(o => o.status === "pending" || o.status === "processing").length;
    const unreadMessages = (messages || []).filter(m => m.status === "unread").length;
    const newSubscribers = (subscribers || []).filter(s => {
        const d = new Date(s.date_created || s.created_at);
        return d && !isNaN(d) && (Date.now() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
    }).length;
    const pendingReviews = (reviews || []).filter(r => r.status === "pending" || r.status === "hold").length;
    const newCustomers = (customers || []).filter(c => {
        const d = new Date(c.date_created || c.created_at);
        return d && !isNaN(d) && (Date.now() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
    }).length;

    const icon = (Icon) => {
        const active = false; // handled by SidebarLink
        return <Icon sx={{fontSize: 20, color: "inherit"}}/>;
    };

    const isActive = (basePath) => {
        if (!basePath) return false;
        if (basePath === "/") return pathname === "/";
        return pathname.startsWith(basePath);
    };

    const activeStyle = {
        borderWidth: 1, borderStyle: "solid", borderRadius: 1,
        borderColor: "border.secondary", padding: 0.75, fontSize: 32,
        color: "secondary.main", backgroundColor: "light.secondary"
    };

    const defaultStyle = {
        borderWidth: 1, borderStyle: "solid", borderRadius: 1,
        borderColor: "transparent", padding: 0.75, fontSize: 32,
        color: "text.secondary", backgroundColor: "transparent"
    };

    const SectionLabel = ({label}) => {
        if (!sidebarExpanded) return <Divider sx={{my: 0.5, opacity: 0.5}}/>;
        return (
            <Typography variant="overline" sx={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                color: "text.disabled", px: 0.5, pt: 1.5, pb: 0.25,
                display: "block"
            }}>
                {label}
            </Typography>
        );
    };

    const L = ({label, path, Icon, badge = 0}) => (
        <SidebarLink hasBadge={badge > 0} count={badge} label={label} path={path}
            icon={<Icon sx={isActive(path) ? activeStyle : defaultStyle}/>}/>
    );

    const initials = user?.first_name && user?.last_name
        ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() : "A";

    return (
        <Box sx={{display: "flex", flexDirection: "column", height: "100%"}}>
            {/* Logo Header */}
            <Box sx={{px: sidebarExpanded ? 2 : 1, py: 2}}>
                <AnimatePresence mode="wait">
                    {sidebarExpanded ? (
                        <motion.div key="expanded" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.15}}>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{
                                p: 1.5, borderRadius: 1,
                                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                            }}>
                                <Box sx={{
                                    width: 36, height: 36, borderRadius: 1,
                                    backgroundColor: "rgba(255,255,255,0.2)",
                                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                }}>
                                    <CardMedia component="img" sx={{width: 22, height: 22, objectFit: "contain"}} alt="Logo" src={logo}/>
                                </Box>
                                <Box>
                                    <Typography sx={{color: "#fff", fontSize: 16, fontWeight: 800, letterSpacing: -0.3, lineHeight: 1.2}}>
                                        StayUp
                                    </Typography>
                                    <Typography sx={{color: "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: 500}}>
                                        Admin Panel
                                    </Typography>
                                </Box>
                            </Stack>
                        </motion.div>
                    ) : (
                        <motion.div key="collapsed" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.15}}>
                            <Tooltip title="StayUp Admin" placement="right">
                                <Stack direction="row" justifyContent="center">
                                    <Box sx={{
                                        width: 40, height: 40, borderRadius: 1,
                                        background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        <CardMedia component="img" sx={{width: 22, height: 22, objectFit: "contain"}} alt="Logo" src={logo}/>
                                    </Box>
                                </Stack>
                            </Tooltip>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Box>

            {/* Navigation */}
            <Box sx={{flex: 1, overflowY: "auto", overflowX: "hidden", px: sidebarExpanded ? 2 : 1, py: 1.5}}>
                <Stack direction="column" spacing={0.5}>
                    <SectionLabel label="Overview"/>
                    <L label="Dashboard" path="/" Icon={DashboardOutlined}/>
                    <L label="Analytics" path="/analytics" Icon={BarChartOutlined}/>
                    <L label="Revenue" path="/revenue" Icon={AccountBalanceWalletOutlined}/>

                    <SectionLabel label="Orders"/>
                    <L label="Orders" path="/orders" Icon={ReceiptLongOutlined} badge={pendingOrders}/>
                    <L label="Order Notes" path="/order-notes" Icon={AutoStoriesOutlined}/>
                    <L label="Refunds" path="/order-refunds" Icon={MonetizationOnOutlined}/>

                    <SectionLabel label="Catalog"/>
                    <L label="Products" path="/products" Icon={StorefrontOutlined}/>
                    <L label="Categories" path="/categories" Icon={CategoryOutlined}/>
                    <L label="Attributes" path="/attributes" Icon={AccountTreeOutlined}/>
                    <L label="Tags" path="/tags" Icon={TagOutlined}/>
                    <L label="Collections" path="/collections" Icon={CollectionsOutlined}/>

                    <SectionLabel label="Marketing"/>
                    <L label="Coupons" path="/coupons" Icon={LocalOfferOutlined}/>
                    <L label="Reviews" path="/reviews" Icon={SupportAgentOutlined} badge={pendingReviews}/>

                    <SectionLabel label="Content"/>
                    <L label="Blog Posts" path="/blog" Icon={ArticleOutlined}/>
                    <L label="Testimonials" path="/testimonials" Icon={FormatQuoteOutlined}/>

                    <SectionLabel label="Engagement"/>
                    <L label="Subscribers" path="/subscribers" Icon={SubscriptionsOutlined} badge={newSubscribers}/>
                    <L label="Messages" path="/messages" Icon={MailOutline} badge={unreadMessages}/>

                    <SectionLabel label="People"/>
                    <L label="Customers" path="/customers" Icon={PeopleOutline} badge={newCustomers}/>
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
                    <L label="Roles" path="/roles" Icon={ShieldOutlined}/>
                    <L label="Settings" path="/settings" Icon={SettingsOutlined}/>
                </Stack>
            </Box>

            <Divider/>

            {/* Footer — User + Logout */}
            <Box sx={{px: sidebarExpanded ? 2 : 1, py: 1.5}}>
                <AnimatePresence mode="wait">
                    {sidebarExpanded ? (
                        <motion.div key="user-exp" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{
                                p: 1, borderRadius: 1, mb: 1,
                                backgroundColor: "light.secondary",
                            }}>
                                <Avatar src={user?.avatar_url || user?.image} sx={{width: 32, height: 32, fontSize: 12, fontWeight: 700, bgcolor: "secondary.main", color: "#fff"}}>
                                    {initials}
                                </Avatar>
                                <Box sx={{flex: 1, minWidth: 0}}>
                                    <Typography variant="body2" sx={{fontWeight: 600, fontSize: 12, lineHeight: 1.3}} noWrap>{user?.first_name || user?.display_name || user?.email}{user?.last_name ? ` ${user.last_name}` : ""}</Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{fontSize: 10}} noWrap>{user?.role?.replace("_", " ") || "Admin"}</Typography>
                                </Box>
                            </Stack>
                        </motion.div>
                    ) : (
                        <motion.div key="user-col" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                            <Tooltip title={user?.first_name || user?.display_name || user?.email} placement="right">
                                <Stack direction="row" justifyContent="center" sx={{mb: 1}}>
                                    <Avatar src={user?.avatar_url || user?.image} sx={{width: 32, height: 32, fontSize: 12, fontWeight: 700, bgcolor: "secondary.main", color: "#fff"}}>
                                        {initials}
                                    </Avatar>
                                </Stack>
                            </Tooltip>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Tooltip title="Sign out" placement="right">
                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        justifyContent={sidebarExpanded ? "flex-start" : "center"}
                        onClick={() => { dispatch(logout()); navigate("/auth/login"); }}
                        sx={{
                            cursor: "pointer", p: 1, borderRadius: 1,
                            transition: "all 0.2s",
                            "&:hover": {backgroundColor: "light.red"},
                        }}
                    >
                        <LogoutOutlined sx={{fontSize: 18, color: "text.red"}}/>
                        {sidebarExpanded && (
                            <Typography sx={{color: "text.red", fontSize: 12, fontWeight: 500}}>Sign Out</Typography>
                        )}
                    </Stack>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default Sidebar;
