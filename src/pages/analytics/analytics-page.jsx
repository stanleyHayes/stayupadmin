import React, {useEffect} from "react";
import {
    Box, Chip, Container, Grid, LinearProgress,
    Paper, Stack, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchOrders, selectOrder} from "../../redux/features/orders/orders-slice";
import {BarChart} from "@mui/x-charts/BarChart";
import {PieChart} from "@mui/x-charts/PieChart";
import moment from "moment";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const STATUS_COLORS = {
    completed:           "#4caf50",
    processing:          "#2196f3",
    "pending payment":   "#ff9800",
    "on hold":           "#ff9800",
    refunded:            "#9e9e9e",
    cancelled:           "#9e9e9e",
    failed:              "#f44336",
};

const STAT_CONFIGS = [
    {key: "revenue",   label: "Total Revenue",    icon: <AttachMoneyIcon sx={{fontSize: 32}}/>, bg: "#7c3aed", color: "#fff"},
    {key: "orders",    label: "Total Orders",     icon: <ShoppingCartIcon sx={{fontSize: 32}}/>, bg: "#0ea5e9", color: "#fff"},
    {key: "customers", label: "Unique Customers", icon: <PeopleIcon sx={{fontSize: 32}}/>,       bg: "#10b981", color: "#fff"},
    {key: "avg",       label: "Avg Order Value",  icon: <TrendingUpIcon sx={{fontSize: 32}}/>,   bg: "#f59e0b", color: "#fff"},
];

const TOP_PRODUCTS = [
    {name: "Premium Wireless Headphones", sales: 142, revenue: "$21,300"},
    {name: "Ergonomic Office Chair",      sales: 89,  revenue: "$17,800"},
    {name: "Smart Home Hub",              sales: 76,  revenue: "$9,120"},
    {name: "Mechanical Keyboard",         sales: 64,  revenue: "$8,320"},
    {name: "USB-C Monitor 27\"",           sales: 51,  revenue: "$15,300"},
];

const MONTHLY_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHLY_DATA   = [3200, 4100, 3800, 5200, 6100, 5800, 7200, 6800, 7900, 8400, 7100, 9200];

const statusChipColor = (s) => {
    if (s === "completed") return "success";
    if (s === "processing") return "info";
    if (s === "failed" || s === "cancelled") return "error";
    if (s === "on hold" || s === "pending payment") return "warning";
    return "default";
};

const AnalyticsPage = () => {
    const dispatch = useDispatch();
    const {orders, orderLoading} = useSelector(selectOrder);

    useEffect(() => { dispatch(fetchOrders()); }, [dispatch]);

    const totalRevenue = orders ? orders.reduce((sum, o) => sum + Number(o.total?.amount || o.total || o.amount || 0), 0) : 0;
    const totalOrders  = orders ? orders.length : 0;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const customerSet  = orders ? new Set(orders.map(o => o.customer?.email || o.customer?._id).filter(Boolean)) : new Set();
    const totalCustomers = customerSet.size;

    const statusGroups = {};
    if (orders) {
        orders.forEach(o => {
            const s = o.status || "unknown";
            if (!statusGroups[s]) statusGroups[s] = {count: 0, total: 0};
            statusGroups[s].count += 1;
            statusGroups[s].total += Number(o.total?.amount || o.total || o.amount || 0);
        });
    }

    const pieData = Object.entries(statusGroups).map(([status, data], i) => ({
        id: i, value: data.count, label: status,
        color: STATUS_COLORS[status] || "#9e9e9e",
    }));

    const recentOrders = orders ? [...orders].slice(0, 5) : [];

    const statValues = {
        revenue:   `$${totalRevenue.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
        orders:    totalOrders.toLocaleString(),
        customers: totalCustomers > 0 ? totalCustomers.toLocaleString() : "—",
        avg:       `$${avgOrderValue.toFixed(2)}`,
    };

    return (
        <Layout>
            {orderLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                <Container>
                    <Typography variant="h4" sx={{color: "text.secondary", mb: 1}}>Analytics</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mb: 4}}>Store performance overview</Typography>

                    {/* Stat cards */}
                    <Grid container spacing={3} sx={{mb: 4}}>
                        {STAT_CONFIGS.map(cfg => (
                            <Grid key={cfg.key} size={{xs: 12, sm: 6, md: 3}}>
                                <Paper elevation={0} sx={{p: 3, bgcolor: cfg.bg, color: cfg.color, height: "100%", minHeight: 130, display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                                        <Box>
                                            <Typography variant="caption" sx={{fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, opacity: 0.85}}>{cfg.label}</Typography>
                                            <Typography variant="h4" sx={{mt: 0.5, fontWeight: 700, color: cfg.color}}>{statValues[cfg.key]}</Typography>
                                        </Box>
                                        <Box sx={{opacity: 0.75}}>{cfg.icon}</Box>
                                    </Stack>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Charts */}
                    <Grid container spacing={3} sx={{mb: 4}}>
                        <Grid size={{xs: 12, md: 8}}>
                            <Paper elevation={0} sx={{p: 3, height: "100%"}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Monthly Revenue</Typography>
                                <BarChart
                                    xAxis={[{scaleType: "band", data: MONTHLY_LABELS}]}
                                    series={[{data: MONTHLY_DATA, label: "Revenue ($)", color: "#7c3aed"}]}
                                    height={240}
                                    margin={{left: 60, right: 10, top: 10, bottom: 30}}
                                />
                            </Paper>
                        </Grid>
                        <Grid size={{xs: 12, md: 4}}>
                            <Paper elevation={0} sx={{p: 3, height: "100%"}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Orders by Status</Typography>
                                {pieData.length > 0 ? (
                                    <PieChart
                                        series={[{data: pieData, innerRadius: 50, outerRadius: 90, paddingAngle: 3, cornerRadius: 4}]}
                                        height={200}
                                        margin={{top: 10, bottom: 10, left: 10, right: 10}}
                                        slotProps={{legend: {hidden: true}}}
                                    />
                                ) : (
                                    <Box sx={{height: 200, display: "flex", alignItems: "center", justifyContent: "center"}}>
                                        <Typography variant="body2" color="text.secondary">No order data</Typography>
                                    </Box>
                                )}
                                <Stack spacing={0.5} sx={{mt: 1}}>
                                    {pieData.map(d => (
                                        <Stack key={d.id} direction="row" spacing={1} alignItems="center">
                                            <Box sx={{width: 10, height: 10, borderRadius: "50%", bgcolor: d.color, flexShrink: 0}}/>
                                            <Typography variant="caption" sx={{textTransform: "capitalize", flex: 1}}>{d.label}</Typography>
                                            <Typography variant="caption" fontWeight={600}>{d.value}</Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Tables */}
                    <Grid container spacing={3}>
                        <Grid size={{xs: 12, md: 5}}>
                            <Paper elevation={0} sx={{p: 3, height: "100%"}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Sales by Status</Typography>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Status</TableCell>
                                                <TableCell align="right">Orders</TableCell>
                                                <TableCell align="right">Total</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Object.entries(statusGroups).length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={3}>
                                                        <Typography variant="body2" color="text.secondary" align="center">No data</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ) : Object.entries(statusGroups).map(([status, data]) => (
                                                <TableRow key={status}>
                                                    <TableCell><Chip label={status} size="small" color={statusChipColor(status)} sx={{textTransform: "capitalize"}}/></TableCell>
                                                    <TableCell align="right">{data.count}</TableCell>
                                                    <TableCell align="right">${data.total.toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>

                        <Grid size={{xs: 12, md: 7}}>
                            <Paper elevation={0} sx={{p: 3, height: "100%"}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Top Products</Typography>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>#</TableCell>
                                                <TableCell>Product</TableCell>
                                                <TableCell align="right">Sales</TableCell>
                                                <TableCell align="right">Revenue</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {TOP_PRODUCTS.map((p, i) => (
                                                <TableRow key={i}>
                                                    <TableCell>{i + 1}</TableCell>
                                                    <TableCell>{p.name}</TableCell>
                                                    <TableCell align="right">{p.sales}</TableCell>
                                                    <TableCell align="right">{p.revenue}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>

                        <Grid size={{xs: 12}}>
                            <Paper elevation={0} sx={{p: 3}}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 2}}>
                                    <Typography variant="subtitle1" sx={{fontWeight: 600}}>Recent Activity</Typography>
                                    <Link to="/orders" style={{textDecoration: "none"}}>
                                        <Typography variant="body2" color="secondary.main">View all orders →</Typography>
                                    </Link>
                                </Stack>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Order</TableCell>
                                                <TableCell>Customer</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell align="right">Total</TableCell>
                                                <TableCell>Date</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {recentOrders.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5}>
                                                        <Typography variant="body2" color="text.secondary" align="center">No recent orders</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ) : recentOrders.map((order) => (
                                                <TableRow key={order._id}>
                                                    <TableCell>
                                                        <Link to={`/orders/${order._id}`} style={{textDecoration: "none"}}>
                                                            <Typography variant="body2" color="secondary.main">{order.number || `#${order._id}`}</Typography>
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">{order.customer?.name || order.customer_name || "—"}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip label={order.status || "—"} size="small" color={statusChipColor(order.status)} sx={{textTransform: "capitalize"}}/>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body2">${Number(order.total?.amount || order.total || order.amount || 0).toFixed(2)}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" color="text.secondary">{order.createdAt || order.created_at ? moment(order.createdAt || order.created_at).format("ll") : "—"}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
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

export default AnalyticsPage;
