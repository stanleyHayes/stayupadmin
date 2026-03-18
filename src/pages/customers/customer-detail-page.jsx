import React, {useEffect} from "react";
import {
    Avatar, Box, Button, Chip, Container, Divider, Grid, Paper,
    Stack, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Typography, LinearProgress, Alert, AlertTitle
} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchCustomer, selectCustomer, deleteCustomer} from "../../redux/features/customers/customers-slice";
import {fetchOrders, selectOrder} from "../../redux/features/orders/orders-slice";
import moment from "moment";
import {ArrowBack, Edit, Delete, Verified, EmailOutlined, PhoneOutlined, LocationOnOutlined, PersonOutlined} from "@mui/icons-material";
import Status from "../../components/shared/status.jsx";
import {DetailSkeleton} from "../../components/shared/page-skeleton.jsx";

const fmtAddress = (addr) => {
    if (!addr) return null;
    const parts = [addr.address_1, addr.address_2, [addr.city, addr.state].filter(Boolean).join(", "), addr.postcode, addr.country].filter(Boolean);
    return parts.length > 0 ? parts : null;
};

const CustomerDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {customerID} = useParams();
    const {customer, customerLoading, customerError} = useSelector(selectCustomer);
    const {orders} = useSelector(selectOrder);

    useEffect(() => {
        if (customerID) dispatch(fetchCustomer(customerID));
        dispatch(fetchOrders());
    }, [dispatch, customerID]);

    if (customerLoading && !customer) return <Layout><Box sx={{pt: 4, pb: 6}}><DetailSkeleton/></Box></Layout>;

    const c = customer || {};
    const name = c.display_name || c.name || (c.first_name ? `${c.first_name} ${c.last_name || ""}`.trim() : c.email || "—");
    const initials = c.first_name && c.last_name ? `${c.first_name[0]}${c.last_name[0]}`.toUpperCase() : (name[0] || "?").toUpperCase();
    const statusColor = (c.status || "").toLowerCase() === "active" ? "success" : (c.status || "").toLowerCase() === "suspended" ? "error" : "default";

    // Match orders by customer_id (string or populated object)
    const customerOrders = (orders || []).filter(o => {
        const cid = typeof o.customer_id === "object" ? o.customer_id?._id : o.customer_id;
        return String(cid) === String(customerID);
    });

    const handleDelete = async () => {
        if (!window.confirm(`Delete customer ${name}?`)) return;
        await dispatch(deleteCustomer(customerID));
        navigate("/customers");
    };

    const DetailRow = ({label, children}) => (
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{py: 1, borderBottom: 1, borderColor: "divider"}}>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Typography variant="body2" component="div" sx={{fontWeight: 500, textAlign: "right"}}>{children ?? "—"}</Typography>
        </Stack>
    );

    const AddressCard = ({title, addr}) => {
        const lines = fmtAddress(addr);
        return (
            <Paper elevation={0} sx={{overflow: "hidden", height: "100%"}}>
                <Box sx={{px: 2.5, py: 1.5, backgroundColor: "background.alternative"}}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <LocationOnOutlined sx={{fontSize: 16, color: "secondary.main"}}/>
                        <Typography variant="subtitle2" sx={{fontWeight: 700}}>{title}</Typography>
                    </Stack>
                </Box>
                <Box sx={{p: 2.5}}>
                    {lines ? (
                        <Stack spacing={0.5}>
                            {addr?.name || (addr?.first_name && `${addr.first_name} ${addr.last_name || ""}`.trim()) ? (
                                <Typography variant="body2" sx={{fontWeight: 600}}>{addr.name || `${addr.first_name} ${addr.last_name || ""}`.trim()}</Typography>
                            ) : null}
                            {lines.map((l, i) => <Typography key={i} variant="body2" color="text.secondary">{l}</Typography>)}
                            {addr?.phone && (
                                <Stack direction="row" spacing={0.5} alignItems="center" sx={{mt: 1}}>
                                    <PhoneOutlined sx={{fontSize: 13, color: "text.muted"}}/>
                                    <Typography variant="caption" color="text.secondary">{addr.phone}</Typography>
                                </Stack>
                            )}
                            {addr?.email && (
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <EmailOutlined sx={{fontSize: 13, color: "text.muted"}}/>
                                    <Typography variant="caption" color="text.secondary">{addr.email}</Typography>
                                </Stack>
                            )}
                        </Stack>
                    ) : (
                        <Typography variant="body2" color="text.muted">No address provided</Typography>
                    )}
                </Box>
            </Paper>
        );
    };

    return (
        <Layout>
            {customerLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {customerError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{customerError}</AlertTitle></Alert>}
                <Container>
                    {/* Header */}
                    <Stack direction={{xs: "column", sm: "row"}} justifyContent="space-between" alignItems={{xs: "stretch", sm: "center"}} sx={{mb: 3}} spacing={2}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Button startIcon={<ArrowBack/>} onClick={() => navigate(-1)} size="small" variant="outlined">Back</Button>
                            <Typography variant="h5" sx={{fontWeight: 800}}>Customer</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Link to={`/customers/${customerID}/update`} style={{textDecoration: "none"}}>
                                <Button startIcon={<Edit/>} variant="contained" color="secondary" size="small">Edit</Button>
                            </Link>
                            <Button startIcon={<Delete/>} variant="outlined" color="error" size="small" onClick={handleDelete}>Delete</Button>
                        </Stack>
                    </Stack>

                    <Grid container spacing={3}>
                        {/* LEFT — Profile */}
                        <Grid size={{xs: 12, md: 4}}>
                            <Paper elevation={0} sx={{overflow: "hidden", mb: 3}}>
                                <Box sx={{background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)", p: 3, pb: 5}}/>
                                <Box sx={{px: 3, pb: 3, mt: -4, textAlign: "center"}}>
                                    <Avatar src={c.avatar_url} sx={{width: 80, height: 80, mx: "auto", mb: 1.5, fontSize: 28, fontWeight: 700, bgcolor: "secondary.dark", color: "#fff", border: "4px solid", borderColor: "background.paper"}}>
                                        {initials}
                                    </Avatar>
                                    <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center" sx={{mb: 0.5}}>
                                        <Typography variant="h6" sx={{fontWeight: 700}}>{name}</Typography>
                                        {c.is_verified && <Verified sx={{fontSize: 18, color: "#F59E0B"}}/>}
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary" sx={{mb: 1.5}}>
                                        {c.username ? `@${c.username}` : c.email || ""}
                                    </Typography>
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        <Chip label={c.status || "active"} size="small" color={statusColor} sx={{fontWeight: 600, textTransform: "capitalize"}}/>
                                        {c.is_paying_customer && <Chip label="Paying" size="small" color="secondary" variant="outlined" sx={{fontWeight: 600}}/>}
                                    </Stack>
                                </Box>
                            </Paper>

                            <Paper elevation={0} sx={{p: 2.5, mb: 3}}>
                                <Typography variant="subtitle2" sx={{fontWeight: 700, mb: 2}}>Details</Typography>
                                <DetailRow label="Email">{c.email}</DetailRow>
                                <DetailRow label="Phone">{c.phone}</DetailRow>
                                <DetailRow label="Username">{c.username ? `@${c.username}` : "—"}</DetailRow>
                                <DetailRow label="Gender"><span style={{textTransform: "capitalize"}}>{c.gender || "—"}</span></DetailRow>
                                <DetailRow label="Date of Birth">{c.dob ? moment(c.dob).format("MMM D, YYYY") : "—"}</DetailRow>
                                <DetailRow label="Verified">{c.is_verified ? "Yes" : "No"}</DetailRow>
                                <DetailRow label="Joined">{(c.created_at || c.date_created) ? moment(c.created_at || c.date_created).format("MMM D, YYYY") : "—"}</DetailRow>
                            </Paper>

                            <Paper elevation={0} sx={{p: 2.5}}>
                                <Typography variant="subtitle2" sx={{fontWeight: 700, mb: 2}}>Order Stats</Typography>
                                <DetailRow label="Orders">{customerOrders.length}</DetailRow>
                                <DetailRow label="Total Spent">
                                    GH₵{customerOrders.reduce((s, o) => s + Number(o.total || 0), 0).toFixed(2)}
                                </DetailRow>
                            </Paper>
                        </Grid>

                        {/* RIGHT — Addresses + Orders */}
                        <Grid size={{xs: 12, md: 8}}>
                            {/* Addresses */}
                            <Grid container spacing={2} sx={{mb: 3}}>
                                <Grid size={{xs: 12, sm: 6}}>
                                    <AddressCard title="Billing Address" addr={c.billing}/>
                                </Grid>
                                <Grid size={{xs: 12, sm: 6}}>
                                    <AddressCard title="Shipping Address" addr={c.shipping}/>
                                </Grid>
                            </Grid>

                            {/* Orders */}
                            <Paper elevation={0} sx={{overflow: "hidden"}}>
                                <Box sx={{px: 2.5, py: 2, backgroundColor: "background.alternative"}}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="subtitle2" sx={{fontWeight: 700}}>Recent Orders</Typography>
                                        <Chip label={customerOrders.length} size="small" color="secondary" sx={{height: 20, fontSize: 11, fontWeight: 700}}/>
                                    </Stack>
                                </Box>
                                {customerOrders.length > 0 ? (
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Order</TableCell>
                                                    <TableCell>Date</TableCell>
                                                    <TableCell>Status</TableCell>
                                                    <TableCell align="right">Total</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {customerOrders.slice(0, 10).map((order, i) => (
                                                    <TableRow key={i} hover>
                                                        <TableCell>
                                                            <Link to={`/orders/${order._id}`} style={{textDecoration: "none"}}>
                                                                <Typography variant="body2" color="secondary.main" sx={{fontWeight: 500}}>#{order.number}</Typography>
                                                            </Link>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {(order.date_created || order.created_at) ? moment(order.date_created || order.created_at).format("MMM D, YYYY") : "—"}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell><Status status={order.status}/></TableCell>
                                                        <TableCell align="right">
                                                            <Typography variant="body2" sx={{fontWeight: 600}}>
                                                                GH₵{Number(order.total || 0).toFixed(2)}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Box sx={{p: 4, textAlign: "center"}}>
                                        <Typography variant="body2" color="text.secondary">No orders yet</Typography>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default CustomerDetailPage;
