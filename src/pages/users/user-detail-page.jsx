import React, {useEffect} from "react";
import {
    Avatar, Box, Button, Chip, Container, Divider, Grid, Paper,
    Stack, Typography, LinearProgress, Alert, AlertTitle
} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchUser, deleteUser, selectUsers} from "../../redux/features/users/users-slice";
import moment from "moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VerifiedIcon from "@mui/icons-material/Verified";

const InfoRow = ({label, value}) => (
    <Box sx={{display: "flex", gap: 1, alignItems: "flex-start", py: 0.5}}>
        <Typography variant="caption" color="text.secondary" sx={{minWidth: 130, fontWeight: 600}}>{label}</Typography>
        <Typography variant="body2">{value ?? "—"}</Typography>
    </Box>
);

const UserDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {userID} = useParams();
    const {user, userLoading, userError} = useSelector(selectUsers);

    useEffect(() => {
        if (userID) dispatch(fetchUser(userID));
    }, [dispatch, userID]);

    const handleDelete = async () => {
        if (!window.confirm(`Delete user ${user?.firstName} ${user?.lastName}? This cannot be undone.`)) return;
        await dispatch(deleteUser(userID));
        navigate("/users");
    };

    const u = user || {};

    return (
        <Layout>
            {userLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {userError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{userError}</AlertTitle></Alert>}
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{mb: 3}}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                            <Typography variant="h5">User Profile</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Link to={`/users/${userID}/update`} style={{textDecoration: "none"}}>
                                <Button startIcon={<EditIcon/>} variant="outlined" color="secondary" size="small">Edit</Button>
                            </Link>
                            <Button startIcon={<DeleteIcon/>} variant="outlined" color="error" size="small" onClick={handleDelete}>Delete</Button>
                        </Stack>
                    </Stack>

                    <Grid container spacing={3}>
                        <Grid item size={{xs: 12, md: 4}}>
                            <Paper elevation={0} sx={{p: 3, textAlign: "center"}}>
                                <Avatar sx={{width: 80, height: 80, mx: "auto", mb: 2, bgcolor: "secondary.light", fontSize: 32}}>
                                    {(u.firstName || "?")[0].toUpperCase()}
                                </Avatar>
                                <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{mb: 0.5}}>
                                    <Typography variant="h6">{u.firstName} {u.lastName}</Typography>
                                    {u.is_verified && <VerifiedIcon sx={{fontSize: 18, color: "secondary.main"}}/>}
                                </Stack>
                                <Typography variant="body2" color="text.secondary">@{u.username || "—"}</Typography>
                                <Stack direction="row" spacing={1} justifyContent="center" sx={{mt: 1}}>
                                    {u.role && <Chip label={u.role} size="small"/>}
                                    {u.status && <Chip label={u.status} size="small" color={u.status === "ACTIVE" ? "success" : u.status === "PENDING" ? "warning" : "default"}/>}
                                </Stack>
                            </Paper>
                        </Grid>

                        <Grid item size={{xs: 12, md: 8}}>
                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Account Information</Typography>
                                <InfoRow label="First name" value={u.firstName}/>
                                <InfoRow label="Last name" value={u.lastName}/>
                                <InfoRow label="Email" value={u.email}/>
                                <InfoRow label="Username" value={u.username ? `@${u.username}` : null}/>
                                <InfoRow label="Phone" value={u.phone}/>
                                <Divider sx={{my: 2}}/>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Role & Status</Typography>
                                <InfoRow label="Role" value={u.role}/>
                                <InfoRow label="Status" value={u.status}/>
                                <InfoRow label="Verified" value={u.is_verified ? "Yes" : "No"}/>
                                <Divider sx={{my: 2}}/>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Timestamps</Typography>
                                <InfoRow label="Joined" value={u.created_at ? moment(u.created_at).format("LLL") : null}/>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default UserDetailPage;
