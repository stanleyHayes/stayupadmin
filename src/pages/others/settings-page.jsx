import React from "react";
import {
    Box, Button, Container, Divider, Grid, Paper, Stack, Switch,
    Typography, FormControlLabel
} from "@mui/material";
import { Link } from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import { useDispatch, useSelector } from "react-redux";
import { selectUI, UI_ACTION_CREATORS } from "../../redux/features/ui/ui-slice";
const { toggleTheme } = UI_ACTION_CREATORS;
import {
    LockOutlined,
    PersonOutlined,
    PaletteOutlined,
    NotificationsOutlined,
    ChevronRightOutlined,
    AdminPanelSettingsOutlined,
    MailOutlineOutlined,
    ShieldOutlined,
} from "@mui/icons-material";

const iconBox = (color = "secondary.main", bg = "light.secondary") => ({
    width: 36,
    height: 36,
    borderRadius: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: bg,
    color: color,
    flexShrink: 0,
});

const Section = ({ icon, iconColor, iconBg, title, description, children }) => (
    <Paper elevation={0} sx={{ mb: 2, overflow: "hidden" }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: 3, py: 2.5 }}>
            <Box sx={iconBox(iconColor, iconBg)}>
                {icon}
            </Box>
            <Box>
                <Typography variant="subtitle2">{title}</Typography>
                {description && (
                    <Typography variant="caption" color="text.secondary">{description}</Typography>
                )}
            </Box>
        </Stack>
        <Divider />
        <Box sx={{ px: 3, py: 2.5 }}>
            {children}
        </Box>
    </Paper>
);

const NavItem = ({ to, icon, label }) => (
    <Link to={to} style={{ textDecoration: "none" }}>
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
                px: 1.5,
                py: 1,
                borderRadius: 1,
                cursor: "pointer",
                "&:hover": { backgroundColor: "background.alternative" },
            }}
        >
            <Stack direction="row" spacing={1.5} alignItems="center">
                <Box sx={{ color: "text.secondary", display: "flex" }}>{icon}</Box>
                <Typography variant="body2" color="text.primary">{label}</Typography>
            </Stack>
            <ChevronRightOutlined sx={{ fontSize: 16, color: "text.muted" }} />
        </Stack>
    </Link>
);

const SettingsPage = () => {
    const dispatch = useDispatch();
    const { theme } = useSelector(selectUI);

    return (
        <Layout>
            <Box sx={{ pt: 4, pb: 6 }}>
                <Container>

                    {/* Page Header */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" sx={{ color: "text.heading", mb: 0.5 }}>Settings</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Manage your account preferences, appearance, and security.
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {/* Main Settings */}
                        <Grid size={{ xs: 12, md: 8 }}>

                            <Section
                                icon={<PaletteOutlined fontSize="small" />}
                                iconColor="secondary.main"
                                iconBg="light.secondary"
                                title="Appearance"
                                description="Customize how the admin panel looks"
                            >
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    sx={{
                                        px: 2,
                                        py: 1.5,
                                        borderRadius: 1,
                                        backgroundColor: "background.alternative",
                                    }}
                                >
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Dark mode</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Currently {theme === "dark" ? "on" : "off"}
                                        </Typography>
                                    </Box>
                                    <Switch
                                        checked={theme === "dark"}
                                        onChange={() => dispatch(toggleTheme())}
                                        color="secondary"
                                        size="small"
                                    />
                                </Stack>
                            </Section>

                            <Section
                                icon={<PersonOutlined fontSize="small" />}
                                iconColor="text.blue"
                                iconBg="light.blue"
                                title="Account"
                                description="Manage your profile and personal information"
                            >
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                                    <Link to="/profile" style={{ textDecoration: "none" }}>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            size="small"
                                            startIcon={<PersonOutlined fontSize="small" />}
                                        >
                                            View Profile
                                        </Button>
                                    </Link>
                                    <Link to="/profile/update" style={{ textDecoration: "none" }}>
                                        <Button variant="outlined" color="secondary" size="small">
                                            Edit Profile
                                        </Button>
                                    </Link>
                                </Stack>
                            </Section>

                            <Section
                                icon={<LockOutlined fontSize="small" />}
                                iconColor="text.orange"
                                iconBg="light.orange"
                                title="Security"
                                description="Manage your password and access controls"
                            >
                                <Stack spacing={2}>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        sx={{
                                            px: 2,
                                            py: 1.5,
                                            borderRadius: 1,
                                            backgroundColor: "background.alternative",
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>Password</Typography>
                                            <Typography variant="caption" color="text.secondary">Last changed — unknown</Typography>
                                        </Box>
                                        <Link to="/change-password" style={{ textDecoration: "none" }}>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                size="small"
                                                startIcon={<LockOutlined fontSize="small" />}
                                            >
                                                Change
                                            </Button>
                                        </Link>
                                    </Stack>

                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        sx={{
                                            px: 2,
                                            py: 1.5,
                                            borderRadius: 1,
                                            backgroundColor: "background.alternative",
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>Two-factor authentication</Typography>
                                            <Typography variant="caption" color="text.secondary">Not configured</Typography>
                                        </Box>
                                        <Button variant="outlined" color="secondary" size="small" startIcon={<ShieldOutlined fontSize="small" />}
                                            onClick={() => alert("Two-factor authentication setup will be available when connected to a backend API. This feature requires server-side TOTP generation.")}>
                                            Set up
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Section>

                            <Section
                                icon={<NotificationsOutlined fontSize="small" />}
                                iconColor="text.yellow"
                                iconBg="light.yellow"
                                title="Notifications"
                                description="Choose what you want to be notified about"
                            >
                                <Stack spacing={0}>
                                    {[
                                        { label: "Email notifications", sub: "Receive general updates via email", defaultChecked: true },
                                        { label: "Order alerts", sub: "Get notified when new orders come in", defaultChecked: true },
                                        { label: "Marketing emails", sub: "Promotional and product news", defaultChecked: false },
                                    ].map(({ label, sub, defaultChecked }, i, arr) => (
                                        <React.Fragment key={label}>
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="space-between"
                                                sx={{ py: 1.5 }}
                                            >
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{label}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{sub}</Typography>
                                                </Box>
                                                <Switch defaultChecked={defaultChecked} color="secondary" size="small" />
                                            </Stack>
                                            {i < arr.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))}
                                </Stack>
                            </Section>
                        </Grid>

                        {/* Sidebar */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Stack spacing={2}>

                                {/* Navigation Card */}
                                <Paper elevation={0} sx={{ overflow: "hidden" }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: 3, py: 2.5 }}>
                                        <Box sx={iconBox("secondary.main", "light.secondary")}>
                                            <AdminPanelSettingsOutlined fontSize="small" />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2">Quick Access</Typography>
                                            <Typography variant="caption" color="text.secondary">Frequently used pages</Typography>
                                        </Box>
                                    </Stack>
                                    <Divider />
                                    <Box sx={{ px: 1.5, py: 1.5 }}>
                                        <Stack spacing={0.5}>
                                            <NavItem to="/account" icon={<PersonOutlined fontSize="small" />} label="My Account" />
                                            <NavItem to="/profile" icon={<PersonOutlined fontSize="small" />} label="My Profile" />
                                            <NavItem to="/admins" icon={<AdminPanelSettingsOutlined fontSize="small" />} label="Manage Admins" />
                                            <NavItem to="/invitations" icon={<MailOutlineOutlined fontSize="small" />} label="Invitations" />
                                        </Stack>
                                    </Box>
                                </Paper>

                                {/* Info Card */}
                                <Paper elevation={0} sx={{ p: 3 }}>
                                    <Stack spacing={0.5}>
                                        <Typography variant="caption" color="text.secondary">Admin Panel</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>StayUp Admin</Typography>
                                        <Typography variant="caption" color="text.muted">v1.0.0</Typography>
                                    </Stack>
                                </Paper>

                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default SettingsPage;
