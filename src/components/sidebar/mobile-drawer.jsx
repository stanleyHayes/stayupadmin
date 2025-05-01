import {Box, CardMedia, Container, Divider, Stack, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {selectUI, UI_ACTION_CREATORS} from "../../redux/features/ui/ui-slice";
import logo from "./../../assets/images/logo/logo_text.png";
import {motion} from "framer-motion";
import DrawerLink from "../shared/drawer-link.jsx";
import {useLocation} from "react-router-dom";
import {
    AdminPanelSettings,
    AdminPanelSettingsOutlined,
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
    LogoutOutlined,
    Percent,
    PercentOutlined,
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

const MobileDrawer = () => {

    const {sidebarExpanded} = useSelector(selectUI);
    const {pathname} = useLocation();
    const dispatch = useDispatch();

    return (
        <Box sx={{width: "90vw"}}>
            <Container sx={{px: 6, py: 4}}>
                <Box
                    sx={{px: {xs: 0, lg: sidebarExpanded ? 8 : 0}}}
                    animate={{}}
                    initial={{}}
                    whileHover={{}}
                    component={motion.div}>
                    <Stack sx={{width: "100%"}} justifyContent="space-between" direction="row" component={motion.div}>
                        <Stack spacing={3} direction="row" alignItems="center">
                            <CardMedia
                                component="img"
                                sx={{width: 30, height: 30, objectFit: "contain"}}
                                alt="Logo"
                                src={logo}
                            />
                        </Stack>
                        <Close
                            sx={{
                                padding: 1,
                                fontSize: 36,
                                borderWidth: 2,
                                borderStyle: "solid",
                                borderRadius: '100%',
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
            <Container sx={{py: 6, px: 6}}>
                <Stack
                    component={motion.div}
                    variants={container}
                    sx={{px: {xs: 0, lg: sidebarExpanded ? 8 : 0}}}
                    direction="column"
                    spacing={4}>
                    <Box
                        component={motion.div}
                        variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Dashboard"
                            path="/"
                            icon={
                                pathname === "/" || pathname === "/overview" ?
                                    (
                                        <Dashboard
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "light.secondary",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "secondary.main",
                                                backgroundColor: "light.secondary",
                                            }}
                                            color="secondary"/>
                                    ) :
                                    (
                                        <DashboardOutlined
                                            sx={{
                                                padding: 1,
                                                fontSize: 36,
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "light.default",
                                                color: "icon.default"
                                            }}
                                        />
                                    )
                            }
                        />
                    </Box>
                    <Box
                        component={motion.div}
                        variants={item}>
                        <DrawerLink
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
                                                borderColor: "light.secondary",
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
                                                padding: 1,
                                                fontSize: 36,
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "light.default",
                                                color: "icon.default"
                                            }}
                                        />
                                    )
                            }
                        />
                    </Box>
                    <Box
                        component={motion.div}
                        variants={item}>
                        <DrawerLink
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
                                                borderColor: "light.secondary",
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
                                                padding: 1,
                                                fontSize: 36,
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "light.default",
                                                color: "icon.default"
                                            }}
                                        />
                                    )
                            }
                        />
                    </Box>

                    <Box
                        component={motion.div}
                        variants={item}>
                        <DrawerLink
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
                                                borderColor: "light.secondary",
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
                                                padding: 1,
                                                fontSize: 36,
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "light.default",
                                                color: "icon.default"
                                            }}
                                        />
                                    )
                            }
                        />
                    </Box>

                    <Box
                        component={motion.div}
                        variants={item}>
                        <DrawerLink
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
                                                borderColor: "light.secondary",
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
                                                padding: 1,
                                                fontSize: 36,
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "light.default",
                                                color: "icon.default"
                                            }}
                                        />
                                    )
                            }
                        />
                    </Box>

                    <Box
                        component={motion.div}
                        variants={item}>
                        <DrawerLink
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
                                                borderColor: "light.secondary",
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
                                                padding: 1,
                                                fontSize: 36,
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "light.default",
                                                color: "icon.default"
                                            }}
                                        />
                                    )
                            }
                        />
                    </Box>
                    <Box
                        component={motion.div}
                        variants={item}>
                        <DrawerLink
                            hasBadge={false}
                            label="Coupons"
                            path="/categories"
                            icon={
                                pathname === "/categories" ?
                                    (
                                        <Percent
                                            sx={{
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "light.secondary",
                                                padding: 1,
                                                fontSize: 36,
                                                color: "secondary.main",
                                                backgroundColor: "light.secondary",
                                            }}
                                            color="secondary"/>
                                    ) :
                                    (
                                        <PercentOutlined
                                            sx={{
                                                padding: 1,
                                                fontSize: 36,
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "light.default",
                                                color: "icon.default"
                                            }}
                                        />
                                    )
                            }
                        />
                    </Box>

                    <Box
                        component={motion.div}
                        variants={item}>
                        <DrawerLink
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
                                                borderColor: "light.secondary",
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
                                                padding: 1,
                                                fontSize: 36,
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "light.default",
                                                color: "icon.default"
                                            }}
                                        />
                                    )
                            }
                        />
                    </Box>

                </Stack>
            </Container>
            <Divider variant="fullWidth" />
            <Container sx={{py: 6, px: 6}}>
                <Stack
                    component={motion.div}
                    variants={container}
                    sx={{px: {xs: 0, lg: sidebarExpanded ? 8 : 0}}}
                    direction="column"
                    spacing={4}>
                    <Box
                        component={motion.div}
                        variants={item}>
                        <DrawerLink
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
                                                borderColor: "light.secondary",
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
                                                padding: 1,
                                                fontSize: 36,
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "light.default",
                                                color: "icon.default"
                                            }}
                                        />
                                    )
                            }
                        />
                    </Box>
                    <Box
                        component={motion.div}
                        variants={item}>
                        <DrawerLink
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
                                                borderColor: "light.secondary",
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
                                                padding: 1,
                                                fontSize: 36,
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "light.default",
                                                color: "icon.default"
                                            }}
                                        />
                                    )
                            }
                        />
                    </Box>
                    <Box
                        component={motion.div}
                        variants={item}>
                        <DrawerLink
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
                                                borderColor: "light.secondary",
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
                                                padding: 1,
                                                fontSize: 36,
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "light.default",
                                                color: "icon.default"
                                            }}
                                        />
                                    )
                            }
                        />
                    </Box>
                    <Box
                        component={motion.div}
                        variants={item}>
                        <DrawerLink
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
                                                borderColor: "light.secondary",
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
                                                padding: 1,
                                                fontSize: 36,
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "light.default",
                                                color: "icon.default"
                                            }}
                                        />
                                    )
                            }
                        />
                    </Box>
                    <Box
                        component={motion.div}
                        variants={item}>
                        <DrawerLink
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
                                                borderColor: "light.secondary",
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
                                                padding: 1,
                                                fontSize: 36,
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: '100%',
                                                borderColor: "light.default",
                                                color: "icon.default"
                                            }}
                                        />
                                    )
                            }
                        />
                    </Box>
                </Stack>
            </Container>
            <Divider variant="fullWidth" />
            <Container sx={{py: 6, px: 6}}>
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
            </Container>
        </Box>
    )
}

export default MobileDrawer;