import {Avatar, Box, Chip, Divider, Menu, Stack, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {selectAuth, logout} from "../../redux/features/authentication/authentication-slice";
import {
    EditOutlined, LockOutlined, PersonOutlined, LogoutOutlined,
    KeyboardArrowDown, SettingsOutlined, HelpOutlineOutlined
} from "@mui/icons-material";
import React, {useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";

const MenuItem = ({icon, label, path, subtitle, active, onClick}) => (
    <Box
        onClick={onClick}
        sx={{
            borderRadius: 1, p: 1, cursor: "pointer",
            backgroundColor: active ? "light.secondary" : "transparent",
            transition: "all 0.15s ease",
            "&:hover": {backgroundColor: "light.secondary"}
        }}>
        <Link to={path} style={{textDecoration: "none", display: "block"}}>
            <Stack direction="row" spacing={1.5} alignItems="center">
                <Box sx={{
                    width: 34, height: 34, borderRadius: 1, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    backgroundColor: active ? "light.secondary" : "background.default",
                    color: active ? "secondary.main" : "text.secondary",
                    transition: "all 0.15s ease"
                }}>
                    {React.cloneElement(icon, {sx: {fontSize: 18}})}
                </Box>
                <Box sx={{flex: 1}}>
                    <Typography variant="body2" sx={{
                        fontWeight: active ? 600 : 500, fontSize: 13,
                        color: active ? "secondary.main" : "text.primary"
                    }}>
                        {label}
                    </Typography>
                    {subtitle && (
                        <Typography variant="caption" sx={{color: "text.secondary", fontSize: 11, lineHeight: 1.2}}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
            </Stack>
        </Link>
    </Box>
);

const ProfileDropdown = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user} = useSelector(selectAuth);
    const [menuOpen, setMenuOpen] = useState(false);
    const [anchorElement, setAnchorElement] = useState(null);
    const {pathname} = useLocation();

    const handleMenuClose = () => {
        setMenuOpen(false);
        setAnchorElement(null);
    };

    const handleMenuOpen = event => {
        setMenuOpen(true);
        setAnchorElement(event.currentTarget);
    };

    const displayName = user?.display_name || (user?.first_name ? `${user.first_name} ${user?.last_name || ""}`.trim() : null) || user?.email || "Admin";
    const initials = user?.first_name && user?.last_name
        ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
        : (displayName?.[0] || "A").toUpperCase();

    return (
        <React.Fragment>
            <Stack
                direction="row" alignItems="center" spacing={1.5}
                onClick={handleMenuOpen}
                sx={{
                    cursor: "pointer", borderRadius: 1, p: 0.75, pr: 1.5,
                    transition: "all 0.15s ease",
                    "&:hover": {backgroundColor: "light.secondary"}
                }}>
                <Avatar
                    src={user?.avatar_url || user?.image}
                    sx={{
                        width: 36, height: 36, fontSize: 14, fontWeight: 700,
                        bgcolor: "secondary.main", color: "#fff"
                    }}>
                    {initials}
                </Avatar>
                <Box sx={{display: {xs: "none", md: "block"}}}>
                    <Typography variant="body2" sx={{fontWeight: 600, fontSize: 13, lineHeight: 1.3, color: "text.primary"}}>
                        {displayName}
                    </Typography>
                    <Typography variant="caption" sx={{color: "text.secondary", fontSize: 11}}>
                        {user?.role || "Admin"}
                    </Typography>
                </Box>
                <KeyboardArrowDown sx={{
                    fontSize: 18, color: "text.secondary",
                    transition: "transform 0.2s",
                    transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)"
                }}/>
            </Stack>

            <Menu
                anchorEl={anchorElement}
                anchorOrigin={{horizontal: "right", vertical: "bottom"}}
                transformOrigin={{horizontal: "right", vertical: "top"}}
                onClose={handleMenuClose}
                open={menuOpen}
                slotProps={{
                    paper: {
                        sx: {
                            mt: 1, borderRadius: 1, minWidth: 260, p: 1,
                            boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                            border: "1px solid", borderColor: "divider"
                        }
                    }
                }}>

                {/* Profile Header */}
                <Link to="/profile" onClick={handleMenuClose} style={{textDecoration: "none", display: "block"}}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{
                        p: 1.5, borderRadius: 1, mb: 0.5,
                        transition: "all 0.15s", "&:hover": {backgroundColor: "light.secondary"}
                    }}>
                        <Avatar
                            src={user?.avatar_url || user?.image}
                            sx={{
                                width: 44, height: 44, fontSize: 16, fontWeight: 700,
                                bgcolor: "secondary.main", color: "#fff"
                            }}>
                            {initials}
                        </Avatar>
                        <Box sx={{flex: 1}}>
                            <Stack direction="row" spacing={0.75} alignItems="center">
                                <Typography variant="body2" sx={{fontWeight: 600, color: "text.primary"}}>
                                    {displayName}
                                </Typography>
                                <Chip label={user?.role || "Admin"} size="small" color="secondary" sx={{height: 18, fontSize: 9, fontWeight: 700}}/>
                            </Stack>
                            <Typography variant="caption" sx={{color: "text.secondary", fontSize: 11}}>
                                {user?.email || `@${user?.username}`}
                            </Typography>
                        </Box>
                    </Stack>
                </Link>

                <Divider sx={{my: 0.75}}/>

                {/* Account Links */}
                <Stack spacing={0.5} sx={{py: 0.5}}>
                    <MenuItem
                        icon={<PersonOutlined/>}
                        label="View Profile"
                        subtitle="View your account details"
                        path="/profile"
                        active={pathname === "/profile"}
                        onClick={handleMenuClose}
                    />
                    <MenuItem
                        icon={<EditOutlined/>}
                        label="Edit Profile"
                        subtitle="Update your personal info"
                        path="/profile/update"
                        active={pathname === "/profile/update"}
                        onClick={handleMenuClose}
                    />
                    <MenuItem
                        icon={<LockOutlined/>}
                        label="Change Password"
                        subtitle="Update your security credentials"
                        path="/change-password"
                        active={pathname === "/change-password"}
                        onClick={handleMenuClose}
                    />
                </Stack>

                <Divider sx={{my: 0.75}}/>

                {/* Info Links */}
                <Stack spacing={0.5} sx={{py: 0.5}}>
                    <MenuItem
                        icon={<SettingsOutlined/>}
                        label="Settings"
                        subtitle="App preferences"
                        path="/settings"
                        active={pathname === "/settings"}
                        onClick={handleMenuClose}
                    />
                    <MenuItem
                        icon={<HelpOutlineOutlined/>}
                        label="Help & Support"
                        subtitle="FAQ, contact, and more"
                        path="/help"
                        active={pathname === "/help"}
                        onClick={handleMenuClose}
                    />
                </Stack>

                <Divider sx={{my: 0.75}}/>

                {/* Logout */}
                <Box
                    onClick={() => { handleMenuClose(); dispatch(logout()); navigate("/auth/login"); }}
                    sx={{
                        borderRadius: 1, p: 1, cursor: "pointer",
                        transition: "all 0.15s ease",
                        "&:hover": {backgroundColor: "light.red"}
                    }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box sx={{
                            width: 34, height: 34, borderRadius: 1, display: "flex",
                            alignItems: "center", justifyContent: "center",
                            backgroundColor: "light.red", color: "text.red"
                        }}>
                            <LogoutOutlined sx={{fontSize: 18}}/>
                        </Box>
                        <Typography variant="body2" sx={{fontWeight: 500, fontSize: 13, color: "text.red"}}>
                            Sign Out
                        </Typography>
                    </Stack>
                </Box>
            </Menu>
        </React.Fragment>
    );
};

export default ProfileDropdown;
