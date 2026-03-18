import {Box, Stack, Typography} from "@mui/material";
import {
    DashboardOutlined, Dashboard,
    StorefrontOutlined, Storefront,
    ShoppingBagOutlined, ShoppingBag,
    BarChartOutlined, BarChart,
    MoreHoriz
} from "@mui/icons-material";
import {useLocation, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectUI} from "../../redux/features/ui/ui-slice";

const NavItem = ({label, path, ActiveIcon, InactiveIcon, active, onClick}) => (
    <Box
        onClick={onClick}
        sx={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            py: 1, cursor: "pointer", transition: "all 0.2s",
            position: "relative",
        }}
    >
        {active && (
            <Box sx={{
                position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                width: 20, height: 3, borderRadius: 1,
                backgroundColor: "secondary.main",
            }}/>
        )}
        {active
            ? <ActiveIcon sx={{fontSize: 22, color: "secondary.main", mb: 0.25}}/>
            : <InactiveIcon sx={{fontSize: 22, color: "text.secondary", mb: 0.25}}/>
        }
        <Typography variant="caption" sx={{
            fontSize: 9, fontWeight: active ? 700 : 500, letterSpacing: 0.3,
            color: active ? "secondary.main" : "text.secondary",
        }}>
            {label}
        </Typography>
    </Box>
);

const MobileBottomNavigation = () => {
    const {pathname} = useLocation();
    const navigate = useNavigate();
    const {theme} = useSelector(selectUI);

    const isActive = (path) => {
        if (path === "/") return pathname === "/" || pathname === "/overview";
        return pathname.startsWith(path);
    };

    return (
        <Box sx={{
            borderTopWidth: 1,
            borderTopStyle: "solid",
            borderTopColor: "divider",
            backgroundColor: theme === "dark" ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px)",
            pb: "env(safe-area-inset-bottom)",
        }}>
            <Stack direction="row">
                <NavItem label="Home" path="/" ActiveIcon={Dashboard} InactiveIcon={DashboardOutlined} active={isActive("/")} onClick={() => navigate("/")}/>
                <NavItem label="Products" path="/products" ActiveIcon={Storefront} InactiveIcon={StorefrontOutlined} active={isActive("/products")} onClick={() => navigate("/products")}/>
                <NavItem label="Orders" path="/orders" ActiveIcon={ShoppingBag} InactiveIcon={ShoppingBagOutlined} active={isActive("/orders")} onClick={() => navigate("/orders")}/>
                <NavItem label="Analytics" path="/analytics" ActiveIcon={BarChart} InactiveIcon={BarChartOutlined} active={isActive("/analytics")} onClick={() => navigate("/analytics")}/>
                <NavItem label="More" path="/more" ActiveIcon={MoreHoriz} InactiveIcon={MoreHoriz} active={isActive("/more")} onClick={() => navigate("/more")}/>
            </Stack>
        </Box>
    );
};

export default MobileBottomNavigation;
