import React, {useEffect} from "react";
import {
    Alert, AlertTitle, Box, Button, Chip, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Typography
} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchMessage, deleteMessage, selectMessages} from "../../redux/features/messages/messages-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";

const InfoRow = ({label, value}) => (
    <Box sx={{display: "flex", gap: 1, alignItems: "flex-start", py: 0.5}}>
        <Typography variant="caption" color="text.secondary" sx={{minWidth: 140, fontWeight: 600}}>{label}</Typography>
        <Typography variant="body2" component="div">{value ?? "—"}</Typography>
    </Box>
);

const statusColor = (s) => s === "read" ? "success" : s === "unread" ? "info" : "default";

const MessageDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {messageID} = useParams();
    const {message, messageLoading, messageError} = useSelector(selectMessages);

    useEffect(() => {
        if (messageID) dispatch(fetchMessage(messageID));
    }, [dispatch, messageID]);

    const handleDelete = async () => {
        if (!window.confirm("Delete this message? This cannot be undone.")) return;
        await dispatch(deleteMessage(messageID));
        navigate("/messages");
    };

    const msg = message || {};

    return (
        <Layout>
            {messageLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {messageError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{messageError}</AlertTitle></Alert>}
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{mb: 3}}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                            <Typography variant="h5">Message</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Button startIcon={<DeleteIcon/>} variant="outlined" color="error" size="small" onClick={handleDelete}>Delete</Button>
                        </Stack>
                    </Stack>

                    <Grid container spacing={3}>
                        <Grid size={{xs: 12, md: 8}}>
                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Message Details</Typography>
                                <InfoRow label="Name" value={msg.name}/>
                                <InfoRow label="Email" value={msg.email}/>
                                <InfoRow label="Subject" value={msg.subject}/>
                                <InfoRow label="Received" value={msg.created_at ? moment(msg.created_at).format("LLL") : null}/>
                                <Divider sx={{my: 2}}/>
                                <Typography variant="caption" color="text.secondary" sx={{fontWeight: 600}}>Message</Typography>
                                <Typography variant="body2" sx={{mt: 1, whiteSpace: "pre-wrap"}}>{msg.message || "—"}</Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{xs: 12, md: 4}}>
                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Status</Typography>
                                <Chip label={msg.status || "—"} size="small" color={statusColor(msg.status)}/>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default MessageDetailPage;
