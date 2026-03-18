import React, {useEffect} from "react";
import {
    Alert, AlertTitle, Box, Button, Chip, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Typography
} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchOrderNote, deleteOrderNote, selectOrderNotes} from "../../redux/features/order-notes/order-notes-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";

const InfoRow = ({label, value}) => (
    <Box sx={{display: "flex", gap: 1, alignItems: "flex-start", py: 0.5}}>
        <Typography variant="caption" color="text.secondary" sx={{minWidth: 140, fontWeight: 600}}>{label}</Typography>
        <Typography variant="body2" component="div">{value ?? "—"}</Typography>
    </Box>
);

const OrderNoteDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {noteID} = useParams();
    const {orderNote, orderNoteLoading, orderNoteError} = useSelector(selectOrderNotes);

    useEffect(() => {
        if (noteID) dispatch(fetchOrderNote(noteID));
    }, [dispatch, noteID]);

    const handleDelete = async () => {
        if (!window.confirm("Delete this order note? This cannot be undone.")) return;
        await dispatch(deleteOrderNote(noteID));
        navigate("/order-notes");
    };

    const n = orderNote || {};

    return (
        <Layout>
            {orderNoteLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {orderNoteError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{orderNoteError}</AlertTitle></Alert>}
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{mb: 3}}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                            <Typography variant="h5">Order Note</Typography>
                        </Stack>
                        <Button startIcon={<DeleteIcon/>} variant="outlined" color="error" size="small" onClick={handleDelete}>Delete</Button>
                    </Stack>

                    <Grid container spacing={3}>
                        <Grid size={{xs: 12, md: 8}}>
                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Note Details</Typography>
                                <InfoRow label="Order" value={(() => {
                                    const oid = typeof n.order_id === "object" ? (n.order_id?._id || n.order_id?.id) : n.order_id;
                                    const onum = typeof n.order_id === "object" ? (n.order_id?.number || oid) : n.order_id;
                                    return oid ? <Link to={`/orders/${oid}`} style={{textDecoration: "none", color: "inherit"}}>#{onum}</Link> : "—";
                                })()}/>
                                <InfoRow label="Author" value={n.author_name || (typeof n.author === "object" ? (n.author?.display_name || n.author?.name || (n.author?.first_name ? `${n.author.first_name} ${n.author.last_name || ""}`.trim() : n.author?.email || null)) : null) || "—"}/>
                                {n.added_by && <InfoRow label="Added by" value={n.added_by}/>}
                                <InfoRow label="Created" value={n.created_at ? moment(n.created_at).format("LLL") : null}/>
                                <Divider sx={{my: 2}}/>
                                <Typography variant="caption" color="text.secondary" sx={{fontWeight: 600}}>Content</Typography>
                                <Typography variant="body2" sx={{mt: 1, whiteSpace: "pre-wrap"}}>{n.content || "—"}</Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{xs: 12, md: 4}}>
                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Type</Typography>
                                <Chip
                                    label={n.note_type || "order_note"}
                                    size="small"
                                    color={n.note_type === "customer_note" ? "info" : "default"}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default OrderNoteDetailPage;
