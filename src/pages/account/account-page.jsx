import React from "react";
import {
    Avatar, Box, Button, Chip, Container, Divider, Grid,
    Paper, Stack, Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useSelector} from "react-redux";
import {selectAuth} from "../../redux/features/authentication/authentication-slice";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedIcon from "@mui/icons-material/Verified";
import SettingsIcon from "@mui/icons-material/Settings";

const AccountPage = () => {
    const {user} = useSelector(selectAuth);
    const name = user?.display_name || user?.name || (user?.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : user?.email || "Admin");
    const initials = user?.first_name && user?.last_name ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() : name[0]?.toUpperCase() || "A";
    const roleLabel = (user?.role || "admin").replace(/_/g, " ");

    return (
        <Layout>
            <Box sx={{pt: 4, pb: 8}}>
                <Container>
                    <Typography variant="h4" sx={{color: "text.secondary", mb: 4}}>My Account</Typography>
                    <Grid container spacing={3}>
                        <Grid size={{xs: 12, md: 4}}>
                            <Paper elevation={0} sx={{p: 3, textAlign: "center"}}>
                                <Avatar src={user?.avatar_url || user?.image} sx={{width: 80, height: 80, mx: "auto", mb: 2, bgcolor: "secondary.main", fontSize: 32}}>
                                    {initials}
                                </Avatar>
                                <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{mb: 0.5}}>
                                    <Typography variant="h6">{name}</Typography>
                                    {user?.is_verified && <VerifiedIcon sx={{fontSize: 18, color: "secondary.main"}}/>}
                                </Stack>
                                <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                                    {user?.username ? `@${user.username}` : user?.email || ""}
                                </Typography>
                                <Stack direction="row" spacing={1} justifyContent="center" sx={{mb: 2}}>
                                    <Chip label={roleLabel} size="small" color="secondary" sx={{textTransform: "capitalize"}}/>
                                    <Chip label={user?.status || "active"} size="small" color={user?.status === "ACTIVE" || user?.status === "active" ? "success" : "warning"} sx={{textTransform: "capitalize"}}/>
                                </Stack>
                                <Divider sx={{mb: 2}}/>
                                <Stack spacing={1}>
                                    <Link to="/profile/update" style={{textDecoration: "none"}}>
                                        <Button startIcon={<EditIcon/>} variant="outlined" color="secondary" fullWidth size="small">Edit Profile</Button>
                                    </Link>
                                    <Link to="/change-password" style={{textDecoration: "none"}}>
                                        <Button startIcon={<LockIcon/>} variant="outlined" fullWidth size="small">Change Password</Button>
                                    </Link>
                                </Stack>
                            </Paper>
                        </Grid>

                        <Grid size={{xs: 12, md: 8}}>
                            <Paper elevation={0} sx={{p: 3, mb: 3}}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mb: 2}}>
                                    <Typography variant="subtitle1" sx={{fontWeight: 600}}>Profile Information</Typography>
                                    <Link to="/profile" style={{textDecoration: "none"}}>
                                        <Button startIcon={<PersonIcon/>} size="small" color="secondary">View Profile</Button>
                                    </Link>
                                </Stack>
                                {[
                                    {label: "Full name", value: name},
                                    {label: "Email", value: user?.email},
                                    {label: "Phone", value: user?.phone},
                                    {label: "Username", value: user?.username ? `@${user.username}` : "—"},
                                    {label: "Role", value: roleLabel},
                                ].map((row, i) => (
                                    <Box key={i} sx={{display: "flex", gap: 1, py: 0.5}}>
                                        <Typography variant="caption" color="text.secondary" sx={{minWidth: 130, fontWeight: 600}}>{row.label}</Typography>
                                        <Typography variant="body2">{row.value || "—"}</Typography>
                                    </Box>
                                ))}
                            </Paper>

                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{fontWeight: 600, mb: 2}}>Quick Actions</Typography>
                                <Grid container spacing={2}>
                                    {[
                                        {to: "/profile/update", icon: <EditIcon sx={{color: "secondary.main", mb: 0.5}}/>, label: "Edit Profile"},
                                        {to: "/change-password", icon: <LockIcon sx={{color: "secondary.main", mb: 0.5}}/>, label: "Change Password"},
                                        {to: "/settings", icon: <SettingsIcon sx={{color: "secondary.main", mb: 0.5}}/>, label: "Settings"},
                                    ].map((item, i) => (
                                        <Grid key={i} size={{xs: 12, sm: 4}}>
                                            <Link to={item.to} style={{textDecoration: "none"}}>
                                                <Paper variant="outlined" sx={{p: 2, textAlign: "center", cursor: "pointer", "&:hover": {borderColor: "secondary.main"}}}>
                                                    {item.icon}
                                                    <Typography variant="body2">{item.label}</Typography>
                                                </Paper>
                                            </Link>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default AccountPage;
