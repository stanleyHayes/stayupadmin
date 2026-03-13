import React, {useEffect, useState} from "react";
import {
    Alert, AlertTitle, Box, Button, Chip, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, Tooltip, Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchOrderRefunds, deleteOrderRefund, selectOrderRefunds} from "../../redux/features/order-refunds/order-refunds-slice";
import {SearchOutlined, VisibilityOutlined, DeleteForeverOutlined, Add} from "@mui/icons-material";
import moment from "moment";

const statusColor = (s) => s === "PROCESSED" ? "success" : s === "PENDING" ? "warning" : s === "FAILED" ? "error" : "default";

const OrderRefundsPage = () => {
    const dispatch = useDispatch();
    const {orderRefunds, orderRefundLoading, orderRefundError} = useSelector(selectOrderRefunds);
    const [query, setQuery] = useState("");

    useEffect(() => { dispatch(fetchOrderRefunds()); }, [dispatch]);

    const handleSearch = () => dispatch(fetchOrderRefunds({search: query}));
    const handleDelete = async (refund) => {
        if (!window.confirm("Delete this order refund? This cannot be undone.")) return;
        await dispatch(deleteOrderRefund(refund._id));
    };

    return (
        <Layout>
            {orderRefundLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {orderRefundError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{orderRefundError}</AlertTitle></Alert>}
                <Container>
                    <Grid spacing={4} container alignItems="center" justifyContent="space-between">
                        <Grid size={{xs: 12, md: "auto"}}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{xs: 12, md: "auto"}}>
                                    <Typography variant="h4" sx={{color: "text.secondary"}}>Order Refunds</Typography>
                                </Grid>
                                <Grid size={{xs: 12, md: "auto"}}>
                                    <Link to="/order-refund/new" style={{textDecoration: "none"}}>
                                        <Button startIcon={<Add/>} size="small" color="secondary" variant="outlined">Add Refund</Button>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid size={{xs: 12, md: "auto"}}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{xs: 12, md: 8}}>
                                    <Stack direction="row" spacing={1} sx={{backgroundColor: "background.paper", p: 1, borderRadius: 2}}>
                                        <TextField value={query} size="small" placeholder="Search refunds..." onChange={e => setQuery(e.target.value)} variant="standard" slotProps={{ input: { disableUnderline: true } }} fullWidth/>
                                        <SearchOutlined onClick={handleSearch} sx={{cursor: "pointer", alignSelf: "center"}}/>
                                    </Stack>
                                </Grid>
                                <Grid size={{xs: 12, md: 4}}>
                                    <Button size="small" color="secondary" variant="outlined" fullWidth onClick={handleSearch}>Search</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider sx={{my: 4}}/>
                    <Paper elevation={0}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Order ID</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Reason</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orderRefunds && orderRefunds.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7}>
                                                <Typography variant="body2" color="text.secondary" align="center">No refunds found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {orderRefunds && orderRefunds.map((refund, i) => (
                                        <TableRow key={refund._id}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>
                                                <Link to={`/orders/${refund.order_id}`} style={{textDecoration: "none"}}>
                                                    <Typography variant="body2" color="secondary">#{refund.order_id}</Typography>
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">${Number(refund.amount || 0).toFixed(2)}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary" sx={{maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                                                    {refund.reason || "—"}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={refund.status} size="small" color={statusColor(refund.status)}/>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">{refund.created_at ? moment(refund.created_at).format("ll") : "—"}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Tooltip title="View Order Refund">
                                                        <Link to={`/order-refunds/${refund._id}`} style={{textDecoration: "none"}}>
                                                            <VisibilityOutlined
                                                                sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: "25%", borderColor: "light.green", color: "icon.green", backgroundColor: "light.green", cursor: "pointer"}}
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Order Refund">
                                                        <DeleteForeverOutlined
                                                            onClick={() => handleDelete(refund)}
                                                            sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: "25%", borderColor: "light.red", color: "icon.red", backgroundColor: "light.red", cursor: "pointer"}}
                                                        />
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Container>
            </Box>
        </Layout>
    );
};

export default OrderRefundsPage;
