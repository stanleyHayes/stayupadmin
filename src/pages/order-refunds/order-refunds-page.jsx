import React, {useEffect, useMemo, useState} from "react";
import {
    Alert, AlertTitle, Box, Button, Chip, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, Tooltip, Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchOrderRefunds, deleteOrderRefund, selectOrderRefunds} from "../../redux/features/order-refunds/order-refunds-slice";
import {VisibilityOutlined, DeleteForeverOutlined, MoneyOffOutlined, CheckCircleOutlined, PendingOutlined, AttachMoneyOutlined} from "@mui/icons-material";
import PageHeader from "../../components/shared/page-header.jsx";
import moment from "moment";
import KPIBox from "../../components/shared/kpi-box.jsx";

const statusColor = (s) => s === "PROCESSED" ? "success" : s === "PENDING" ? "warning" : s === "FAILED" ? "error" : "default";

const OrderRefundsPage = () => {
    const dispatch = useDispatch();
    const {orderRefunds, orderRefundLoading, orderRefundError} = useSelector(selectOrderRefunds);
    const [query, setQuery] = useState("");

    useEffect(() => { dispatch(fetchOrderRefunds()); }, [dispatch]);

    const filteredRefunds = useMemo(() => {
        if (!Array.isArray(orderRefunds)) return [];
        const q = query.trim().toLowerCase();
        if (!q) return orderRefunds;
        return orderRefunds.filter(item =>
            [item.reason, item.order_number].join(" ").toLowerCase().includes(q)
        );
    }, [orderRefunds, query]);

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
                    <PageHeader
                        title="Order Refunds"
                        query={query}
                        onQueryChange={setQuery}
                        searchPlaceholder="Search refunds..."
                    />
                    <Divider variant="fullWidth" sx={{my: 3}}/>
                    {(() => { const totalAmount = orderRefunds ? orderRefunds.reduce((sum, r) => sum + Number(r.amount || 0), 0) : 0; return (
                    <Grid container spacing={2} sx={{mt: 3, mb: 4}}>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Total Refunds" value={orderRefunds?.length || 0} icon={<MoneyOffOutlined/>} iconColor="secondary.main" iconBg="light.secondary" trend={-5}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Completed" value={orderRefunds?.filter(r => r.status === "completed").length || 0} icon={<CheckCircleOutlined/>} iconColor="text.green" iconBg="light.green" trend={3}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Pending" value={orderRefunds?.filter(r => r.status === "pending").length || 0} icon={<PendingOutlined/>} iconColor="text.orange" iconBg="light.orange"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Total Amount" value={`GHS ${totalAmount.toLocaleString()}`} icon={<AttachMoneyOutlined/>} iconColor="text.red" iconBg="light.red" trend={-8}/>
                        </Grid>
                    </Grid>
                    ); })()}

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
                                    {filteredRefunds.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7}>
                                                <Typography variant="body2" color="text.secondary" align="center">No refunds found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {filteredRefunds.map((refund, i) => (
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
                                                                sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 0, borderColor: "light.green", color: "icon.green", backgroundColor: "light.green", cursor: "pointer"}}
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Order Refund">
                                                        <DeleteForeverOutlined
                                                            onClick={() => handleDelete(refund)}
                                                            sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 0, borderColor: "light.red", color: "icon.red", backgroundColor: "light.red", cursor: "pointer"}}
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
