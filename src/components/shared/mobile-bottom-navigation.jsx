import {BottomNavigation, BottomNavigationAction, Typography} from "@mui/material";
import {
    Checkroom,
    CheckroomOutlined,
    Dashboard,
    DashboardOutlined,
    MoreHoriz,
    ShoppingBag,
    ShoppingBagOutlined
} from "@mui/icons-material";
import {useLocation, useNavigate} from "react-router-dom";
import {useState} from "react";
import {useSelector} from "react-redux";
import {selectUI} from "../../redux/features/ui/ui-slice";

const MobileBottomNavigation = () => {

    const {pathname} = useLocation();
    const navigate = useNavigate();
    const [active, setActive] = useState("overview");
    const {theme} = useSelector(selectUI);
    const handleChange = (event, value) => {
        setActive(value);
        navigate(`/${value}`);
    }

    return (
        <BottomNavigation
            showLabels={false}
            value={active}
            onChange={handleChange}
            color="secondary"
            sx={{
                borderTopWidth: 1,
                borderTopStyle: "solid",
                borderTopColor: "divider",
                backgroundColor: theme === 'dark' ? "rgba(0, 0, 0, 0.05)": "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(36px)",
                paddingTop: 1,
                paddingBottom: 1
            }}>
            <BottomNavigationAction
                value="overview"
                icon={pathname === "/overview" || pathname === "/" ?
                    (
                        <Dashboard
                            sx={{
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderRadius: '30%',
                                borderColor: "light.secondary",
                                padding: 0.5,
                                fontSize: 32,
                                color: "secondary.main",
                                backgroundColor: "light.secondary",
                            }}
                            color="secondary"/>
                    ) :
                    (
                        <DashboardOutlined
                            sx={{
                                padding: 0.5,
                                fontSize: 32,
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderRadius: '30%',
                                borderColor: "light.icon",
                                color: "background.icon"
                            }}/>
                    )
                }
            />

            <BottomNavigationAction
                label={
                    <Typography
                        onClick={() => setActive("products")}
                        sx={{
                            color: active === "products" ? "secondary.main" : "text.secondary",
                            fontSize: 10,
                            mt: 0.5
                        }}
                        variant="body2">Products</Typography>
                }
                value="products"
                icon={pathname === "/products" ?
                    (
                        <Checkroom
                            sx={{
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderRadius: '30%',
                                borderColor: "light.secondary",
                                padding: 0.5,
                                fontSize: 32,
                                color: "secondary.main",
                                backgroundColor: "light.secondary",
                            }}
                            color="secondary"/>
                    ) :
                    (
                        <CheckroomOutlined
                            sx={{
                                padding: 0.5,
                                fontSize: 32,
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderRadius: '30%',
                                borderColor: "light.icon",
                                color: "background.icon"
                            }}/>
                    )
                }
            />

            <BottomNavigationAction
                label={
                    <Typography
                        onClick={() => setActive("orders")}
                        sx={{
                            color: active === "orders" ? "secondary.main" : "text.secondary",
                            fontSize: 10,
                            mt: 0.5
                        }}
                        variant="body2">Orders</Typography>
                }
                value="orders"
                icon={pathname === "/orders" ?
                    (
                        <ShoppingBag
                            sx={{
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderRadius: '30%',
                                borderColor: "light.secondary",
                                padding: 0.5,
                                fontSize: 32,
                                color: "secondary.main",
                                backgroundColor: "light.secondary",
                            }}
                            color="secondary"/>
                    ) :
                    (
                        <ShoppingBagOutlined
                            sx={{
                                padding: 0.5,
                                fontSize: 32,
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderRadius: '30%',
                                borderColor: "light.icon",
                                color: "background.icon"
                            }}/>
                    )
                }
            />

            <BottomNavigationAction
                label={
                    <Typography
                        onClick={() => setActive("more")}
                        sx={{color: active === "more" ? "secondary.main" : "text.secondary", fontSize: 10, mt: 0.5}}
                        variant="body2">More</Typography>
                }
                value="more"
                icon={pathname === "/more" ?
                    (
                        <MoreHoriz
                            sx={{
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderRadius: '30%',
                                borderColor: "light.secondary",
                                padding: 0.5,
                                fontSize: 32,
                                color: "secondary.main",
                                backgroundColor: "light.secondary",
                            }}
                            color="secondary"/>
                    ) :
                    (
                        <MoreHoriz
                            sx={{
                                padding: 0.5,
                                fontSize: 32,
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderRadius: '30%',
                                borderColor: "light.icon",
                                color: "background.icon"
                            }}/>
                    )
                }
            />
        </BottomNavigation>
    )
}

export default MobileBottomNavigation;