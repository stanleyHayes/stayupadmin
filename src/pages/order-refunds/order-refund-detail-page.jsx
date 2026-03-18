import React, {useEffect} from "react";
import {
    Alert, AlertTitle, Avatar, Box, Button, Chip, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Typography
} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchOrderRefund, deleteOrderRefund, selectOrderRefunds} from "../../redux/features/order-refunds/order-refunds-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import moment from "moment";

const statusColor = (s) => {
    const sl = (s || "").toLowerCase();
    if (sl === "completed" || sl === "processed") return "success";
    if (sl === "pending") return "warning";
    if (sl === "failed" || sl === "rejected") return "error";
    return "default";
};

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
    const items = r.items || r.line_items || [];

    // Resolve order_id (can be populated object or string)
    const order = typeof r.order_id === "object" ? r.order_id : null;
    const orderId = order?._id || order?.id || r.order_id;
    const orderNumber = order?.number || orderId;

    // Resolve refunded_by / author
    const refundedBy = typeof r.refunded_by === "object"
        ? (r.refunded_by?.display_name || r.refunded_by?.name || (r.refunded_by?.first_name ? `${r.refunded_by.first_name} ${r.refunded_by.last_name || ""}`.trim() : r.refunded_by?.email))
        : r.refunded_by;

    const currency = r.currency || order?.currency || "GHS";
    const sym = currency === "GHS" ? "GH₵" : currency === "USD" ? "$" : currency === "EUR" ? "€" : "£";

    return (
        <Layout>
            {orderRefundLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {orderRefundError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{orderRefundError}</AlertTitle></Alert>}
                {!orderRefund && !orderRefundLoading && <Alert severity="warning" sx={{mb: 2}}><AlertTitle>Refund not found</AlertTitle></Alert>}
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{mb: 3}}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                            <Typography variant="h5">Refund Details</Typography>
                        </Stack>
                        <Button startIcon={<DeleteIcon/>} variant="outlined" color="error" size="small" onClick={handleDelete} disabled={!orderRefund}>Delete</Button>
                    </Stack>

                    <Grid container spacing={3}>
                        {/* Left — Summary Card */}
                        <Grid size={{xs: 12, md: 4}}>
                            <Paper elevation={0} sx={{p: 3, textAlign: "center"}}>
                                <Avatar sx={{width: 56, height: 56, mx: "auto", mb: 2, bgcolor: "light.red"}}>
                                    <MoneyOffIcon sx={{color: "icon.red", fontSize: 28}}/>
                                </Avatar>
                                <Typography variant="h4" sx={{fontWeight: 700, color: "text.red", mb: 0.5}}>
                                    {r.amount != null ? `${sym}${Number(r.amount).toFixed(2)}` : "—"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>Refund Amount</Typography>
                                <Chip label={r.status || "—"} size="small" color={statusColor(r.status)} sx={{mb: 2}}/>
                                <Divider sx={{my: 2}}/>
                                <Stack spacing={1.5} sx={{textAlign: "left"}}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{fontWeight: 600}}>Order</Typography>
                                        {orderId ? (
                                            <Link to={`/orders/${orderId}`} style={{textDecoration: "none"}}>
                                                <Typography variant="body2" color="secondary">#{orderNumber}</Typography>
                                            </Link>
                                        ) : (
                                            <Typography variant="body2">—</Typography>
                                        )}
                                    </Box>
                                    {order?.status && (
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{fontWeight: 600}}>Order Status</Typography>
                                            <Box sx={{mt: 0.5}}>
                                                <Chip label={order.status} size="small" variant="outlined" sx={{textTransform: "capitalize"}}/>
                                            </Box>
                                        </Box>
                                    )}
                                    {refundedBy && (
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{fontWeight: 600}}>Refunded By</Typography>
                                            <Typography variant="body2">{refundedBy}</Typography>
                                        </Box>
                                    )}
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{fontWeight: 600}}>Date</Typography>
                                        <Typography variant="body2">
                                            {(r.date_created || r.created_at) ? moment(r.date_created || r.created_at).format("MMMM D, YYYY [at] h:mm A") : "—"}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Grid>

                        {/* Right — Details */}
                        <Grid size={{xs: 12, md: 8}}>
                            {/* Reason */}
                            <Paper elevation={0} sx={{p: 3, mb: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 1.5, fontWeight: 600}}>Reason</Typography>
                                <Typography variant="body2" sx={{whiteSpace: "pre-wrap", lineHeight: 1.8, color: r.reason ? "text.primary" : "text.secondary"}}>
                                    {r.reason || "No reason provided"}
                                </Typography>
                            </Paper>

                            {/* Refunded Items */}
                            {items.length > 0 && (
                                <Paper elevation={0} sx={{p: 3, mb: 3}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Refunded Items</Typography>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Product</TableCell>
                                                    <TableCell align="center">Qty</TableCell>
                                                    <TableCell align="right">Amount</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {items.map((item, i) => {
                                                    const productName = typeof item.product === "object"
                                                        ? (item.product?.title || item.product?.name || "—")
                                                        : (item.product_name || item.name || "—");
                                                    return (
                                                        <TableRow key={i}>
                                                            <TableCell>
                                                                <Typography variant="body2">{productName}</Typography>
                                                                {item.sku && <Typography variant="caption" color="text.secondary">SKU: {item.sku}</Typography>}
                                                            </TableCell>
                                                            <TableCell align="center">{item.qty ?? item.quantity ?? "—"}</TableCell>
                                                            <TableCell align="right">
                                                                <Typography variant="body2" sx={{fontWeight: 600}}>
                                                                    {sym}{Number(item.refund_amount || item.total || 0).toFixed(2)}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                                <TableRow>
                                                    <TableCell colSpan={2} sx={{border: 0}}>
                                                        <Typography variant="subtitle2" sx={{fontWeight: 700}}>Total</Typography>
                                                    </TableCell>
                                                    <TableCell align="right" sx={{border: 0}}>
                                                        <Typography variant="subtitle2" sx={{fontWeight: 700, color: "text.red"}}>
                                                            {sym}{Number(r.amount || 0).toFixed(2)}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            )}

                            {/* Financial Breakdown */}
                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Breakdown</Typography>
                                <Stack spacing={1}>
                                    {[
                                        {label: "Refund Amount", value: r.amount},
                                        {label: "Refund Tax", value: r.refund_tax ?? r.tax},
                                        {label: "Refund Shipping", value: r.refund_shipping ?? r.shipping},
                                    ].filter(row => row.value != null && row.value !== "" && row.value !== "0.00" && Number(row.value) !== 0).map((row, i) => (
                                        <Stack key={i} direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="body2" color="text.secondary">{row.label}</Typography>
                                            <Typography variant="body2" sx={{fontWeight: 600}}>{sym}{Number(row.value).toFixed(2)}</Typography>
                                        </Stack>
                                    ))}
                                    <Divider/>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="subtitle2" sx={{fontWeight: 700}}>Total Refunded</Typography>
                                        <Typography variant="subtitle2" sx={{fontWeight: 700, color: "text.red"}}>{sym}{Number(r.amount || 0).toFixed(2)}</Typography>
                                    </Stack>
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default OrderRefundDetailPage;
