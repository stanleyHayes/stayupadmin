import React, {useEffect} from "react";
import {
    Alert, AlertTitle, Box, Button, Chip, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Typography
} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchSubscriber, deleteSubscriber, selectSubscribers} from "../../redux/features/subscribers/subscribers-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";

const InfoRow = ({label, value}) => (
    <Box sx={{display: "flex", gap: 1, alignItems: "flex-start", py: 0.5}}>
        <Typography variant="caption" color="text.secondary" sx={{minWidth: 140, fontWeight: 600}}>{label}</Typography>
        <Typography variant="body2">{value ?? "—"}</Typography>
    </Box>
);

const statusColor = (s) => s === "active" ? "success" : s === "unsubscribed" ? "warning" : s === "bounced" ? "error" : "default";

const SubscriberDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {subscriberID} = useParams();
    const {subscriber, subscriberLoading, subscriberError} = useSelector(selectSubscribers);

    useEffect(() => {
        if (subscriberID) dispatch(fetchSubscriber(subscriberID));
    }, [dispatch, subscriberID]);

    const handleDelete = async () => {
        if (!window.confirm("Remove this subscriber? This cannot be undone.")) return;
        await dispatch(deleteSubscriber(subscriberID));
        navigate("/subscribers");
    };

    const sub = subscriber || {};

    return (
        <Layout>
            {subscriberLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {subscriberError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{subscriberError}</AlertTitle></Alert>}
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{mb: 3}}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                            <Typography variant="h5">Subscriber</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Button startIcon={<DeleteIcon/>} variant="outlined" color="error" size="small" onClick={handleDelete}>Delete</Button>
                        </Stack>
                    </Stack>

                    <Grid container spacing={3}>
                        <Grid size={{xs: 12, md: 8}}>
                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Subscriber Details</Typography>
                                <InfoRow label="Email" value={sub.email}/>
                                <InfoRow label="Source" value={sub.source}/>
                                <InfoRow label="Subscribed" value={sub.created_at ? moment(sub.created_at).format("LLL") : null}/>
                            </Paper>
                        </Grid>
                        <Grid size={{xs: 12, md: 4}}>
                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Status</Typography>
                                <Chip label={sub.status || "—"} size="small" color={statusColor(sub.status)}/>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default SubscriberDetailPage;
