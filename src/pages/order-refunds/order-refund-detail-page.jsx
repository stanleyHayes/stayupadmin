import React, {useEffect} from "react";
import {
    Alert, AlertTitle, Box, Button, Chip, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Typography
} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchOrderRefund, deleteOrderRefund, selectOrderRefunds} from "../../redux/features/order-refunds/order-refunds-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";

const InfoRow = ({label, value}) => (
    <Box sx={{display: "flex", gap: 1, alignItems: "flex-start", py: 0.5}}>
        <Typography variant="caption" color="text.secondary" sx={{minWidth: 130, fontWeight: 600}}>{label}</Typography>
        <Typography variant="body2">{value ?? "—"}</Typography>
    </Box>
);

const statusColor = (s) => s === "PROCESSED" ? "success" : s === "PENDING" ? "warning" : s === "FAILED" ? "error" : "default";

const OrderRefundDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {refundID} = useParams();
    const {orderRefund, orderRefundLoading, orderRefundError} = useSelector(selectOrderRefunds);

    useEffect(() => {
        if (refundID) dispatch(fetchOrderRefund(refundID));
    }, [dispatch, refundID]);

    const handleDelete = async () => {
        if (!window.confirm("Delete this refund? This cannot be undone.")) return;
        await dispatch(deleteOrderRefund(refundID));
        navigate("/order-refunds");
    };

    const r = orderRefund || {};
    const items = r.items || [];

    return (
        <Layout>
            {orderRefundLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {orderRefundError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{orderRefundError}</AlertTitle></Alert>}
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{mb: 3}}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                            <Typography variant="h5">Refund Details</Typography>
                        </Stack>
                        <Button startIcon={<DeleteIcon/>} variant="outlined" color="error" size="small" onClick={handleDelete}>Delete</Button>
                    </Stack>

                    <Grid container spacing={3}>
                        <Grid size={{xs: 12, md: 5}}>
                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Refund Info</Typography>
                                <InfoRow label="Order ID" value={
                                    r.order_id ? (
                                        <Link to={`/orders/${r.order_id}`} style={{textDecoration: "none", color: "inherit"}}>#{r.order_id}</Link>
                                    ) : "—"
                                }/>
                                <InfoRow label="Amount" value={r.amount != null ? `$${Number(r.amount).toFixed(2)}` : null}/>
                                <InfoRow label="Reason" value={r.reason}/>
                                <InfoRow label="Created" value={r.created_at ? moment(r.created_at).format("LLL") : null}/>
                                <Divider sx={{my: 2}}/>
                                <Box sx={{display: "flex", gap: 1, alignItems: "center", py: 0.5}}>
                                    <Typography variant="caption" color="text.secondary" sx={{minWidth: 130, fontWeight: 600}}>Status</Typography>
                                    <Chip label={r.status || "—"} size="small" color={statusColor(r.status)}/>
                                </Box>
                            </Paper>
                        </Grid>
                        {items.length > 0 && (
                            <Grid size={{xs: 12, md: 7}}>
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Refunded Items</Typography>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Product</TableCell>
                                                    <TableCell>Qty</TableCell>
                                                    <TableCell>Refund Amount</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {items.map((item, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell>{item.product_name || "—"}</TableCell>
                                                        <TableCell>{item.qty ?? item.quantity ?? "—"}</TableCell>
                                                        <TableCell>${Number(item.refund_amount || 0).toFixed(2)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default OrderRefundDetailPage;
