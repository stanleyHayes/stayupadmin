import React, {useEffect, useState} from "react";
import {
    Avatar, Box, Button, Chip, Container, Divider, FormControl, Grid,
    InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography,
    LinearProgress, Alert, AlertTitle, Snackbar
} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchOrder, updateOrder, selectOrder, deleteOrder} from "../../redux/features/orders/orders-slice";
import {fetchCouriers, selectCouriers} from "../../redux/features/couriers/couriers-slice";
import moment from "moment";
import Status from "../../components/shared/status.jsx";
import {
    ArrowBack, Edit, Delete, PrintOutlined,
    LocalShippingOutlined, PaymentOutlined, PersonOutlined,
    ReceiptOutlined, NotesOutlined, ContentCopy,
    EmailOutlined, PhoneOutlined, LocationOnOutlined,
    CheckCircleOutlined, ScheduleOutlined, InventoryOutlined,
    TagOutlined, StorefrontOutlined
} from "@mui/icons-material";
import {DetailSkeleton} from "../../components/shared/page-skeleton.jsx";

// Resolve customer
const resolveCustomer = (o) => {
    const c = o?.customer_id ?? o?.customer;
    if (!c) return null;
    if (typeof c === "object" && c !== null) {
        return {
            _id: c._id || c.id,
            name: c.display_name || c.name || (c.first_name ? `${c.first_name} ${c.last_name || ""}`.trim() : c.email || "—"),
            email: c.email,
            phone: c.phone,
            avatar: c.avatar_url || c.image,
        };
    }
    return {_id: c, name: `#${String(c).slice(-6)}`, email: null, phone: null, avatar: null};
};

const fmtCurrency = (amount, currency = "GHS") => {
    const sym = currency === "GHS" ? "GH₵" : currency === "USD" ? "$" : currency === "EUR" ? "€" : "£";
    return `${sym}${Number(amount || 0).toFixed(2)}`;
};

const fmtAddress = (addr) => {
    if (!addr) return null;
    const parts = [
        addr.address_1,
        addr.address_2,
        [addr.city, addr.state].filter(Boolean).join(", "),
        addr.postcode,
        addr.country
    ].filter(Boolean);
    return parts.length > 0 ? parts.join("\n") : null;
};

const statusSteps = ["pending", "processing", "shipped", "in-transit", "delivered", "completed"];
const allStatuses = ["pending", "processing", "on-hold", "shipped", "in-transit", "delivered", "completed", "cancelled", "refunded", "failed", "trash"];
const shippingStatuses = ["pending", "shipped", "in_transit", "out_for_delivery", "delivered"];

const OrderDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {orderID} = useParams();
    const {order, orderLoading, orderError} = useSelector(selectOrder);
    const {couriers} = useSelector(selectCouriers);
    const [copied, setCopied] = useState(false);
    const [statusValue, setStatusValue] = useState("");
    const [courierValue, setCourierValue] = useState("");
    const [trackingNumber, setTrackingNumber] = useState("");
    const [estimatedDelivery, setEstimatedDelivery] = useState("");

    useEffect(() => {
        if (orderID) dispatch(fetchOrder(orderID));
        dispatch(fetchCouriers());
    }, [dispatch, orderID]);

    useEffect(() => {
        if (order?.status) setStatusValue(order.status);
        // courier can be a populated object or an ID string
        const cid = typeof order?.courier === "object" ? (order.courier?._id || order.courier?.id) : order?.courier;
        if (cid) setCourierValue(String(cid));
        if (order?.tracking_number) setTrackingNumber(order.tracking_number);
        if (order?.estimated_delivery) setEstimatedDelivery(order.estimated_delivery?.split("T")[0] || "");
    }, [order]);

    const handleDelete = async () => {
        if (!window.confirm(`Delete order ${order?.number}? This cannot be undone.`)) return;
        await dispatch(deleteOrder(orderID));
        navigate("/orders");
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
    };

    if (orderLoading && !order) return <Layout><Box sx={{pt: 4, pb: 6}}><DetailSkeleton/></Box></Layout>;

    const o = order || {};
    const cur = o.currency || "GHS";
    const fmt = (v) => fmtCurrency(v, cur);
    const customer = resolveCustomer(o);
    const items = o.line_items || o.orderItems || [];
    const dateCreated = o.date_created || o.created_at || o.createdAt;
    const dateModified = o.date_modified || o.updated_at || o.updatedAt;

    const subtotal = items.reduce((s, i) => s + Number(i.subtotal || 0), 0);
    const shippingTotal = Number(o.shipping_total || 0);
    const discountTotal = Number(o.discount_total || 0);
    const taxTotal = Number(o.total_tax || 0);
    const grandTotal = Number(o.total || 0);

    const currentStep = statusSteps.indexOf(o.status);

    return (
        <Layout>
            {orderLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {orderError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{orderError}</AlertTitle></Alert>}
                <Container>
                    {/* Header */}
                    <Stack direction={{xs: "column", sm: "row"}} spacing={2} alignItems={{xs: "flex-start", sm: "center"}} justifyContent="space-between" sx={{mb: 3}}>
                        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                            <Button startIcon={<ArrowBack/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                            <Box>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Typography variant="h5" sx={{fontWeight: 800}}>#{o.number || orderID}</Typography>
                                    {o.status && <Status status={o.status}/>}
                                    {o.set_paid && <Chip label="Paid" size="small" color="success" sx={{height: 20, fontSize: 10}}/>}
                                </Stack>
                                <Typography variant="caption" color="text.secondary">
                                    {dateCreated ? `Placed ${moment(dateCreated).format("MMM D, YYYY [at] h:mm A")}` : ""}
                                    {o.created_via && ` via ${o.created_via}`}
                                </Typography>
                            </Box>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Button startIcon={<PrintOutlined/>} variant="outlined" size="small" onClick={() => window.print()}>Print</Button>
                            <Link to={`/orders/${orderID}/update`} style={{textDecoration: "none"}}>
                                <Button startIcon={<Edit/>} variant="contained" color="secondary" size="small">Edit</Button>
                            </Link>
                            <Button startIcon={<Delete/>} variant="outlined" color="error" size="small" onClick={handleDelete}>Delete</Button>
                        </Stack>
                    </Stack>

                    {/* Status Progress */}
                    {currentStep >= 0 && (
                        <Paper elevation={0} sx={{p: 2.5, mb: 3}}>
                            <Stack direction="row" spacing={0} alignItems="center">
                                {statusSteps.map((step, i) => (
                                    <React.Fragment key={step}>
                                        <Stack alignItems="center" spacing={0.5} sx={{flex: 0, minWidth: 80}}>
                                            <Box sx={{
                                                width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                                                backgroundColor: i <= currentStep ? "secondary.main" : "action.hover",
                                                color: i <= currentStep ? "#fff" : "text.muted",
                                                transition: "all 0.3s"
                                            }}>
                                                {i <= currentStep ? <CheckCircleOutlined sx={{fontSize: 16}}/> : <Typography sx={{fontSize: 11, fontWeight: 700}}>{i + 1}</Typography>}
                                            </Box>
                                            <Typography variant="caption" sx={{
                                                fontSize: 10, fontWeight: i <= currentStep ? 600 : 400,
                                                color: i <= currentStep ? "text.primary" : "text.muted",
                                                textTransform: "capitalize"
                                            }}>{step.replace(/[-_]/g, " ")}</Typography>
                                        </Stack>
                                        {i < statusSteps.length - 1 && (
                                            <Box sx={{flex: 1, height: 2, backgroundColor: i < currentStep ? "secondary.main" : "action.hover", transition: "all 0.3s"}}/>
                                        )}
                                    </React.Fragment>
                                ))}
                            </Stack>
                        </Paper>
                    )}

                    <Grid container spacing={3}>
                        {/* LEFT COLUMN */}
                        <Grid size={{xs: 12, md: 8}}>

                            {/* Line Items */}
                            <Paper elevation={0} sx={{mb: 3, overflow: "hidden"}}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{px: 3, pt: 2.5, pb: 1.5}}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <InventoryOutlined sx={{fontSize: 18, color: "secondary.main"}}/>
                                        <Typography variant="subtitle1" sx={{fontWeight: 700}}>Items</Typography>
                                        <Chip label={items.length} size="small" color="secondary" sx={{height: 20, fontSize: 11, fontWeight: 700}}/>
                                    </Stack>
                                </Stack>

                                {items.length > 0 ? items.map((item, i) => {
                                    const unitPrice = Number(item.price || 0);
                                    const qty = Number(item.quantity || 1);
                                    const lineTotal = Number(item.total || item.subtotal || (unitPrice * qty));
                                    return (
                                        <Box key={i} sx={{px: 3, py: 2, borderTop: 1, borderColor: "divider", "&:hover": {backgroundColor: "action.hover"}}}>
                                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                                <Box sx={{
                                                    width: 48, height: 48, borderRadius: 1, overflow: "hidden",
                                                    backgroundColor: "background.alternative", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                                                }}>
                                                    <StorefrontOutlined sx={{fontSize: 20, color: "text.muted"}}/>
                                                </Box>
                                                <Box sx={{flex: 1, minWidth: 0}}>
                                                    <Typography variant="body2" sx={{fontWeight: 600, mb: 0.25}}>{item.name || "Unknown product"}</Typography>
                                                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                                        {item.sku && (
                                                            <Chip label={`SKU: ${item.sku}`} size="small" variant="outlined" sx={{height: 18, fontSize: 10, fontFamily: "monospace"}}/>
                                                        )}
                                                        <Typography variant="caption" color="text.secondary">
                                                            {fmt(unitPrice)} x {qty}
                                                        </Typography>
                                                        {Number(item.total_tax || 0) > 0 && (
                                                            <Typography variant="caption" color="text.muted">
                                                                (tax: {fmt(item.total_tax)})
                                                            </Typography>
                                                        )}
                                                    </Stack>
                                                </Box>
                                                <Box sx={{textAlign: "right", flexShrink: 0}}>
                                                    <Typography variant="body2" sx={{fontWeight: 700}}>{fmt(lineTotal)}</Typography>
                                                    {qty > 1 && <Typography variant="caption" color="text.secondary">each {fmt(unitPrice)}</Typography>}
                                                </Box>
                                            </Stack>
                                        </Box>
                                    );
                                }) : (
                                    <Box sx={{p: 4, textAlign: "center", borderTop: 1, borderColor: "divider"}}>
                                        <Typography variant="body2" color="text.secondary">No items in this order</Typography>
                                    </Box>
                                )}

                                {/* Totals */}
                                <Box sx={{backgroundColor: "background.alternative", px: 3, py: 2.5}}>
                                    <Stack spacing={1} sx={{maxWidth: 320, ml: "auto"}}>
                                        {[
                                            {label: "Subtotal", value: fmt(subtotal)},
                                            shippingTotal > 0
                                                ? {label: `Shipping${o.shipping_lines?.[0]?.method_title ? ` (${o.shipping_lines[0].method_title})` : ""}`, value: fmt(shippingTotal)}
                                                : {label: "Shipping", value: null, chip: "Free"},
                                            discountTotal > 0 ? {label: "Discount", value: `-${fmt(discountTotal)}`, color: "text.green"} : null,
                                            taxTotal > 0 ? {label: `Tax${o.prices_include_tax ? " (incl.)" : ""}`, value: fmt(taxTotal)} : null,
                                        ].filter(Boolean).map((row, i) => (
                                            <Stack key={i} direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography variant="body2" color="text.secondary">{row.label}</Typography>
                                                {row.chip
                                                    ? <Chip label={row.chip} size="small" color="success" variant="outlined" sx={{height: 20, fontSize: 10}}/>
                                                    : <Typography variant="body2" sx={{fontWeight: 500, color: row.color || "text.primary"}}>{row.value}</Typography>
                                                }
                                            </Stack>
                                        ))}
                                        <Divider/>
                                        <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                                            <Typography variant="subtitle2" sx={{fontWeight: 700}}>Total</Typography>
                                            <Stack alignItems="flex-end">
                                                <Typography variant="h5" sx={{fontWeight: 800, color: "secondary.main", lineHeight: 1}}>{fmt(grandTotal)}</Typography>
                                                <Typography variant="caption" color="text.muted">{cur}</Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Box>
                            </Paper>

                            {/* Billing & Shipping */}
                            <Grid container spacing={3} sx={{mb: 3}}>
                                <Grid size={{xs: 12, md: 6}}>
                                    <Paper elevation={0} sx={{p: 0, height: "100%", overflow: "hidden"}}>
                                        <Box sx={{px: 2.5, py: 2, backgroundColor: "background.alternative"}}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <PaymentOutlined sx={{fontSize: 16, color: "secondary.main"}}/>
                                                <Typography variant="subtitle2" sx={{fontWeight: 700}}>Billing Details</Typography>
                                            </Stack>
                                        </Box>
                                        <Stack spacing={2} sx={{p: 2.5}}>
                                            <Box>
                                                <Typography variant="body2" sx={{fontWeight: 600}}>
                                                    {o.billing?.name || (o.billing?.first_name ? `${o.billing.first_name} ${o.billing.last_name || ""}`.trim() : "—")}
                                                </Typography>
                                                {o.billing?.company && <Typography variant="caption" color="text.secondary">{o.billing.company}</Typography>}
                                            </Box>
                                            {fmtAddress(o.billing) && (
                                                <Stack direction="row" spacing={1} alignItems="flex-start">
                                                    <LocationOnOutlined sx={{fontSize: 14, color: "text.muted", mt: 0.25}}/>
                                                    <Typography variant="caption" color="text.secondary" sx={{whiteSpace: "pre-line"}}>{fmtAddress(o.billing)}</Typography>
                                                </Stack>
                                            )}
                                            {o.billing?.email && (
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <EmailOutlined sx={{fontSize: 14, color: "text.muted"}}/>
                                                    <Typography variant="caption" color="text.secondary">{o.billing.email}</Typography>
                                                </Stack>
                                            )}
                                            {o.billing?.phone && (
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <PhoneOutlined sx={{fontSize: 14, color: "text.muted"}}/>
                                                    <Typography variant="caption" color="text.secondary">{o.billing.phone}</Typography>
                                                </Stack>
                                            )}
                                            {(o.payment_method_title || o.payment_method) && (
                                                <>
                                                    <Divider/>
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                        <Typography variant="caption" color="text.secondary">Payment method</Typography>
                                                        <Chip label={o.payment_method_title || o.payment_method} size="small" variant="outlined" sx={{height: 22, fontSize: 11}}/>
                                                    </Stack>
                                                </>
                                            )}
                                            {o.transaction_id && (
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="caption" color="text.secondary">Transaction</Typography>
                                                    <Stack direction="row" spacing={0.5} alignItems="center" onClick={() => handleCopy(o.transaction_id)} sx={{cursor: "pointer"}}>
                                                        <Typography variant="caption" sx={{fontFamily: "monospace", fontSize: 11}}>{o.transaction_id}</Typography>
                                                        <ContentCopy sx={{fontSize: 12, color: "text.muted"}}/>
                                                    </Stack>
                                                </Stack>
                                            )}
                                        </Stack>
                                    </Paper>
                                </Grid>
                                <Grid size={{xs: 12, md: 6}}>
                                    <Paper elevation={0} sx={{p: 0, height: "100%", overflow: "hidden"}}>
                                        <Box sx={{px: 2.5, py: 2, backgroundColor: "background.alternative"}}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <LocalShippingOutlined sx={{fontSize: 16, color: "secondary.main"}}/>
                                                <Typography variant="subtitle2" sx={{fontWeight: 700}}>Shipping Details</Typography>
                                            </Stack>
                                        </Box>
                                        <Stack spacing={2} sx={{p: 2.5}}>
                                            <Box>
                                                <Typography variant="body2" sx={{fontWeight: 600}}>
                                                    {o.shipping?.name || (o.shipping?.first_name ? `${o.shipping.first_name} ${o.shipping.last_name || ""}`.trim() : "—")}
                                                </Typography>
                                                {o.shipping?.company && <Typography variant="caption" color="text.secondary">{o.shipping.company}</Typography>}
                                            </Box>
                                            {fmtAddress(o.shipping) && (
                                                <Stack direction="row" spacing={1} alignItems="flex-start">
                                                    <LocationOnOutlined sx={{fontSize: 14, color: "text.muted", mt: 0.25}}/>
                                                    <Typography variant="caption" color="text.secondary" sx={{whiteSpace: "pre-line"}}>{fmtAddress(o.shipping)}</Typography>
                                                </Stack>
                                            )}
                                            {o.shipping_lines && o.shipping_lines.length > 0 && (
                                                <>
                                                    <Divider/>
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                        <Typography variant="caption" color="text.secondary">Method</Typography>
                                                        <Typography variant="body2" sx={{fontWeight: 500}}>{o.shipping_lines[0].method_title}</Typography>
                                                    </Stack>
                                                </>
                                            )}
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography variant="caption" color="text.secondary">Cost</Typography>
                                                {shippingTotal > 0
                                                    ? <Typography variant="body2" sx={{fontWeight: 500}}>{fmt(shippingTotal)}</Typography>
                                                    : <Chip label="Free" size="small" color="success" variant="outlined" sx={{height: 20, fontSize: 10}}/>
                                                }
                                            </Stack>
                                        </Stack>
                                    </Paper>
                                </Grid>
                            </Grid>

                            {/* Coupon Lines */}
                            {o.coupon_lines && o.coupon_lines.length > 0 && (
                                <Paper elevation={0} sx={{p: 3, mb: 3}}>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 2}}>
                                        <TagOutlined sx={{fontSize: 16, color: "secondary.main"}}/>
                                        <Typography variant="subtitle2" sx={{fontWeight: 700}}>Coupons Applied</Typography>
                                    </Stack>
                                    <Stack spacing={1}>
                                        {o.coupon_lines.map((c, i) => (
                                            <Stack key={i} direction="row" justifyContent="space-between" alignItems="center" sx={{py: 0.5}}>
                                                <Chip label={c.code} size="small" color="secondary" variant="outlined" sx={{fontFamily: "monospace", fontWeight: 600}}/>
                                                <Typography variant="body2" sx={{color: "text.green", fontWeight: 600}}>-{fmt(c.discount)}</Typography>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </Paper>
                            )}

                            {/* Customer Note */}
                            {o.customer_note && (
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 1.5}}>
                                        <NotesOutlined sx={{fontSize: 16, color: "secondary.main"}}/>
                                        <Typography variant="subtitle2" sx={{fontWeight: 700}}>Customer Note</Typography>
                                    </Stack>
                                    <Box sx={{p: 2, backgroundColor: "background.alternative"}}>
                                        <Typography variant="body2" sx={{lineHeight: 1.7, whiteSpace: "pre-wrap", fontStyle: "italic"}}>{o.customer_note}</Typography>
                                    </Box>
                                </Paper>
                            )}
                        </Grid>

                        {/* RIGHT COLUMN */}
                        <Grid size={{xs: 12, md: 4}}>
                            {/* Customer Card */}
                            {customer && (
                                <Paper elevation={0} sx={{mb: 3, overflow: "hidden"}}>
                                    <Box sx={{background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)", p: 2.5, pb: 4}}/>
                                    <Box sx={{px: 2.5, pb: 2.5, mt: -3}}>
                                        <Avatar src={customer.avatar} sx={{width: 56, height: 56, mb: 1.5, fontSize: 22, fontWeight: 700, bgcolor: "secondary.dark", color: "#fff", border: "3px solid", borderColor: "background.paper"}}>
                                            {(customer.name || "?")[0].toUpperCase()}
                                        </Avatar>
                                        <Typography variant="body1" sx={{fontWeight: 700}}>{customer.name}</Typography>
                                        {customer.email && (
                                            <Stack direction="row" spacing={0.5} alignItems="center" sx={{mt: 0.5}}>
                                                <EmailOutlined sx={{fontSize: 13, color: "text.muted"}}/>
                                                <Typography variant="caption" color="text.secondary">{customer.email}</Typography>
                                            </Stack>
                                        )}
                                        {customer.phone && (
                                            <Stack direction="row" spacing={0.5} alignItems="center" sx={{mt: 0.25}}>
                                                <PhoneOutlined sx={{fontSize: 13, color: "text.muted"}}/>
                                                <Typography variant="caption" color="text.secondary">{customer.phone}</Typography>
                                            </Stack>
                                        )}
                                        {customer._id && (
                                            <Link to={`/customers/${customer._id}`} style={{textDecoration: "none"}}>
                                                <Button size="small" variant="outlined" color="secondary" fullWidth sx={{mt: 2}}>View Profile</Button>
                                            </Link>
                                        )}
                                    </Box>
                                </Paper>
                            )}

                            {/* Shipping & Tracking Card */}
                            {(o.courier || o.courier_name || o.tracking_number || o.shipping_status || o.date_shipped) && (() => {
                                const courierObj = typeof o.courier === "object" ? o.courier : null;
                                const courierName = courierObj?.name || o.courier_name || (typeof o.courier === "string" ? o.courier : null);
                                return (
                                <Paper elevation={0} sx={{p: 2.5, mb: 3}}>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 2}}>
                                        <LocalShippingOutlined sx={{fontSize: 16, color: "secondary.main"}}/>
                                        <Typography variant="subtitle2" sx={{fontWeight: 700}}>Shipping & Tracking</Typography>
                                    </Stack>
                                    <Stack spacing={1.5}>
                                        {o.shipping_status && (
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography variant="caption" color="text.secondary">Shipping Status</Typography>
                                                <Status status={o.shipping_status}/>
                                            </Stack>
                                        )}
                                        {courierName && (
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography variant="caption" color="text.secondary">Courier</Typography>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    {courierObj?.logo && <Avatar src={courierObj.logo} sx={{width: 20, height: 20}}/>}
                                                    <Chip label={courierName} size="small" variant="outlined" sx={{fontWeight: 600}}/>
                                                </Stack>
                                            </Stack>
                                        )}
                                        {courierObj?.phone && (
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography variant="caption" color="text.secondary">Courier Phone</Typography>
                                                <Typography variant="body2" component="a" href={`tel:${courierObj.phone}`} sx={{color: "secondary.main", fontSize: 12, textDecoration: "none"}}>{courierObj.phone}</Typography>
                                            </Stack>
                                        )}
                                        {o.tracking_number && (
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography variant="caption" color="text.secondary">Tracking #</Typography>
                                                <Stack direction="row" spacing={0.5} alignItems="center" onClick={() => handleCopy(o.tracking_number)} sx={{cursor: "pointer"}}>
                                                    <Typography variant="body2" sx={{fontFamily: "monospace", fontSize: 12, fontWeight: 600}}>{o.tracking_number}</Typography>
                                                    <ContentCopy sx={{fontSize: 12, color: "text.muted"}}/>
                                                </Stack>
                                            </Stack>
                                        )}
                                        {o.tracking_url && (
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography variant="caption" color="text.secondary">Track Package</Typography>
                                                <Typography variant="body2" component="a" href={o.tracking_url} target="_blank" rel="noopener" sx={{color: "secondary.main", fontWeight: 500, fontSize: 12}}>Open Tracker</Typography>
                                            </Stack>
                                        )}
                                        {o.date_shipped && (
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="caption" color="text.secondary">Shipped</Typography>
                                                <Typography variant="body2">{moment(o.date_shipped).format("MMM D, h:mm A")}</Typography>
                                            </Stack>
                                        )}
                                        {o.estimated_delivery && (
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="caption" color="text.secondary">Est. Delivery</Typography>
                                                <Typography variant="body2">{moment(o.estimated_delivery).format("MMM D, YYYY")}</Typography>
                                            </Stack>
                                        )}
                                        {o.date_delivered && (
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="caption" color="text.secondary">Delivered</Typography>
                                                <Typography variant="body2">{moment(o.date_delivered).format("MMM D, h:mm A")}</Typography>
                                            </Stack>
                                        )}
                                    </Stack>
                                </Paper>
                                );
                            })()}

                            {/* Order Info Card */}
                            <Paper elevation={0} sx={{p: 2.5, mb: 3}}>
                                <Typography variant="subtitle2" sx={{fontWeight: 700, mb: 2}}>Order Info</Typography>
                                <Stack spacing={1.5}>
                                    {[
                                        {label: "Order #", val: o.number},
                                        o.order_key && {label: "Key", val: <Typography variant="caption" sx={{fontFamily: "monospace", fontSize: 10, wordBreak: "break-all"}}>{o.order_key}</Typography>},
                                        {label: "Status", val: o.status ? <Status status={o.status}/> : "—"},
                                        {label: "Currency", val: <Chip label={cur} size="small" variant="outlined" sx={{height: 20, fontSize: 10}}/>},
                                        {label: "Payment", val: o.payment_method_title || o.payment_method || "—"},
                                        {label: "Items", val: `${items.length} product${items.length !== 1 ? "s" : ""}`},
                                        o.created_via && {label: "Source", val: <Chip label={o.created_via} size="small" variant="outlined" sx={{height: 20, fontSize: 10, textTransform: "capitalize"}}/>},
                                        dateCreated && {label: "Created", val: moment(dateCreated).format("MMM D, YYYY")},
                                        dateModified && {label: "Updated", val: moment(dateModified).format("MMM D, YYYY")},
                                        o.date_paid && {label: "Paid", val: moment(o.date_paid).format("MMM D, YYYY")},
                                    ].filter(Boolean).map((row, i) => (
                                        <Stack key={i} direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="caption" color="text.secondary">{row.label}</Typography>
                                            <Typography variant="body2" component="div" sx={{fontWeight: 500, textAlign: "right"}}>{row.val}</Typography>
                                        </Stack>
                                    ))}
                                    <Divider/>
                                    <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                                        <Typography variant="subtitle2" sx={{fontWeight: 700}}>Total</Typography>
                                        <Typography variant="h6" sx={{fontWeight: 800, color: "secondary.main"}}>{fmt(grandTotal)}</Typography>
                                    </Stack>
                                </Stack>
                            </Paper>

                            {/* Update Status & Shipping */}
                            <Paper elevation={0} sx={{p: 2.5, mb: 3}}>
                                <Typography variant="subtitle2" sx={{fontWeight: 700, mb: 2}}>Update Order</Typography>
                                <Stack spacing={1.5}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel>Order Status</InputLabel>
                                        <Select value={statusValue} onChange={e => setStatusValue(e.target.value)} label="Order Status">
                                            {allStatuses.map(s => (
                                                <MenuItem key={s} value={s} sx={{textTransform: "capitalize"}}>{s.replace(/[-_]/g, " ")}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    {/* Show shipping fields when status is shipped or beyond */}
                                    {["shipped", "in-transit", "delivered"].includes(statusValue) && (
                                        <>
                                            <Divider/>
                                            <Typography variant="caption" color="text.secondary" sx={{fontWeight: 600}}>Shipping Details</Typography>
                                            <FormControl size="small" fullWidth>
                                                <InputLabel>Courier</InputLabel>
                                                <Select value={courierValue} onChange={e => setCourierValue(e.target.value)} label="Courier">
                                                    <MenuItem value="">None</MenuItem>
                                                    {(couriers || []).map(c => (
                                                        <MenuItem key={c._id || c.id} value={c._id || c.id}>
                                                            {c.name}{c.code ? ` (${c.code})` : ""}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <TextField size="small" label="Tracking Number" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} fullWidth/>
                                            <TextField size="small" label="Estimated Delivery" type="date" value={estimatedDelivery} onChange={e => setEstimatedDelivery(e.target.value)} fullWidth InputLabelProps={{shrink: true}}/>
                                            <Typography variant="caption" color="text.muted">Tracking URL is auto-generated from the courier's template.</Typography>
                                        </>
                                    )}

                                    <Button
                                        variant="contained" color="secondary" size="small" fullWidth
                                        disabled={!statusValue || orderLoading}
                                        onClick={async () => {
                                            const payload = {status: statusValue};
                                            if (courierValue) payload.courier = courierValue;
                                            if (trackingNumber) payload.tracking_number = trackingNumber;
                                            if (estimatedDelivery) payload.estimated_delivery = estimatedDelivery;
                                            const result = await dispatch(updateOrder({id: orderID, data: payload}));
                                            if (!result.error) dispatch(fetchOrder(orderID));
                                        }}
                                    >
                                        Update Order
                                    </Button>
                                </Stack>
                            </Paper>

                            {/* Actions */}
                            <Paper elevation={0} sx={{p: 2.5}}>
                                <Typography variant="subtitle2" sx={{fontWeight: 700, mb: 2}}>Actions</Typography>
                                <Stack spacing={1}>
                                    <Link to={`/orders/${orderID}/update`} style={{textDecoration: "none"}}>
                                        <Button variant="outlined" color="secondary" size="small" fullWidth startIcon={<Edit/>}>Edit Order</Button>
                                    </Link>
                                    <Link to="/order-note/new" style={{textDecoration: "none"}}>
                                        <Button variant="outlined" color="secondary" size="small" fullWidth startIcon={<NotesOutlined/>}>Add Note</Button>
                                    </Link>
                                    <Link to="/order-refund/new" style={{textDecoration: "none"}}>
                                        <Button variant="outlined" color="warning" size="small" fullWidth startIcon={<PaymentOutlined/>}>Issue Refund</Button>
                                    </Link>
                                    <Divider/>
                                    <Button variant="outlined" color="error" size="small" fullWidth startIcon={<Delete/>} onClick={handleDelete}>Delete Order</Button>
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Snackbar open={copied} autoHideDuration={2000} onClose={() => setCopied(false)} anchorOrigin={{vertical: "bottom", horizontal: "center"}} message="Copied to clipboard"/>
        </Layout>
    );
};

export default OrderDetailPage;
