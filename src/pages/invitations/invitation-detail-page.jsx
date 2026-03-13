import React, {useEffect} from "react";
import {
    Alert, AlertTitle, Box, Button, Chip, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Typography
} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchInvitation, deleteInvitation, selectInvitations} from "../../redux/features/invitations/invitations-slice";
import moment from "moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";

const InfoRow = ({label, value}) => (
    <Box sx={{display: "flex", gap: 1, alignItems: "flex-start", py: 0.5}}>
        <Typography variant="caption" color="text.secondary" sx={{minWidth: 130, fontWeight: 600}}>{label}</Typography>
        <Typography variant="body2">{value ?? "—"}</Typography>
    </Box>
);

const statusColor = (s) => {
    if (s === "ACCEPTED") return "success";
    if (s === "PENDING") return "warning";
    if (s === "EXPIRED") return "default";
    return "default";
};

const InvitationDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {invitationID} = useParams();
    const {invitation, invitationLoading, invitationError} = useSelector(selectInvitations);

    useEffect(() => {
        if (invitationID) dispatch(fetchInvitation(invitationID));
    }, [dispatch, invitationID]);

    const handleDelete = async () => {
        if (!window.confirm(`Delete invitation for ${invitation?.email}? This cannot be undone.`)) return;
        await dispatch(deleteInvitation(invitationID));
        navigate("/invitations");
    };

    const inv = invitation || {};

    return (
        <Layout>
            {invitationLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {invitationError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{invitationError}</AlertTitle></Alert>}
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{mb: 3}}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                            <Typography variant="h5">Invitation Details</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Link to={`/invitations/${invitationID}/update`} style={{textDecoration: "none"}}>
                                <Button startIcon={<EditIcon/>} variant="outlined" color="secondary" size="small">Edit</Button>
                            </Link>
                            <Button startIcon={<DeleteIcon/>} variant="outlined" color="error" size="small" onClick={handleDelete}>Delete</Button>
                        </Stack>
                    </Stack>

                    <Grid container spacing={3}>
                        <Grid item size={{xs: 12, md: 4}}>
                            <Paper elevation={0} sx={{p: 3, textAlign: "center"}}>
                                <EmailIcon sx={{fontSize: 56, color: "secondary.main", mb: 1}}/>
                                <Typography variant="h6" sx={{wordBreak: "break-all"}}>{inv.email || "—"}</Typography>
                                <Stack direction="row" spacing={1} justifyContent="center" sx={{mt: 1}}>
                                    {inv.role && <Chip label={(inv.role || "").replace("_", " ")} size="small"/>}
                                    {inv.status && <Chip label={inv.status} size="small" color={statusColor(inv.status)}/>}
                                </Stack>
                            </Paper>
                        </Grid>

                        <Grid item size={{xs: 12, md: 8}}>
                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Invitation Information</Typography>
                                <InfoRow label="Email" value={inv.email}/>
                                <InfoRow label="Role" value={(inv.role || "").replace("_", " ")}/>
                                <InfoRow label="Status" value={inv.status}/>
                                <InfoRow label="Invited by" value={inv.invited_by}/>
                                <Divider sx={{my: 2}}/>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Token & Expiry</Typography>
                                <InfoRow label="Token" value={inv.token}/>
                                <InfoRow label="Expires at" value={inv.expires_at ? moment(inv.expires_at).format("LLL") : null}/>
                                <Divider sx={{my: 2}}/>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Timestamps</Typography>
                                <InfoRow label="Sent" value={inv.created_at ? moment(inv.created_at).format("LLL") : null}/>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default InvitationDetailPage;
