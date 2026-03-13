import React, {useEffect} from "react";
import {
    Avatar, Box, Button, Chip, Container, Divider, Grid, Paper,
    Stack, Typography, LinearProgress, Alert, AlertTitle
} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchAdmin, deleteAdmin, selectAdmins} from "../../redux/features/admins/admins-slice";
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

const AdminDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {adminID} = useParams();
    const {admin, adminLoading, adminError} = useSelector(selectAdmins);

    useEffect(() => {
        if (adminID) dispatch(fetchAdmin(adminID));
    }, [dispatch, adminID]);

    const handleDelete = async () => {
        if (!window.confirm(`Delete admin ${admin?.firstName} ${admin?.lastName}? This cannot be undone.`)) return;
        await dispatch(deleteAdmin(adminID));
        navigate("/admins");
    };

    const a = admin || {};
    const roleColor = (role) => role === "super_admin" ? "error" : role === "admin" ? "primary" : "default";

    return (
        <Layout>
            {adminLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {adminError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{adminError}</AlertTitle></Alert>}
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{mb: 3}}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                            <Typography variant="h5">Admin Profile</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Link to={`/admins/${adminID}/update`} style={{textDecoration: "none"}}>
                                <Button startIcon={<EditIcon/>} variant="outlined" color="secondary" size="small">Edit</Button>
                            </Link>
                            <Button startIcon={<DeleteIcon/>} variant="outlined" color="error" size="small" onClick={handleDelete}>Delete</Button>
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
                                <Typography variant="body2" color="text.secondary">@{a.username || "—"}</Typography>
                                <Stack direction="row" spacing={1} justifyContent="center" sx={{mt: 1}}>
                                    {a.role && <Chip label={(a.role || "").replace("_", " ")} size="small" color={roleColor(a.role)}/>}
                                    {a.status && <Chip label={a.status} size="small" color={a.status === "ACTIVE" ? "success" : "default"}/>}
                                </Stack>
                            </Paper>
                        </Grid>

                        <Grid item size={{xs: 12, md: 8}}>
                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Account Information</Typography>
                                <InfoRow label="First name" value={a.firstName}/>
                                <InfoRow label="Last name" value={a.lastName}/>
                                <InfoRow label="Email" value={a.email}/>
                                <InfoRow label="Username" value={a.username ? `@${a.username}` : null}/>
                                <InfoRow label="Phone" value={a.phone}/>
                                <Divider sx={{my: 2}}/>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Role & Access</Typography>
                                <InfoRow label="Role" value={(a.role || "").replace("_", " ")}/>
                                <InfoRow label="Status" value={a.status}/>
                                <InfoRow label="Verified" value={a.is_verified ? "Yes" : "No"}/>
                                <Divider sx={{my: 2}}/>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Timestamps</Typography>
                                <InfoRow label="Joined" value={a.created_at ? moment(a.created_at).format("LLL") : null}/>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default AdminDetailPage;
