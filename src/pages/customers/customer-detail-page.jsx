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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VerifiedIcon from "@mui/icons-material/Verified";
import currencyFormatter from "currency-formatter";

const InfoRow = ({label, value}) => (
    <Box sx={{display: "flex", gap: 1, alignItems: "flex-start", py: 0.5}}>
        <Typography variant="caption" color="text.secondary" sx={{minWidth: 140, fontWeight: 600}}>{label}</Typography>
        <Typography variant="body2">{value ?? "—"}</Typography>
    </Box>
);

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

    const handleDelete = async () => {
        if (!window.confirm(`Delete customer ${customer?.name}? This cannot be undone.`)) return;
        await dispatch(deleteCustomer(customerID));
        navigate("/customers");
    };

    const c = customer || {};
    const customerOrders = orders.filter(o => String(o.customer?._id) === String(customerID));

    return (
        <Layout>
            {customerLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {customerError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{customerError}</AlertTitle></Alert>}
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{mb: 3}}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                            <Typography variant="h5">Customer Profile</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Link to={`/customers/${customerID}/update`} style={{textDecoration: "none"}}>
                                <Button startIcon={<EditIcon/>} variant="outlined" color="secondary" size="small">Edit</Button>
                            </Link>
                            <Button startIcon={<DeleteIcon/>} variant="outlined" color="error" size="small" onClick={handleDelete}>Delete</Button>
                        </Stack>
                    </Stack>

                    <Grid container spacing={2}>
                        {/* Profile card */}
                        <Grid item size={{xs: 12, md: 4}}>
                            <Paper elevation={0} sx={{p: 3, mb: 2, textAlign: "center"}}>
                                <Avatar sx={{width: 80, height: 80, mx: "auto", mb: 2, bgcolor: "secondary.main", fontSize: 32}}>
                                    {(c.name || "?")[0].toUpperCase()}
                                </Avatar>
                                <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{mb: 1}}>
                                    <Typography variant="h6">{c.name || "—"}</Typography>
                                    {c.is_verified && <VerifiedIcon sx={{fontSize: 18, color: "secondary.main"}}/>}
                                </Stack>
                                <Typography variant="body2" color="text.secondary">@{c.username || "—"}</Typography>
                                {c.status && (
                                    <Chip label={c.status} size="small" sx={{mt: 1}} color={c.status === "ACTIVE" ? "success" : "default"}/>
                                )}
                            </Paper>

                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Contact</Typography>
                                <InfoRow label="Email" value={c.email}/>
                                <InfoRow label="Phone" value={c.phone}/>
                                <Divider sx={{my: 1}}/>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Account</Typography>
                                <InfoRow label="Username" value={c.username ? `@${c.username}` : null}/>
                                <InfoRow label="Verified" value={c.is_verified ? "Yes" : "No"}/>
                                <InfoRow label="Member since" value={c.created_at ? moment(c.created_at).format("LL") : null}/>
                                <Divider sx={{my: 1}}/>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Stats</Typography>
                                <InfoRow label="Total orders" value={c.total_orders ?? customerOrders.length}/>
                                <InfoRow label="Total spent" value={c.total_spent ? currencyFormatter.format(c.total_spent.amount, {code: c.total_spent.currency}) : null}/>
                            </Paper>
                        </Grid>

                        {/* Addresses + Orders */}
                        <Grid item size={{xs: 12, md: 8}}>
                            <Grid container spacing={2} sx={{mb: 2}}>
                                <Grid item size={{xs: 12, md: 6}}>
                                    <Paper elevation={0} sx={{p: 3}}>
                                        <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Shipping Address</Typography>
                                        {c.shipping_address && Object.keys(c.shipping_address).length > 0 ? (
                                            <Stack spacing={0.5}>
                                                <Typography variant="body2">{c.shipping_address.address_line_1}</Typography>
                                                {c.shipping_address.address_line_2 && <Typography variant="body2">{c.shipping_address.address_line_2}</Typography>}
                                                <Typography variant="body2">{c.shipping_address.city}{c.shipping_address.postal_code ? `, ${c.shipping_address.postal_code}` : ""}</Typography>
                                                <Typography variant="body2">{c.shipping_address.county}</Typography>
                                                <Typography variant="body2">{c.shipping_address.country}</Typography>
                                            </Stack>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">No shipping address</Typography>
                                        )}
                                    </Paper>
                                </Grid>
                                <Grid item size={{xs: 12, md: 6}}>
                                    <Paper elevation={0} sx={{p: 3}}>
                                        <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Billing Address</Typography>
                                        {c.billing_address && Object.keys(c.billing_address).length > 0 ? (
                                            <Stack spacing={0.5}>
                                                <Typography variant="body2">{c.billing_address.address_line_1}</Typography>
                                                {c.billing_address.address_line_2 && <Typography variant="body2">{c.billing_address.address_line_2}</Typography>}
                                                <Typography variant="body2">{c.billing_address.city}{c.billing_address.postal_code ? `, ${c.billing_address.postal_code}` : ""}</Typography>
                                                <Typography variant="body2">{c.billing_address.county}</Typography>
                                                <Typography variant="body2">{c.billing_address.country}</Typography>
                                            </Stack>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">No billing address</Typography>
                                        )}
                                    </Paper>
                                </Grid>
                            </Grid>

                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Recent Orders</Typography>
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
                                            {customerOrders.length > 0 ? customerOrders.map((order, i) => (
                                                <TableRow key={i}>
                                                    <TableCell>
                                                        <Link to={`/orders/${order._id}`} style={{textDecoration: "none"}}>
                                                            <Typography variant="body2" color="secondary.main">{order.number}</Typography>
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell><Typography variant="body2" color="text.secondary">{moment(order.createdAt).fromNow()}</Typography></TableCell>
                                                    <TableCell><Chip label={order.status} size="small"/></TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body2">{order.total ? currencyFormatter.format(order.total.amount, {code: order.total.currency}) : "—"}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow>
                                                    <TableCell colSpan={4}>
                                                        <Typography variant="body2" color="text.secondary" align="center">No orders found</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default CustomerDetailPage;
