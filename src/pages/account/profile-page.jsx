import React from "react";
import {
    Avatar, Box, Button, Chip, Container, Divider, Grid,
    Paper, Stack, Typography
} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import VerifiedIcon from "@mui/icons-material/Verified";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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

const InfoRow = ({label, value}) => (
    <Box sx={{display: "flex", gap: 1, alignItems: "flex-start", py: 0.5}}>
        <Typography variant="caption" color="text.secondary" sx={{minWidth: 130, fontWeight: 600}}>{label}</Typography>
        <Typography variant="body2">{value ?? "—"}</Typography>
    </Box>
);

const ProfilePage = () => {
    const navigate = useNavigate();
    const a = currentAdmin;

    return (
        <Layout>
            <Box sx={{pt: 4, pb: 6}}>
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{mb: 3}}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                            <Typography variant="h5">My Profile</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Link to="/profile/update" style={{textDecoration: "none"}}>
                                <Button startIcon={<EditIcon/>} variant="outlined" color="secondary" size="small">Edit Profile</Button>
                            </Link>
                            <Link to="/change-password" style={{textDecoration: "none"}}>
                                <Button startIcon={<LockIcon/>} variant="outlined" size="small">Change Password</Button>
                            </Link>
                        </Stack>
                    </Stack>

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
                                <Stack direction="row" spacing={1} justifyContent="center">
                                    <Chip label={(a.role || "").replace("_", " ")} size="small" color="error"/>
                                    <Chip label={a.status} size="small" color="success"/>
                                </Stack>
                            </Paper>
                        </Grid>

                        <Grid item size={{xs: 12, md: 8}}>
                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Personal Information</Typography>
                                <InfoRow label="First name" value={a.firstName}/>
                                <InfoRow label="Last name" value={a.lastName}/>
                                <InfoRow label="Email" value={a.email}/>
                                <InfoRow label="Username" value={`@${a.username}`}/>
                                <InfoRow label="Phone" value={a.phone}/>
                                <Divider sx={{my: 2}}/>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Role & Access</Typography>
                                <InfoRow label="Role" value={(a.role || "").replace("_", " ")}/>
                                <InfoRow label="Status" value={a.status}/>
                                <InfoRow label="Verified" value={a.is_verified ? "Yes" : "No"}/>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default ProfilePage;
