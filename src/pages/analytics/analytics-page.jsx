import React, {useEffect, useMemo, useState} from "react";
import {
    Box, Button, Chip, Container, Divider, Grid, LinearProgress,
    Paper, Stack, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Typography, useMediaQuery, useTheme
} from "@mui/material";
import {Link} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchOrders, selectOrder} from "../../redux/features/orders/orders-slice";
import {selectProducts} from "../../redux/features/products/products-slice";
import {selectCustomer} from "../../redux/features/customers/customers-slice";
import {BarChart} from "@mui/x-charts/BarChart";
import {PieChart} from "@mui/x-charts/PieChart";
import {LineChart} from "@mui/x-charts/LineChart";
import moment from "moment";
import KPIBox from "../../components/shared/kpi-box.jsx";
import {
    AttachMoneyOutlined, ShoppingCartOutlined, PeopleOutlined,
    TrendingUpOutlined, InventoryOutlined, StarOutlined,
    LocalShippingOutlined, ReceiptOutlined
} from "@mui/icons-material";

const STATUS_COLORS = {
    pending: "#F59E0B", processing: "#3B82F6", "on-hold": "#F59E0B",
    shipped: "#8B5CF6", "in-transit": "#6366F1", delivered: "#10B981",
    completed: "#22C55E", refunded: "#06B6D4", cancelled: "#6B7280", failed: "#EF4444",
    "pending payment": "#F59E0B",
};

const statusChipColor = (s) => {
    if (s === "completed" || s === "delivered") return "success";
    if (s === "processing" || s === "shipped" || s === "in-transit") return "info";
    if (s === "failed" || s === "cancelled") return "error";
    if (s === "on-hold" || s === "pending" || s === "pending payment") return "warning";
    return "default";
};

const ChartCard = ({title, subtitle, children, action}) => (
    <Paper elevation={0} sx={{p: 3, height: "100%"}}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 2}}>
            <Box>
                <Typography variant="subtitle1" sx={{fontWeight: 600}}>{title}</Typography>
                {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
            </Box>
            {action}
        </Stack>
        {children}
    </Paper>
);

const AnalyticsPage = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const {orders, orderLoading} = useSelector(selectOrder);
    const {products} = useSelector(selectProducts);
    const {customers} = useSelector(selectCustomer);
    const [period, setPeriod] = useState("all");

    useEffect(() => { dispatch(fetchOrders()); }, [dispatch]);

    const filteredOrders = useMemo(() => {
        if (!orders) return [];
        if (period === "all") return orders;
        const now = moment();
        const cutoff = period === "7d" ? now.clone().subtract(7, "days")
            : period === "30d" ? now.clone().subtract(30, "days")
            : period === "90d" ? now.clone().subtract(90, "days")
            : now.clone().subtract(1, "year");
        return orders.filter(o => moment(o.date_created || o.created_at || o.createdAt).isAfter(cutoff));
    }, [orders, period]);

    const totalRevenue = filteredOrders.reduce((s, o) => s + Number(o.total?.amount ?? o.total ?? 0), 0);
    const totalOrders = filteredOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const customerSet = new Set(filteredOrders.map(o => o.customer?._id).filter(Boolean));
    const completedOrders = filteredOrders.filter(o => o.status === "completed" || o.status === "delivered").length;
    const completedRevenue = filteredOrders.filter(o => o.status === "completed" || o.status === "delivered").reduce((s, o) => s + Number(o.total?.amount ?? o.total ?? 0), 0);
    const conversionRate = totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : "0.0";

    // Status breakdown
    const statusGroups = {};
    filteredOrders.forEach(o => {
        const s = o.status || "unknown";
        if (!statusGroups[s]) statusGroups[s] = {count: 0, total: 0};
        statusGroups[s].count += 1;
        statusGroups[s].total += Number(o.total?.amount ?? o.total ?? 0);
    });

    const pieData = Object.entries(statusGroups).map(([status, data], i) => ({
        id: i, value: data.count, label: status,
        color: STATUS_COLORS[status] || "#9CA3AF",
    }));

    // Monthly revenue data
    const monthlyData = useMemo(() => {
        const months = Array(12).fill(0);
        const monthOrders = Array(12).fill(0);
        (orders || []).forEach(o => {
            const m = moment(o.date_created || o.created_at || o.createdAt).month();
            months[m] += Number(o.total?.amount ?? o.total ?? 0);
            monthOrders[m] += 1;
        });
        return {revenue: months, orders: monthOrders};
    }, [orders]);

    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Daily trend (last 14 days)
    const dailyTrend = useMemo(() => {
        const days = [];
        const revenue = [];
        const orderCounts = [];
        for (let i = 13; i >= 0; i--) {
            const d = moment().subtract(i, "days");
            days.push(d.format("MM/DD"));
            const dayOrders = (orders || []).filter(o => moment(o.date_created || o.created_at || o.createdAt).isSame(d, "day"));
            revenue.push(dayOrders.reduce((s, o) => s + Number(o.total?.amount ?? o.total ?? 0), 0));
            orderCounts.push(dayOrders.length);
        }
        return {days, revenue, orders: orderCounts};
    }, [orders]);

    // Top products by revenue
    const productRevenue = useMemo(() => {
        const map = {};
        (orders || []).forEach(o => {
            (o.orderItems || []).forEach(item => {
                const name = item.product?.title || "Unknown";
                if (!map[name]) map[name] = {name, sales: 0, revenue: 0};
                map[name].sales += item.quantity || 1;
                map[name].revenue += (item.product?.price?.amount || 0) * (item.quantity || 1);
            });
        });
        return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    }, [orders]);

    const recentOrders = orders ? [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5) : [];
    const chartHeight = isMobile ? 220 : 280;
    const accent = theme.palette.secondary.main;

    return (
        <Layout>
            {orderLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                <Container>
                    {/* Header */}
                    <Stack direction={{xs: "column", sm: "row"}} alignItems={{xs: "flex-start", sm: "center"}} justifyContent="space-between" spacing={2} sx={{mb: 3}}>
                        <Box>
                            <Typography variant="h4" sx={{color: "text.heading", fontWeight: 700}}>Analytics</Typography>
                            <Typography variant="body2" color="text.secondary">Comprehensive store performance insights</Typography>
                        </Box>
                        <Stack direction="row" spacing={1}>
                            {[{label: "7D", value: "7d"}, {label: "30D", value: "30d"}, {label: "90D", value: "90d"}, {label: "1Y", value: "1y"}, {label: "All", value: "all"}].map(p => (
                                <Button key={p.value} size="small" variant={period === p.value ? "contained" : "outlined"} color="secondary" onClick={() => setPeriod(p.value)} sx={{minWidth: 44}}>
                                    {p.label}
                                </Button>
                            ))}
                        </Stack>
                    </Stack>

                    <Divider sx={{mb: 3}}/>

                    {/* KPI Stats */}
                    <Grid container spacing={2} sx={{mb: 4}}>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Total Revenue" value={`£${totalRevenue.toLocaleString()}`} icon={<AttachMoneyOutlined fontSize="small"/>} iconColor="text.green" iconBg="light.green" trend={12}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Total Orders" value={totalOrders} icon={<ShoppingCartOutlined fontSize="small"/>} iconColor="text.blue" iconBg="light.blue" trend={8}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Avg Order Value" value={`£${avgOrderValue.toFixed(2)}`} icon={<TrendingUpOutlined fontSize="small"/>} iconColor="text.orange" iconBg="light.orange" trend={-2}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Conversion Rate" value={`${conversionRate}%`} icon={<ReceiptOutlined fontSize="small"/>} iconColor="secondary.main" iconBg="light.secondary" trend={5}/>
                        </Grid>
                    </Grid>

                    {/* Secondary Stats */}
                    <Grid container spacing={2} sx={{mb: 4}}>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Completed Revenue" value={`£${completedRevenue.toLocaleString()}`} icon={<AttachMoneyOutlined fontSize="small"/>} iconColor="text.green" iconBg="light.green"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Unique Customers" value={customerSet.size} icon={<PeopleOutlined fontSize="small"/>} iconColor="text.blue" iconBg="light.blue" trend={15}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Total Products" value={products?.length || 0} icon={<InventoryOutlined fontSize="small"/>} iconColor="text.orange" iconBg="light.orange"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Total Customers" value={customers?.length || 0} icon={<PeopleOutlined fontSize="small"/>} iconColor="secondary.main" iconBg="light.secondary"/>
                        </Grid>
                    </Grid>

                    {/* Charts Row 1 */}
                    <Grid container spacing={3} sx={{mb: 3}}>
                        <Grid size={{xs: 12, md: 8}}>
                            <ChartCard title="Revenue Trend" subtitle="Daily revenue over the last 14 days">
                                <LineChart
                                    xAxis={[{scaleType: "point", data: dailyTrend.days}]}
                                    series={[
                                        {data: dailyTrend.revenue, label: "Revenue (£)", color: accent, area: true, showMark: false},
                                    ]}
                                    height={chartHeight}
                                    margin={{left: 60, right: 20, top: 20, bottom: 30}}
                                    sx={{"& .MuiAreaElement-root": {fillOpacity: 0.15}}}
                                />
                            </ChartCard>
                        </Grid>
                        <Grid size={{xs: 12, md: 4}}>
                            <ChartCard title="Orders by Status" subtitle="Distribution of all orders">
                                {pieData.length > 0 ? (
                                    <PieChart
                                        series={[{data: pieData, innerRadius: 45, outerRadius: 85, paddingAngle: 3, cornerRadius: 4}]}
                                        height={180}
                                        margin={{top: 5, bottom: 5, left: 5, right: 5}}
                                        slotProps={{legend: {hidden: true}}}
                                    />
                                ) : (
                                    <Box sx={{height: 180, display: "flex", alignItems: "center", justifyContent: "center"}}>
                                        <Typography variant="body2" color="text.secondary">No data</Typography>
                                    </Box>
                                )}
                                <Stack spacing={0.5} sx={{mt: 1.5}}>
                                    {pieData.map(d => (
                                        <Stack key={d.id} direction="row" spacing={1} alignItems="center">
                                            <Box sx={{width: 8, height: 8, borderRadius: 1, bgcolor: d.color, flexShrink: 0}}/>
                                            <Typography variant="caption" sx={{textTransform: "capitalize", flex: 1}}>{d.label}</Typography>
                                            <Typography variant="caption" fontWeight={600}>{d.value}</Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                            </ChartCard>
                        </Grid>
                    </Grid>

                    {/* Charts Row 2 */}
                    <Grid container spacing={3} sx={{mb: 3}}>
                        <Grid size={{xs: 12, md: 6}}>
                            <ChartCard title="Monthly Revenue" subtitle="Revenue by month (all time)"
                                action={<Link to="/revenue" style={{textDecoration: "none"}}><Button size="small" variant="outlined" color="secondary">View Revenue</Button></Link>}>
                                <BarChart
                                    xAxis={[{scaleType: "band", data: monthLabels}]}
                                    series={[{data: monthlyData.revenue, label: "Revenue (£)", color: accent}]}
                                    height={chartHeight}
                                    margin={{left: 60, right: 10, top: 10, bottom: 30}}
                                />
                            </ChartCard>
                        </Grid>
                        <Grid size={{xs: 12, md: 6}}>
                            <ChartCard title="Monthly Orders" subtitle="Orders placed per month">
                                <BarChart
                                    xAxis={[{scaleType: "band", data: monthLabels}]}
                                    series={[{data: monthlyData.orders, label: "Orders", color: "#3B82F6"}]}
                                    height={chartHeight}
                                    margin={{left: 40, right: 10, top: 10, bottom: 30}}
                                />
                            </ChartCard>
                        </Grid>
                    </Grid>

                    {/* Tables Row */}
                    <Grid container spacing={3}>
                        <Grid size={{xs: 12, md: 5}}>
                            <Paper elevation={0} sx={{p: 3, height: "100%"}}>
                                <Typography variant="subtitle1" sx={{mb: 0.5, fontWeight: 600}}>Sales by Status</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{mb: 2, display: "block"}}>Revenue breakdown by order status</Typography>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Status</TableCell>
                                                <TableCell align="right">Orders</TableCell>
                                                <TableCell align="right">Revenue</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Object.entries(statusGroups).length === 0 ? (
                                                <TableRow><TableCell colSpan={3}><Typography variant="body2" color="text.secondary" align="center">No data</Typography></TableCell></TableRow>
                                            ) : Object.entries(statusGroups).map(([status, data]) => (
                                                <TableRow key={status}>
                                                    <TableCell><Chip label={status} size="small" color={statusChipColor(status)} sx={{textTransform: "capitalize"}}/></TableCell>
                                                    <TableCell align="right"><Typography variant="body2">{data.count}</Typography></TableCell>
                                                    <TableCell align="right"><Typography variant="body2" sx={{fontWeight: 600}}>£{data.total.toFixed(2)}</Typography></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>

                        <Grid size={{xs: 12, md: 7}}>
                            <Paper elevation={0} sx={{p: 3, height: "100%"}}>
                                <Typography variant="subtitle1" sx={{mb: 0.5, fontWeight: 600}}>Top Products</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{mb: 2, display: "block"}}>Best performing products by revenue</Typography>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>#</TableCell>
                                                <TableCell>Product</TableCell>
                                                <TableCell align="right">Units Sold</TableCell>
                                                <TableCell align="right">Revenue</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {productRevenue.length === 0 ? (
                                                <TableRow><TableCell colSpan={4}><Typography variant="body2" color="text.secondary" align="center">No data</Typography></TableCell></TableRow>
                                            ) : productRevenue.map((p, i) => (
                                                <TableRow key={i}>
                                                    <TableCell>
                                                        <Box sx={{width: 24, height: 24, borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: i === 0 ? "light.yellow" : i === 1 ? "light.secondary" : i === 2 ? "light.orange" : "light.default", color: i === 0 ? "text.yellow" : i === 1 ? "secondary.main" : i === 2 ? "text.orange" : "text.secondary"}}>
                                                            <Typography variant="caption" sx={{fontWeight: 700, fontSize: 10}}>{i + 1}</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell><Typography variant="body2" sx={{fontWeight: 500}}>{p.name}</Typography></TableCell>
                                                    <TableCell align="right"><Typography variant="body2">{p.sales}</Typography></TableCell>
                                                    <TableCell align="right"><Typography variant="body2" sx={{fontWeight: 600, color: "text.green"}}>£{p.revenue.toLocaleString()}</Typography></TableCell>
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
                                    <Box>
                                        <Typography variant="subtitle1" sx={{fontWeight: 600}}>Recent Orders</Typography>
                                        <Typography variant="caption" color="text.secondary">Latest order activity</Typography>
                                    </Box>
                                    <Link to="/orders" style={{textDecoration: "none"}}>
                                        <Button size="small" variant="outlined" color="secondary">View All</Button>
                                    </Link>
                                </Stack>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Order</TableCell>
                                                <TableCell>Customer</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Payment</TableCell>
                                                <TableCell align="right">Total</TableCell>
                                                <TableCell>Date</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {recentOrders.length === 0 ? (
                                                <TableRow><TableCell colSpan={6}><Typography variant="body2" color="text.secondary" align="center">No orders</Typography></TableCell></TableRow>
                                            ) : recentOrders.map(order => (
                                                <TableRow key={order._id}>
                                                    <TableCell>
                                                        <Link to={`/orders/${order._id}`} style={{textDecoration: "none"}}>
                                                            <Typography variant="body2" color="secondary.main" sx={{fontWeight: 500}}>{order.number}</Typography>
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell><Typography variant="body2">{order.customer?.name || "—"}</Typography></TableCell>
                                                    <TableCell><Chip label={order.status} size="small" color={statusChipColor(order.status)} sx={{textTransform: "capitalize"}}/></TableCell>
                                                    <TableCell><Typography variant="body2" color="text.secondary">{order.billing?.method || "—"}</Typography></TableCell>
                                                    <TableCell align="right"><Typography variant="body2" sx={{fontWeight: 600}}>£{Number(order.total?.amount || 0).toFixed(2)}</Typography></TableCell>
                                                    <TableCell><Typography variant="body2" color="text.secondary">{moment(order.date_created || order.created_at || order.createdAt).format("ll")}</Typography></TableCell>
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
