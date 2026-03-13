import React from "react";
import {
    Avatar, Box, Button, Chip, Container, Divider, Grid,
    Paper, Stack, Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedIcon from "@mui/icons-material/Verified";

const currentAdmin = {
    firstName: "Super",
    lastName: "Admin",
    email: "admin@stayup.com",
    username: "superadmin",
    phone: "+1 555 000 0000",
    role: "super_admin",
    status: "ACTIVE",
    is_verified: true,
};

const AccountPage = () => {
    const a = currentAdmin;

    return (
        <Layout>
            <Box sx={{pt: 4, pb: 8}}>
                <Container>
                    <Typography variant="h4" sx={{color: "text.secondary", mb: 4}}>My Account</Typography>
                    <Grid container spacing={3}>
                        <Grid item size={{xs: 12, md: 4}}>
                            <Paper elevation={0} sx={{p: 3, textAlign: "center"}}>
                                <Avatar sx={{width: 80, height: 80, mx: "auto", mb: 2, bgcolor: "secondary.main", fontSize: 32}}>
                                    {(a.firstName || "?")[0].toUpperCase()}
                                </Avatar>
                                <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{mb: 0.5}}>
                                    <Typography variant="h6">{a.firstName} {a.lastName}</Typography>
                                    {a.is_verified && <VerifiedIcon sx={{fontSize: 18, color: "secondary.main"}}/>}
                                </Stack>
                                <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>@{a.username}</Typography>
                                <Stack direction="row" spacing={1} justifyContent="center" sx={{mb: 2}}>
                                    <Chip label={(a.role || "").replace("_", " ")} size="small" color="error"/>
                                    <Chip label={a.status} size="small" color="success"/>
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

                        <Grid item size={{xs: 12, md: 8}}>
                            <Paper elevation={0} sx={{p: 3, mb: 3}}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mb: 2}}>
                                    <Typography variant="subtitle1" sx={{fontWeight: 600}}>Profile Information</Typography>
                                    <Link to="/profile" style={{textDecoration: "none"}}>
                                        <Button startIcon={<PersonIcon/>} size="small" color="secondary">View Profile</Button>
                                    </Link>
                                </Stack>
                                <Box sx={{display: "flex", gap: 1, py: 0.5}}>
                                    <Typography variant="caption" color="text.secondary" sx={{minWidth: 130, fontWeight: 600}}>Full name</Typography>
                                    <Typography variant="body2">{a.firstName} {a.lastName}</Typography>
                                </Box>
                                <Box sx={{display: "flex", gap: 1, py: 0.5}}>
                                    <Typography variant="caption" color="text.secondary" sx={{minWidth: 130, fontWeight: 600}}>Email</Typography>
                                    <Typography variant="body2">{a.email}</Typography>
                                </Box>
                                <Box sx={{display: "flex", gap: 1, py: 0.5}}>
                                    <Typography variant="caption" color="text.secondary" sx={{minWidth: 130, fontWeight: 600}}>Phone</Typography>
                                    <Typography variant="body2">{a.phone || "—"}</Typography>
                                </Box>
                                <Box sx={{display: "flex", gap: 1, py: 0.5}}>
                                    <Typography variant="caption" color="text.secondary" sx={{minWidth: 130, fontWeight: 600}}>Role</Typography>
                                    <Typography variant="body2">{(a.role || "").replace("_", " ")}</Typography>
                                </Box>
                            </Paper>

                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{fontWeight: 600, mb: 2}}>Quick Actions</Typography>
                                <Grid container spacing={2}>
                                    <Grid item size={{xs: 12, sm: 4}}>
                                        <Link to="/profile/update" style={{textDecoration: "none"}}>
                                            <Paper variant="outlined" sx={{p: 2, textAlign: "center", cursor: "pointer", "&:hover": {borderColor: "secondary.main"}}}>
                                                <EditIcon sx={{color: "secondary.main", mb: 0.5}}/>
                                                <Typography variant="body2">Edit Profile</Typography>
                                            </Paper>
                                        </Link>
                                    </Grid>
                                    <Grid item size={{xs: 12, sm: 4}}>
                                        <Link to="/change-password" style={{textDecoration: "none"}}>
                                            <Paper variant="outlined" sx={{p: 2, textAlign: "center", cursor: "pointer", "&:hover": {borderColor: "secondary.main"}}}>
                                                <LockIcon sx={{color: "secondary.main", mb: 0.5}}/>
                                                <Typography variant="body2">Change Password</Typography>
                                            </Paper>
                                        </Link>
                                    </Grid>
                                    <Grid item size={{xs: 12, sm: 4}}>
                                        <Link to="/settings" style={{textDecoration: "none"}}>
                                            <Paper variant="outlined" sx={{p: 2, textAlign: "center", cursor: "pointer", "&:hover": {borderColor: "secondary.main"}}}>
                                                <PersonIcon sx={{color: "secondary.main", mb: 0.5}}/>
                                                <Typography variant="body2">Settings</Typography>
                                            </Paper>
                                        </Link>
                                    </Grid>
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
