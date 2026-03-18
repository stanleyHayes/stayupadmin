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
import {DetailSkeleton} from "../../components/shared/page-skeleton.jsx";

const InfoRow = ({label, value}) => (
    <Box sx={{display: "flex", gap: 1, alignItems: "flex-start", py: 0.5}}>
        <Typography variant="caption" color="text.secondary" sx={{minWidth: 130, fontWeight: 600}}>{label}</Typography>
        <Typography variant="body2" component="div">{value ?? "—"}</Typography>
    </Box>
);

const nameOf = (a) => a?.display_name || a?.name || (a?.first_name ? `${a.first_name} ${a.last_name || ""}`.trim() : a?.email || "—");
const initialsOf = (a) => a?.first_name && a?.last_name ? `${a.first_name[0]}${a.last_name[0]}`.toUpperCase() : (nameOf(a)?.[0] || "A").toUpperCase();
const roleColor = (role) => role === "super_admin" ? "error" : role === "admin" ? "primary" : "default";

const AdminDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {adminID} = useParams();
    const {admin, adminLoading, adminError} = useSelector(selectAdmins);

    useEffect(() => {
        if (adminID) dispatch(fetchAdmin(adminID));
    }, [dispatch, adminID]);

    const handleDelete = async () => {
        if (!window.confirm(`Delete admin ${nameOf(admin)}? This cannot be undone.`)) return;
        await dispatch(deleteAdmin(adminID));
        navigate("/admins");
    };

    if (adminLoading && !admin) return <Layout><Box sx={{pt: 4, pb: 6}}><DetailSkeleton/></Box></Layout>;

    const a = admin || {};
    const name = nameOf(a);
    const joinDate = a.date_created || a.created_at;

    return (
        <Layout>
            {adminLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {adminError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{adminError}</AlertTitle></Alert>}
                {!admin && !adminLoading && <Alert severity="warning" sx={{mb: 2}}><AlertTitle>Admin not found</AlertTitle></Alert>}
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
                            <Button startIcon={<DeleteIcon/>} variant="outlined" color="error" size="small" onClick={handleDelete} disabled={!admin}>Delete</Button>
                        </Stack>
                    </Stack>

                    {admin && (
                        <Grid container spacing={3}>
                            <Grid size={{xs: 12, md: 4}}>
                                <Paper elevation={0} sx={{overflow: "hidden"}}>
                                    <Box sx={{background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)", p: 3, pb: 5}}/>
                                    <Box sx={{px: 3, pb: 3, mt: -4, textAlign: "center"}}>
                                        <Avatar src={a.avatar_url || a.image} sx={{width: 80, height: 80, mx: "auto", mb: 1.5, fontSize: 28, fontWeight: 700, bgcolor: "secondary.main", color: "#fff", border: "4px solid", borderColor: "background.paper"}}>
                                            {initialsOf(a)}
                                        </Avatar>
                                        <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center" sx={{mb: 0.5}}>
                                            <Typography variant="h6" sx={{fontWeight: 700}}>{name}</Typography>
                                            {a.is_verified && <VerifiedIcon sx={{fontSize: 18, color: "#F59E0B"}}/>}
                                        </Stack>
                                        <Typography variant="body2" color="text.secondary" sx={{mb: 1.5}}>
                                            {a.username ? `@${a.username}` : a.email || ""}
                                        </Typography>
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            {a.role && <Chip label={(a.role || "").replace(/_/g, " ")} size="small" color={roleColor(a.role)} sx={{textTransform: "capitalize"}}/>}
                                            {a.status && <Chip label={a.status} size="small" color={(a.status || "").toLowerCase() === "active" ? "success" : "default"} sx={{textTransform: "capitalize"}}/>}
                                        </Stack>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid size={{xs: 12, md: 8}}>
                                <Paper elevation={0} sx={{p: 3, mb: 2}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Account Information</Typography>
                                    <InfoRow label="First name" value={a.first_name || a.firstName}/>
                                    <InfoRow label="Last name" value={a.last_name || a.lastName}/>
                                    <InfoRow label="Email" value={a.email}/>
                                    <InfoRow label="Username" value={a.username ? `@${a.username}` : null}/>
                                    <InfoRow label="Phone" value={a.phone}/>
                                </Paper>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Role & Access</Typography>
                                    <InfoRow label="Role" value={(a.role || "").replace(/_/g, " ")}/>
                                    <InfoRow label="Status" value={a.status}/>
                                    <InfoRow label="Verified" value={a.is_verified ? "Yes" : "No"}/>
                                    <Divider sx={{my: 2}}/>
                                    <InfoRow label="Joined" value={joinDate ? moment(joinDate).format("MMMM D, YYYY [at] h:mm A") : null}/>
                                </Paper>
                            </Grid>
                        </Grid>
                    )}
                </Container>
            </Box>
        </Layout>
    );
};

export default AdminDetailPage;
