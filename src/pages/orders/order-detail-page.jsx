import React, {useEffect} from "react";
import {
    Avatar, Box, Button, Chip, Container, Divider, Grid, Paper,
    Stack, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Typography, LinearProgress, Alert, AlertTitle
} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchOrder, selectOrder, deleteOrder} from "../../redux/features/orders/orders-slice";
import moment from "moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import currencyFormatter from "currency-formatter";
import Status from "../../components/shared/status.jsx";

const InfoRow = ({label, value}) => (
    <Box sx={{display: "flex", gap: 1, alignItems: "flex-start", flexWrap: "wrap", py: 0.5}}>
        <Typography variant="caption" color="text.secondary" sx={{minWidth: 140, fontWeight: 600}}>
            {label}
        </Typography>
        <Typography variant="body2">{value ?? "—"}</Typography>
    </Box>
);

const OrderDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {orderID} = useParams();
    const {order, orderLoading, orderError} = useSelector(selectOrder);

    useEffect(() => {
        if (orderID) dispatch(fetchOrder(orderID));
    }, [dispatch, orderID]);

    const handleDelete = async () => {
        if (!window.confirm(`Delete order ${order?.number}? This cannot be undone.`)) return;
        await dispatch(deleteOrder(orderID));
        navigate("/orders");
    };

    const o = order || {};

    return (
        <Layout>
            {orderLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {orderError && (
                    <Alert severity="error" sx={{mb: 2}}>
                        <AlertTitle>{orderError}</AlertTitle>
                    </Alert>
                )}
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{mb: 3}}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">
                                Back
                            </Button>
                            <Typography variant="h5">
                                Order {o.number ?? `#${orderID}`}
                            </Typography>
                            {o.status && <Status status={o.status}/>}
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Link to={`/orders/${orderID}/update`} style={{textDecoration: "none"}}>
                                <Button startIcon={<EditIcon/>} variant="outlined" color="secondary" size="small">
                                    Edit
                                </Button>
                            </Link>
                            <Button startIcon={<DeleteIcon/>} variant="outlined" color="error" size="small" onClick={handleDelete}>
                                Delete
                            </Button>
                        </Stack>
                    </Stack>

                    <Grid container spacing={2}>
                        {/* Order summary */}
                        <Grid item size={{xs: 12, md: 8}}>
                            <Paper elevation={0} sx={{p: 3, mb: 2}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Order Items</Typography>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Product</TableCell>
                                                <TableCell align="center">Qty</TableCell>
                                                <TableCell align="right">Price</TableCell>
                                                <TableCell align="right">Subtotal</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {o.orderItems && o.orderItems.length > 0 ? (
                                                o.orderItems.map((item, i) => {
                                                    const product = item.product || {};
                                                    const title = product.title || product.name || "Unknown product";
                                                    const price = product.price?.amount ?? 0;
                                                    const currency = product.price?.currency ?? o.total?.currency ?? "GBP";
                                                    const subtotal = price * (item.quantity ?? 1);
                                                    return (
                                                        <TableRow key={i}>
                                                            <TableCell>
                                                                <Stack direction="row" spacing={1} alignItems="center">
                                                                    {product.image ? (
                                                                        <Avatar variant="rounded" src={product.image} sx={{width: 40, height: 40}}/>
                                                                    ) : (
                                                                        <Avatar variant="rounded" sx={{width: 40, height: 40, bgcolor: "background.default"}}>
                                                                            <Typography variant="caption" color="text.secondary">?</Typography>
                                                                        </Avatar>
                                                                    )}
                                                                    <Typography variant="body2">{title}</Typography>
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Typography variant="body2">{item.quantity ?? 1}</Typography>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Typography variant="body2">
                                                                    {currencyFormatter.format(price, {code: currency})}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Typography variant="body2">
                                                                    {currencyFormatter.format(subtotal, {code: currency})}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4}>
                                                        <Typography variant="body2" color="text.secondary" align="center">
                                                            No order items
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <Divider sx={{my: 2}}/>

                                <Stack spacing={1} alignItems="flex-end">
                                    <Stack direction="row" spacing={8} justifyContent="space-between" sx={{width: "100%", maxWidth: 320}}>
                                        <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                                        <Typography variant="body2">
                                            {o.total ? currencyFormatter.format(o.total.amount, {code: o.total.currency}) : "—"}
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={8} justifyContent="space-between" sx={{width: "100%", maxWidth: 320}}>
                                        <Typography variant="body2" color="text.secondary">Shipping</Typography>
                                        <Typography variant="body2">Free</Typography>
                                    </Stack>
                                    <Divider sx={{width: "100%", maxWidth: 320}}/>
                                    <Stack direction="row" spacing={8} justifyContent="space-between" sx={{width: "100%", maxWidth: 320}}>
                                        <Typography variant="subtitle2" fontWeight={700}>Total</Typography>
                                        <Typography variant="subtitle2" fontWeight={700}>
                                            {o.total ? currencyFormatter.format(o.total.amount, {code: o.total.currency}) : "—"}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Paper>

                            {/* Billing & Shipping */}
                            <Grid container spacing={2}>
                                <Grid item size={{xs: 12, md: 6}}>
                                    <Paper elevation={0} sx={{p: 3}}>
                                        <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Billing</Typography>
                                        <InfoRow label="Address" value={o.billing?.address}/>
                                        <InfoRow label="Payment method" value={o.billing?.method}/>
                                    </Paper>
                                </Grid>
                                <Grid item size={{xs: 12, md: 6}}>
                                    <Paper elevation={0} sx={{p: 3}}>
                                        <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Shipping</Typography>
                                        <InfoRow label="Address" value={o.shipping?.address ?? o.billing?.address ?? "Same as billing"}/>
                                        <InfoRow label="Method" value={o.shipping?.method ?? "Standard"}/>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Sidebar: order meta + customer */}
                        <Grid item size={{xs: 12, md: 4}}>
                            <Paper elevation={0} sx={{p: 3, mb: 2}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Order Details</Typography>
                                <InfoRow label="Order number" value={o.number}/>
                                <InfoRow label="Date placed" value={o.createdAt ? moment(o.createdAt).format("LLL") : "—"}/>
                                <InfoRow label="Status" value={o.status}/>
                                <InfoRow label="Payment" value={o.billing?.method}/>
                            </Paper>

                            {o.customer && (
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Customer</Typography>
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 1}}>
                                        <Avatar sx={{bgcolor: "secondary.main"}}>
                                            {(o.customer.name || "?")[0].toUpperCase()}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>{o.customer.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                ID: {o.customer._id}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                    <Link to={`/customers/${o.customer._id}`} style={{textDecoration: "none"}}>
                                        <Button size="small" variant="outlined" color="secondary" fullWidth sx={{mt: 1}}>
                                            View Customer
                                        </Button>
                                    </Link>
                                </Paper>
                            )}
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default OrderDetailPage;
