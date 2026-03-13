import React, {useEffect} from "react";
import {
    Alert, AlertTitle, Box, Button, Chip, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Typography
} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchWebhook, deleteWebhook, selectWebhooks} from "../../redux/features/webhooks/webhooks-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";

const InfoRow = ({label, value}) => (
    <Box sx={{display: "flex", gap: 1, alignItems: "flex-start", py: 0.5}}>
        <Typography variant="caption" color="text.secondary" sx={{minWidth: 140, fontWeight: 600}}>{label}</Typography>
        <Typography variant="body2" sx={{wordBreak: "break-all"}}>{value ?? "—"}</Typography>
    </Box>
);

const statusColor = (s) => s === "active" ? "success" : s === "paused" ? "warning" : "default";

const WebhookDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {webhookID} = useParams();
    const {webhook, webhookLoading, webhookError} = useSelector(selectWebhooks);

    useEffect(() => {
        if (webhookID) dispatch(fetchWebhook(webhookID));
    }, [dispatch, webhookID]);

    const handleDelete = async () => {
        if (!window.confirm(`Delete webhook "${webhook?.name}"? This cannot be undone.`)) return;
        await dispatch(deleteWebhook(webhookID));
        navigate("/webhooks");
    };

    const wh = webhook || {};

    return (
        <Layout>
            {webhookLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {webhookError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{webhookError}</AlertTitle></Alert>}
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{mb: 3}}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                            <Typography variant="h5">Webhook</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Link to={`/webhooks/${webhookID}/update`} style={{textDecoration: "none"}}>
                                <Button startIcon={<EditIcon/>} variant="outlined" color="secondary" size="small">Edit</Button>
                            </Link>
                            <Button startIcon={<DeleteIcon/>} variant="outlined" color="error" size="small" onClick={handleDelete}>Delete</Button>
                        </Stack>
                    </Stack>

                    <Grid container spacing={3}>
                        <Grid size={{xs: 12, md: 8}}>
                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Webhook Details</Typography>
                                <InfoRow label="Name" value={wh.name}/>
                                <InfoRow label="Topic" value={wh.topic}/>
                                <InfoRow label="Delivery URL" value={wh.delivery_url}/>
                                <InfoRow label="Secret" value={wh.secret ? "••••••••" : "—"}/>
                                <InfoRow label="Created" value={wh.date_created ? moment(wh.date_created).format("LLL") : null}/>
                                <Divider sx={{my: 2}}/>
                                <Box sx={{display: "flex", gap: 1, alignItems: "center", py: 0.5}}>
                                    <Typography variant="caption" color="text.secondary" sx={{minWidth: 140, fontWeight: 600}}>Status</Typography>
                                    <Chip label={wh.status || "—"} size="small" color={statusColor(wh.status)}/>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default WebhookDetailPage;
