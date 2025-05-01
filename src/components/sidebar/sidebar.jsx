import {Box, CardMedia, Container, Divider, Stack, Typography} from "@mui/material";
import {useSelector} from "react-redux";
import {selectUI} from "../../redux/features/ui/ui-slice";
import logo from "./../../assets/images/logo/logo_image.png";
import {AnimatePresence, motion} from "framer-motion";
import SidebarLink from "../shared/sidebar-link.jsx";
import {useLocation} from "react-router-dom";
import {
    AdminPanelSettings,
    AdminPanelSettingsOutlined,
    Category,
    CategoryOutlined,
    Checkroom,
    CheckroomOutlined,
    Dashboard,
    DashboardOutlined,
    Discount,
    DiscountOutlined,
    Face,
    FaceOutlined,
    Help,
    HelpOutline,
    LogoutOutlined,
    Savings,
    SavingsOutlined,
    Settings,
    SettingsOutlined,
    Share,
    ShareOutlined,
    ShoppingBag,
    ShoppingBagOutlined,
    SignalCellularAlt,
    SignalCellularAltOutlined,
    SupportAgent,
    SupportAgentOutlined
} from "@mui/icons-material";

const container = {};
const item = {};

const Sidebar = () => {

    const {sidebarExpanded} = useSelector(selectUI);
    const {pathname} = useLocation();

    return (
        <Box>
            <Container sx={{py: {xs: 0, md: 2.05}}}>
                <Box
                    sx={{px: {xs: 0, lg: sidebarExpanded ? 8 : 0}}}
                    animate={{}}
                    initial={{}}
                    whileHover={{}}
                    component={motion.div}>
                    <AnimatePresence
                        initial={true}
                        presenceAffectsLayout={true}
                        mode="wait">
                        {sidebarExpanded && (
                            <Box component={motion.div} exit={{}}>
                                <Stack spacing={3} direction="row" alignItems="center">
                                    <CardMedia
                                        component="img"
                                        sx={{width: 30, height: 30, objectFit: "contain"}}
                                        alt="Logo"
                                        src={logo}
                                    />
                                    <Typography
                                        sx={{
                                            color: "secondary.main",
                                            fontSize: 20,
                                            fontWeight: 700
                                        }}
                                        variant="body1">
                                       Stay Up
                                    </Typography>
                                </Stack>
                            </Box>
                        )}
                    </AnimatePresence>
                    <AnimatePresence
                        initial={true}
                        presenceAffectsLayout={true}
                        mode="wait">
                        {!sidebarExpanded && (
                            <Stack
                                direction="row"
                                justifyContent="center"
                                component={motion.div}
                                exit={{}}>
                                <CardMedia
                                    component="img"
                                    sx={{width: 30, height: 30, objectFit: "contain"}}
                                    alt="Logo"
                                    src={logo}/>
                            </Stack>
                        )}
                    </AnimatePresence>
                </Box>
            </Container>
            <Divider variant="fullWidth" />
            <Container sx={{py: 6}}>
                <Stack
                    component={motion.div}
                    variants={container}
                    sx={{px: {xs: 0, lg: sidebarExpanded ? 8 : 0}}}
                    direction="column"
                    spacing={4}>
                    <Box
                        component={motion.div}
                        variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Dashboard"
                            path="/"
                            icon={
                                pathname === "/" ?
                                    (
                                        <Dashboard
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "border.secondary",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "secondary.main",
                                                backgroundColor: "light.default",
                                            }}
                                            color="secondary"/>
                                    ) :
                                    (
                                        <DashboardOutlined
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "border.default",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "icon.default",
                                                backgroundColor: "light.default"
                                            }}
                                        />
                                    )
                            }
                        />
                    </Box>
                    <Box
                        component={motion.div}
                        variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Products"
                            path="/products"
                            icon={
                                pathname === "/products" ?
                                    (
                                        <Checkroom
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "border.secondary",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "secondary.main",
                                                backgroundColor: "light.secondary",
                                            }}
                                            color="secondary"/>
                                    ) :
                                    (
                                        <CheckroomOutlined
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "border.default",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "icon.default",
                                                backgroundColor: "light.default"
                                            }}
                                        />
                                    )
                            }
                        />
                    </Box>
                    <Box
                        component={motion.div}
                        variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Analytics"
                            path="/analytics"
                            icon={
                                pathname === "/analytics" ?
                                    (
                                        <SignalCellularAlt
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "border.secondary",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "secondary.main",
                                                backgroundColor: "light.secondary",
                                            }}
                                            color="secondary"
                                        />
                                    ) :
                                    (
                                        <SignalCellularAltOutlined
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "border.default",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "icon.default",
                                                backgroundColor: "light.default",
                                            }}
                                        />
                                    )
                            }
                        />
                    </Box>

                    <Box
                        component={motion.div}
                        variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Orders"
                            path="/orders"
                            icon={
                                pathname === "/orders" ?
                                    (
                                        <ShoppingBag
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "border.secondary",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "secondary.main",
                                                backgroundColor: "light.secondary",
                                            }}
                                            color="secondary"
                                        />
                                    ) :
                                    (
                                        <ShoppingBagOutlined
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "border.default",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "icon.default",
                                                backgroundColor: "light.default"
                                            }}
                                        />
                                    )
                            }
                        />
                    </Box>
                    <Box
                        component={motion.div}
                        variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Categories"
                            path="/categories"
                            icon={
                                pathname === "/categories" ?
                                    (
                                        <Category
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "border.secondary",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "secondary.main",
                                                backgroundColor: "light.secondary",
                                            }}
                                            color="secondary"
                                        />
                                    ) :
                                    (
                                        <CategoryOutlined
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "border.default",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "icon.default",
                                                backgroundColor: "light.default"
                                            }}
                                        />
                                    )
                            }
                        />
                    </Box>
                    <Box
                        component={motion.div}
                        variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Customers"
                            path="/customers"
                            icon={
                                pathname === "/customers" ?
                                    (
                                        <Face
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "border.secondary",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "secondary.main",
                                                backgroundColor: "light.secondary",
                                            }}
                                            color="secondary"
                                        />
                                    ) :
                                    (
                                        <FaceOutlined
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "border.default",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "icon.default",
                                                backgroundColor: "light.default"
                                            }}
                                        />
                                    )
                            }
                        />
                    </Box>
                    <Box
                        component={motion.div}
                        variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Coupons"
                            path="/coupons"
                            icon={
                                pathname === "/coupons" ?
                                    (
                                        <Discount
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "border.secondary",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "secondary.main",
                                                backgroundColor: "light.secondary",
                                            }}
                                            color="secondary"/>
                                    ) :
                                    (
                                        <DiscountOutlined
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "border.default",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "icon.default",
                                                backgroundColor: "light.default"
                                            }}
                                        />)
                            }
                        />
                    </Box>
                    <Box
                        component={motion.div}
                        variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Stock"
                            path="/stock"
                            icon={
                                pathname === "/stock" ?
                                    (
                                        <Savings
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "border.secondary",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "secondary.main",
                                                backgroundColor: "light.secondary",
                                            }}
                                            color="secondary"/>
                                    ) :
                                    (
                                        <SavingsOutlined
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "border.default",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "icon.default",
                                                backgroundColor: "light.default"
                                            }}
                                        />)
                            }
                        />
                    </Box>
                </Stack>
            </Container>
            <Divider variant="fullWidth" light={true}/>
            <Container sx={{py: 6}}>
                <Stack
                    component={motion.div}
                    variants={container}
                    sx={{px: {xs: 0, lg: sidebarExpanded ? 8 : 0}}}
                    direction="column"
                    spacing={4}>
                    <Box
                        component={motion.div}
                        variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Settings"
                            path="/settings"
                            icon={
                                pathname === "/settings" ?
                                    (
                                        <Settings
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "border.secondary",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "secondary.main",
                                                backgroundColor: "light.secondary",
                                            }}
                                            color="secondary"/>
                                    ) :
                                    (
                                        <SettingsOutlined
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "border.default",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "icon.default",
                                                backgroundColor: "light.default"
                                            }}/>
                                    )
                            }
                        />
                    </Box>
                    <Box
                        component={motion.div}
                        variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Users"
                            path="/users"
                            icon={
                                pathname === "/users" ?
                                    (
                                        <AdminPanelSettings
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "border.secondary",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "secondary.main",
                                                backgroundColor: "light.secondary",
                                            }}
                                            color="secondary"/>
                                    ) :
                                    (
                                        <AdminPanelSettingsOutlined
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "border.default",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "icon.default",
                                                backgroundColor: "light.default"
                                            }}/>
                                    )
                            }
                        />
                    </Box>
                    <Box
                        component={motion.div}
                        variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Invitations"
                            path="/invitations"
                            icon={
                                pathname === "/invitations" ?
                                    (
                                        <Share
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "border.secondary",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "secondary.main",
                                                backgroundColor: "light.secondary",
                                            }}
                                            color="secondary"/>
                                    ) :
                                    (
                                        <ShareOutlined
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "border.default",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "icon.default",
                                                backgroundColor: "light.default"
                                            }}/>
                                    )
                            }
                        />
                    </Box>
                    <Box
                        component={motion.div}
                        variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Support"
                            path="/support"
                            icon={
                                pathname === "/support" ?
                                    (
                                        <SupportAgent
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "border.secondary",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "secondary.main",
                                                backgroundColor: "light.secondary",
                                            }}
                                            color="secondary"/>
                                    ) :
                                    (
                                        <SupportAgentOutlined
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "border.default",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "icon.default",
                                                backgroundColor: "light.default"
                                            }}
                                        />
                                    )
                            }
                        />
                    </Box>
                    <Box
                        component={motion.div}
                        variants={item}>
                        <SidebarLink
                            hasBadge={false}
                            label="Help"
                            path="/help"
                            icon={
                                pathname === "/help" ?
                                    (
                                        <Help
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "border.secondary",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "secondary.main",
                                                backgroundColor: "light.secondary",
                                            }}
                                            color="secondary"
                                        />
                                    ) :
                                    (
                                        <HelpOutline
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "border.default",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "icon.default",
                                                backgroundColor: "light.default"
                                            }}
                                        />
                                    )
                            }
                        />
                    </Box>
                </Stack>
            </Container>
            <Divider variant="fullWidth" light={true}/>
            <Container sx={{py: 6}}>
                <Stack
                    component={motion.div}
                    variants={container}
                    sx={{px: {xs: 0, lg: sidebarExpanded ? 8 : 0}}}
                    direction="column"
                    spacing={4}>
                    <Box
                        animate={{}}
                        initial={{}}
                        whileHover={{}}
                        component={motion.div}>
                        <AnimatePresence
                            initial={true}
                            presenceAffectsLayout={true}
                            mode="wait">
                            {sidebarExpanded && (
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <LogoutOutlined
                                        sx={{
                                            color: "text.red",
                                            backgroundColor: "light.red",
                                            borderWidth: 1,
                                            borderStyle: "solid",
                                            borderRadius: '100%',
                                            borderColor: "light.red",
                                            padding: 1,
                                            fontSize: 36,
                                    }}/>
                                    <Typography
                                        sx={{
                                            color: "text.red",
                                            fontSize: 12, textTransform: "uppercase", fontWeight: 500
                                        }}
                                        size="body2">Logout</Typography>
                                </Stack>
                            )}
                        </AnimatePresence>
                        <AnimatePresence
                            initial={true}
                            presenceAffectsLayout={true}
                            mode="wait">
                            {!sidebarExpanded && (
                                <Stack
                                    direction="row"
                                    justifyContent="center"
                                    component={motion.div}
                                    exit={{}}>
                                    <LogoutOutlined
                                        sx={{
                                            color: "text.red",
                                            backgroundColor: "light.red",
                                            borderWidth: 1,
                                            borderStyle: "solid",
                                            borderRadius: '100%',
                                            borderColor: "light.red",
                                            padding: 1,
                                            fontSize: 36,
                                    }}/>
                                </Stack>
                            )}
                        </AnimatePresence>
                    </Box>
                </Stack>
            </Container>

        </Box>
    )
}

export default Sidebar;