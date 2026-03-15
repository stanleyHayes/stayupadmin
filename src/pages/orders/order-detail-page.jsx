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
import currencyFormatter from "currency-formatter";
import Status from "../../components/shared/status.jsx";
import {
    ArrowBack, Edit, Delete,
    LocalShippingOutlined, PaymentOutlined, PersonOutlined,
    ReceiptOutlined, NotesOutlined, ContentCopyOutlined,
    EmailOutlined, PhoneOutlined, LocationOnOutlined,
    CheckCircleOutlined, ScheduleOutlined
} from "@mui/icons-material";

const InfoRow = ({label, value, icon}) => (
    <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{py: 0.75}}>
        {icon && <Box sx={{color: "text.muted", mt: 0.25}}>{icon}</Box>}
        <Box sx={{flex: 1}}>
            <Typography variant="caption" color="text.muted" sx={{fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em"}}>{label}</Typography>
            <Typography variant="body2" sx={{mt: 0.25}}>{value ?? "—"}</Typography>
        </Box>
    </Stack>
);

const SectionHeader = ({icon, title, action}) => (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 2}}>
        <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 0, backgroundColor: "light.secondary", color: "secondary.main"}}>
                {icon}
            </Box>
            <Typography variant="subtitle1" sx={{fontWeight: 600}}>{title}</Typography>
        </Stack>
        {action}
    </Stack>
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
    const cur = o.total?.currency ?? "GBP";
    const fmt = (v) => currencyFormatter.format(v, {code: cur});
    const itemsTotal = o.orderItems ? o.orderItems.reduce((s, i) => s + (i.product?.price?.amount ?? 0) * (i.quantity ?? 1), 0) : 0;
    const shippingFee = o.shipping?.fee ?? 0;
    const discountAmt = o.discount?.amount ?? 0;
    const taxAmt = o.tax?.amount ?? 0;

    return (
        <Layout>
            {orderLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {orderError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{orderError}</AlertTitle></Alert>}
                <Container>
                    {/* Header */}
                    <Stack direction={{xs: "column", sm: "row"}} spacing={2} alignItems={{xs: "flex-start", sm: "center"}} justifyContent="space-between" sx={{mb: 4}}>
                        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                            <Button startIcon={<ArrowBack/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                            <Typography variant="h5" sx={{fontWeight: 700}}>Order {o.number ?? `#${orderID}`}</Typography>
                            {o.status && <Status status={o.status}/>}
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Link to={`/orders/${orderID}/update`} style={{textDecoration: "none"}}>
                                <Button startIcon={<Edit/>} variant="contained" color="secondary" size="small">Edit Order</Button>
                            </Link>
                            <Button startIcon={<Delete/>} variant="outlined" color="error" size="small" onClick={handleDelete}>Delete</Button>
                        </Stack>
                    </Stack>

                    {/* Timeline bar */}
                    <Paper elevation={0} sx={{p: 2.5, mb: 3}}>
                        <Stack direction={{xs: "column", sm: "row"}} spacing={3} divider={<Divider orientation="vertical" flexItem/>}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <ScheduleOutlined sx={{fontSize: 18, color: "text.muted"}}/>
                                <Box>
                                    <Typography variant="caption" color="text.muted">Placed</Typography>
                                    <Typography variant="body2" sx={{fontWeight: 500}}>{o.createdAt ? moment(o.createdAt).format("MMM D, YYYY [at] h:mm A") : "—"}</Typography>
                                </Box>
                            </Stack>
                            {o.shipping?.shipped_at && (
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <LocalShippingOutlined sx={{fontSize: 18, color: "text.blue"}}/>
                                    <Box>
                                        <Typography variant="caption" color="text.muted">Shipped</Typography>
                                        <Typography variant="body2" sx={{fontWeight: 500}}>{moment(o.shipping.shipped_at).format("MMM D, YYYY [at] h:mm A")}</Typography>
                                    </Box>
                                </Stack>
                            )}
                            {o.shipping?.delivered_at && (
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <CheckCircleOutlined sx={{fontSize: 18, color: "text.green"}}/>
                                    <Box>
                                        <Typography variant="caption" color="text.muted">Delivered</Typography>
                                        <Typography variant="body2" sx={{fontWeight: 500}}>{moment(o.shipping.delivered_at).format("MMM D, YYYY [at] h:mm A")}</Typography>
                                    </Box>
                                </Stack>
                            )}
                            {o.updatedAt && o.updatedAt !== o.createdAt && (
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <ScheduleOutlined sx={{fontSize: 18, color: "text.orange"}}/>
                                    <Box>
                                        <Typography variant="caption" color="text.muted">Last Updated</Typography>
                                        <Typography variant="body2" sx={{fontWeight: 500}}>{moment(o.updatedAt).format("MMM D, YYYY [at] h:mm A")}</Typography>
                                    </Box>
                                </Stack>
                            )}
                        </Stack>
                    </Paper>

                    <Grid container spacing={3}>
                        {/* LEFT COLUMN */}
                        <Grid size={{xs: 12, md: 8}}>
                            {/* Order Items */}
                            <Paper elevation={0} sx={{p: 3, mb: 3}}>
                                <SectionHeader icon={<ReceiptOutlined fontSize="small"/>} title={`Items (${o.orderItems?.length || 0})`}/>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Product</TableCell>
                                                <TableCell>SKU</TableCell>
                                                <TableCell align="center">Qty</TableCell>
                                                <TableCell align="right">Price</TableCell>
                                                <TableCell align="right">Total</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {o.orderItems && o.orderItems.length > 0 ? (
                                                o.orderItems.map((item, i) => {
                                                    const p = item.product || {};
                                                    const price = p.price?.amount ?? 0;
                                                    const subtotal = price * (item.quantity ?? 1);
                                                    return (
                                                        <TableRow key={i}>
                                                            <TableCell>
                                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                                    <Avatar variant="rounded" src={p.image} sx={{width: 44, height: 44, bgcolor: "background.alternative"}}/>
                                                                    <Typography variant="body2" sx={{fontWeight: 500}}>{p.title || "Unknown"}</Typography>
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="caption" color="text.secondary" sx={{fontFamily: "monospace"}}>{p.sku || "—"}</Typography>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Chip label={item.quantity ?? 1} size="small" variant="outlined"/>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Typography variant="body2">{fmt(price)}</Typography>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Typography variant="body2" sx={{fontWeight: 600}}>{fmt(subtotal)}</Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5}>
                                                        <Typography variant="body2" color="text.secondary" align="center">No items</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                {/* Price Summary */}
                                <Divider sx={{my: 2}}/>
                                <Stack spacing={1} sx={{maxWidth: 360, ml: "auto"}}>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                                        <Typography variant="body2">{fmt(itemsTotal)}</Typography>
                                    </Stack>
                                    {shippingFee > 0 && (
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">Shipping ({o.shipping?.method})</Typography>
                                            <Typography variant="body2">{fmt(shippingFee)}</Typography>
                                        </Stack>
                                    )}
                                    {shippingFee === 0 && (
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">Shipping</Typography>
                                            <Typography variant="body2" sx={{color: "text.green"}}>Free</Typography>
                                        </Stack>
                                    )}
                                    {discountAmt > 0 && (
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">
                                                Discount {o.discount?.code && <Chip label={o.discount.code} size="small" variant="outlined" color="secondary" sx={{ml: 0.5, height: 20, fontSize: 10}}/>}
                                            </Typography>
                                            <Typography variant="body2" sx={{color: "text.green"}}>-{fmt(discountAmt)}</Typography>
                                        </Stack>
                                    )}
                                    {taxAmt > 0 && (
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">Tax ({o.tax?.rate}%)</Typography>
                                            <Typography variant="body2">{fmt(taxAmt)}</Typography>
                                        </Stack>
                                    )}
                                    <Divider/>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="subtitle2" sx={{fontWeight: 700}}>Total</Typography>
                                        <Typography variant="subtitle2" sx={{fontWeight: 700, color: "secondary.main"}}>{o.total ? fmt(o.total.amount) : "—"}</Typography>
                                    </Stack>
                                </Stack>
                            </Paper>

                            {/* Billing & Shipping - side by side */}
                            <Grid container spacing={3} sx={{mb: 3}}>
                                <Grid size={{xs: 12, md: 6}}>
                                    <Paper elevation={0} sx={{p: 3, height: "100%"}}>
                                        <SectionHeader icon={<PaymentOutlined fontSize="small"/>} title="Billing"/>
                                        <InfoRow label="Name" value={o.billing?.name} icon={<PersonOutlined sx={{fontSize: 16}}/>}/>
                                        <InfoRow label="Email" value={o.billing?.email} icon={<EmailOutlined sx={{fontSize: 16}}/>}/>
                                        <InfoRow label="Phone" value={o.billing?.phone} icon={<PhoneOutlined sx={{fontSize: 16}}/>}/>
                                        <InfoRow label="Address" value={o.billing?.address} icon={<LocationOnOutlined sx={{fontSize: 16}}/>}/>
                                        <Divider sx={{my: 1.5}}/>
                                        <InfoRow label="Payment Method" value={o.billing?.method} icon={<PaymentOutlined sx={{fontSize: 16}}/>}/>
                                        {o.billing?.transaction_id && (
                                            <InfoRow label="Transaction ID" value={
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <Typography variant="body2" sx={{fontFamily: "monospace", fontSize: 12}}>{o.billing.transaction_id}</Typography>
                                                    <ContentCopyOutlined sx={{fontSize: 14, color: "text.muted", cursor: "pointer"}}/>
                                                </Stack>
                                            }/>
                                        )}
                                    </Paper>
                                </Grid>
                                <Grid size={{xs: 12, md: 6}}>
                                    <Paper elevation={0} sx={{p: 3, height: "100%"}}>
                                        <SectionHeader icon={<LocalShippingOutlined fontSize="small"/>} title="Shipping"/>
                                        <InfoRow label="Recipient" value={o.shipping?.name} icon={<PersonOutlined sx={{fontSize: 16}}/>}/>
                                        <InfoRow label="Address" value={o.shipping?.address} icon={<LocationOnOutlined sx={{fontSize: 16}}/>}/>
                                        <InfoRow label="Method" value={o.shipping?.method}/>
                                        <InfoRow label="Carrier" value={o.shipping?.carrier || "—"}/>
                                        {o.shipping?.tracking_number && (
                                            <InfoRow label="Tracking Number" value={
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <Typography variant="body2" sx={{fontFamily: "monospace", fontSize: 12, color: "secondary.main"}}>{o.shipping.tracking_number}</Typography>
                                                    <ContentCopyOutlined sx={{fontSize: 14, color: "text.muted", cursor: "pointer"}}/>
                                                </Stack>
                                            }/>
                                        )}
                                        <InfoRow label="Shipping Fee" value={shippingFee > 0 ? fmt(shippingFee) : "Free"}/>
                                    </Paper>
                                </Grid>
                            </Grid>

                            {/* Order Notes */}
                            {o.notes && (
                                <Paper elevation={0} sx={{p: 3}}>
                                    <SectionHeader icon={<NotesOutlined fontSize="small"/>} title="Order Notes"/>
                                    <Typography variant="body2" sx={{lineHeight: 1.7, whiteSpace: "pre-wrap"}}>{o.notes}</Typography>
                                </Paper>
                            )}
                        </Grid>

                        {/* RIGHT COLUMN */}
                        <Grid size={{xs: 12, md: 4}}>
                            {/* Order Summary Card */}
                            <Paper elevation={0} sx={{p: 3, mb: 3, borderColor: "border.secondary", borderWidth: 1.5, borderStyle: "solid"}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Order Summary</Typography>
                                <Stack spacing={1.5}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="caption" color="text.secondary">Order Number</Typography>
                                        <Typography variant="body2" sx={{fontWeight: 600, fontFamily: "monospace"}}>{o.number || "—"}</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="caption" color="text.secondary">Status</Typography>
                                        {o.status ? <Status status={o.status}/> : <Typography variant="body2">—</Typography>}
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="caption" color="text.secondary">Payment</Typography>
                                        <Typography variant="body2">{o.billing?.method || "—"}</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="caption" color="text.secondary">Items</Typography>
                                        <Typography variant="body2">{o.orderItems?.length || 0} products</Typography>
                                    </Stack>
                                    <Divider/>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="subtitle2" sx={{fontWeight: 700}}>Total</Typography>
                                        <Typography variant="subtitle2" sx={{fontWeight: 700, color: "secondary.main", fontSize: 16}}>{o.total ? fmt(o.total.amount) : "—"}</Typography>
                                    </Stack>
                                </Stack>
                            </Paper>

                            {/* Customer Card */}
                            {o.customer && (
                                <Paper elevation={0} sx={{p: 3, mb: 3}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Customer</Typography>
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 2}}>
                                        <Avatar src={o.customer.image} sx={{width: 48, height: 48, bgcolor: "secondary.main", fontSize: 18}}>
                                            {(o.customer.name || "?")[0].toUpperCase()}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" sx={{fontWeight: 600}}>{o.customer.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{o.customer.email || ""}</Typography>
                                        </Box>
                                    </Stack>
                                    {o.billing?.email && (
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 0.5}}>
                                            <EmailOutlined sx={{fontSize: 14, color: "text.muted"}}/>
                                            <Typography variant="caption" color="text.secondary">{o.billing.email}</Typography>
                                        </Stack>
                                    )}
                                    {o.billing?.phone && (
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 1.5}}>
                                            <PhoneOutlined sx={{fontSize: 14, color: "text.muted"}}/>
                                            <Typography variant="caption" color="text.secondary">{o.billing.phone}</Typography>
                                        </Stack>
                                    )}
                                    <Link to={`/customers/${o.customer._id}`} style={{textDecoration: "none"}}>
                                        <Button size="small" variant="outlined" color="secondary" fullWidth>View Customer Profile</Button>
                                    </Link>
                                </Paper>
                            )}

                            {/* Actions Card */}
                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Actions</Typography>
                                <Stack spacing={1.5}>
                                    <Link to={`/orders/${orderID}/update`} style={{textDecoration: "none"}}>
                                        <Button variant="outlined" color="secondary" size="small" fullWidth startIcon={<Edit/>}>Edit Order</Button>
                                    </Link>
                                    <Link to="/order-note/new" style={{textDecoration: "none"}}>
                                        <Button variant="outlined" color="secondary" size="small" fullWidth startIcon={<NotesOutlined/>}>Add Note</Button>
                                    </Link>
                                    <Link to="/order-refund/new" style={{textDecoration: "none"}}>
                                        <Button variant="outlined" color="warning" size="small" fullWidth startIcon={<PaymentOutlined/>}>Issue Refund</Button>
                                    </Link>
                                    <Button variant="outlined" color="error" size="small" fullWidth startIcon={<Delete/>} onClick={handleDelete}>Delete Order</Button>
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default OrderDetailPage;
