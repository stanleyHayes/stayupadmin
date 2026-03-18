import React, {useEffect, useMemo} from "react";
import Layout from "../../components/shared/layout.jsx";
import {
    Avatar, Box, Button, Chip, Container, Divider, Grid, LinearProgress,
    Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow,
    Typography, useMediaQuery, useTheme
} from "@mui/material";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchOrders, selectOrder} from "../../redux/features/orders/orders-slice";
import {selectProducts} from "../../redux/features/products/products-slice";
import {selectCustomer} from "../../redux/features/customers/customers-slice";
import {selectAuth} from "../../redux/features/authentication/authentication-slice";
import {LineChart, BarChart, PieChart} from "@mui/x-charts";
import moment from "moment";
import {motion} from "framer-motion";
import KPIBox from "../../components/shared/kpi-box.jsx";
import {
    AttachMoneyOutlined, ShoppingCartOutlined, PeopleOutlined,
    TrendingUpOutlined, InventoryOutlined, LocalShippingOutlined,
    StarOutlined, WarningAmberOutlined, ArrowForward,
    ReceiptOutlined
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

const ChartCard = ({title, subtitle, children, action, delay = 0}) => (
    <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94]}} style={{height: "100%"}}>
        <Paper elevation={0} sx={{p: {xs: 2, sm: 2.5}, height: "100%", transition: "border-color 0.25s, box-shadow 0.25s", "&:hover": {boxShadow: "0 4px 20px rgba(0,0,0,0.06)"}}}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 1.5}}>
                <Box>
                    <Typography variant="subtitle1" sx={{fontWeight: 600, lineHeight: 1.2}}>{title}</Typography>
                    {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
                </Box>
                {action}
            </Stack>
            {children}
        </Paper>
    </motion.div>
);

const OverviewPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const dispatch = useDispatch();
    const {user} = useSelector(selectAuth);
    const {orders, orderLoading} = useSelector(selectOrder);
    const {products} = useSelector(selectProducts);
    const {customers} = useSelector(selectCustomer);
    const accent = theme.palette.secondary.main;

    useEffect(() => { dispatch(fetchOrders()); }, [dispatch]);

    // KPI calculations from real data
    const totalRevenue = orders ? orders.reduce((s, o) => s + Number(o.total?.amount ?? o.total ?? 0), 0) : 0;
    const totalOrders = orders?.length || 0;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const completedOrders = orders?.filter(o => o.status === "completed" || o.status === "delivered").length || 0;
    const pendingOrders = orders?.filter(o => o.status === "pending" || o.status === "processing").length || 0;
    const totalCustomers = customers?.length || 0;
    const totalProducts = products?.length || 0;
    const featuredProducts = products?.filter(p => p.featured).length || 0;
    const lowStockProducts = products?.filter(p => p.stock_status === "lowstock" || p.stock_status === "outofstock").length || 0;
    const completedRevenue = orders?.filter(o => o.status === "completed").reduce((s, o) => s + Number(o.total?.amount ?? o.total ?? 0), 0) || 0;

    // Revenue trend (last 14 days)
    const revenueTrend = useMemo(() => {
        const days = [];
        const revenue = [];
        const orderCounts = [];
        const points = isMobile ? 7 : 14;
        for (let i = points - 1; i >= 0; i--) {
            const d = moment().subtract(i, "days");
            days.push(d.format("MM/DD"));
            const dayOrders = (orders || []).filter(o => moment(o.date_created || o.created_at || o.createdAt).isSame(d, "day"));
            revenue.push(dayOrders.reduce((s, o) => s + Number(o.total?.amount ?? o.total ?? 0), 0));
            orderCounts.push(dayOrders.length);
        }
        return {days, revenue, orders: orderCounts};
    }, [orders, isMobile]);

    // Monthly revenue
    const monthlyRevenue = useMemo(() => {
        const months = Array(12).fill(0);
        (orders || []).forEach(o => { months[moment(o.date_created || o.created_at || o.createdAt).month()] += Number(o.total?.amount ?? o.total ?? 0); });
        return months;
    }, [orders]);
    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Order status breakdown
    const statusGroups = useMemo(() => {
        const map = {};
        (orders || []).forEach(o => {
            const s = o.status || "unknown";
            if (!map[s]) map[s] = {count: 0, total: 0};
            map[s].count += 1;
            map[s].total += Number(o.total?.amount ?? o.total ?? 0);
        });
        return map;
    }, [orders]);

    const pieData = Object.entries(statusGroups).map(([status, data], i) => ({
        id: i, value: data.count, label: status,
        color: STATUS_COLORS[status] || "#9CA3AF",
    }));

    // Top products
    const topProducts = useMemo(() => {
        const map = {};
        (orders || []).forEach(o => {
            (o.orderItems || []).forEach(item => {
                const name = item.product?.title || "Unknown";
                const img = (() => { const p = item.product; if (!p) return ""; if (p.thumbnail) return p.thumbnail; if (Array.isArray(p.images) && p.images[0]) return p.images[0].secure_url || p.images[0].url || p.images[0].src || ""; if (typeof p.image === "string") return p.image; return p.image?.secure_url || p.image?.url || p.image?.src || ""; })();
                if (!map[name]) map[name] = {name, img, sales: 0, revenue: 0};
                map[name].sales += item.quantity || 1;
                map[name].revenue += (item.product?.price?.amount || 0) * (item.quantity || 1);
            });
        });
        return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    }, [orders]);

    // Recent orders
    const recentOrders = orders ? [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6) : [];

    const chartHeight = isMobile ? 200 : 260;
    const greeting = (() => {
        const h = new Date().getHours();
        if (h < 12) return "Good morning";
        if (h < 17) return "Good afternoon";
        return "Good evening";
    })();

    return (
        <Layout>
            {orderLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                <Container>
                    {/* Welcome Banner */}
                    <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} transition={{duration: 0.4}}>
                        <Paper elevation={0} sx={{
                            p: {xs: 2.5, sm: 3}, mb: 3, overflow: "hidden", position: "relative",
                            background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)",
                        }}>
                            <Box sx={{position: "absolute", top: -30, right: -30, width: 150, height: 150, borderRadius: 1, backgroundColor: "rgba(255,255,255,0.08)"}}/>
                            <Box sx={{position: "absolute", bottom: -40, right: 60, width: 100, height: 100, borderRadius: 1, backgroundColor: "rgba(255,255,255,0.05)"}}/>
                            <Stack direction={{xs: "column", sm: "row"}} spacing={2} alignItems={{xs: "flex-start", sm: "center"}} justifyContent="space-between" sx={{position: "relative", zIndex: 1}}>
                                <Box>
                                    <Typography variant="h5" sx={{color: "#fff", fontWeight: 700, mb: 0.5}}>
                                        {greeting}, {user?.first_name || user?.display_name || "Admin"}
                                    </Typography>
                                    <Typography variant="body2" sx={{color: "rgba(255,255,255,0.75)"}}>
                                        Here's what's happening with your store today
                                    </Typography>
                                </Box>
                                <Stack direction="row" spacing={1}>
                                    <Link to="/analytics" style={{textDecoration: "none"}}>
                                        <Button size="small" variant="contained" sx={{backgroundColor: "rgba(255,255,255,0.2)", color: "#fff", "&:hover": {backgroundColor: "rgba(255,255,255,0.3)"}}} endIcon={<ArrowForward sx={{fontSize: 14}}/>}>
                                            Analytics
                                        </Button>
                                    </Link>
                                    <Link to="/revenue" style={{textDecoration: "none"}}>
                                        <Button size="small" variant="contained" sx={{backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", "&:hover": {backgroundColor: "rgba(255,255,255,0.25)"}}} endIcon={<ArrowForward sx={{fontSize: 14}}/>}>
                                            Revenue
                                        </Button>
                                    </Link>
                                </Stack>
                            </Stack>
                        </Paper>
                    </motion.div>

                    {/* Primary KPIs */}
                    <Grid container spacing={2} sx={{mb: 2}}>
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
                            <KPIBox label="Customers" value={totalCustomers} icon={<PeopleOutlined fontSize="small"/>} iconColor="secondary.main" iconBg="light.secondary" trend={15}/>
                        </Grid>
                    </Grid>

                    {/* Secondary KPIs */}
                    <Grid container spacing={2} sx={{mb: 3}}>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Completed Revenue" value={`£${completedRevenue.toLocaleString()}`} icon={<AttachMoneyOutlined fontSize="small"/>} iconColor="text.green" iconBg="light.green"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Products" value={totalProducts} icon={<InventoryOutlined fontSize="small"/>} iconColor="text.blue" iconBg="light.blue"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Pending Orders" value={pendingOrders} icon={<LocalShippingOutlined fontSize="small"/>} iconColor="text.orange" iconBg="light.orange"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Low Stock Items" value={lowStockProducts} icon={<WarningAmberOutlined fontSize="small"/>} iconColor="text.red" iconBg="light.red"/>
                        </Grid>
                    </Grid>

                    {/* Charts Row 1 */}
                    <Grid container spacing={2.5} sx={{mb: 2.5}}>
                        <Grid size={{xs: 12, md: 8}}>
                            <ChartCard title="Revenue Trend" subtitle="Daily revenue over the last 14 days" delay={0.1}
                                action={<Link to="/revenue" style={{textDecoration: "none"}}><Button size="small" variant="outlined" color="secondary" endIcon={<ArrowForward sx={{fontSize: 12}}/>}>Details</Button></Link>}>
                                <LineChart
                                    xAxis={[{scaleType: "point", data: revenueTrend.days}]}
                                    series={[
                                        {data: revenueTrend.revenue, label: "Revenue (£)", color: accent, area: true, showMark: false},
                                        {data: revenueTrend.orders, label: "Orders", color: "#06B6D4", showMark: false},
                                    ]}
                                    height={chartHeight}
                                    margin={{left: 50, right: 20, top: 20, bottom: 30}}
                                    sx={{"& .MuiAreaElement-root": {fillOpacity: 0.12}}}
                                />
                            </ChartCard>
                        </Grid>
                        <Grid size={{xs: 12, md: 4}}>
                            <ChartCard title="Orders by Status" subtitle="Distribution breakdown" delay={0.15}>
                                {pieData.length > 0 ? (
                                    <PieChart
                                        series={[{data: pieData, innerRadius: 40, outerRadius: 80, paddingAngle: 3, cornerRadius: 4}]}
                                        height={isMobile ? 180 : 200}
                                        margin={{top: 5, bottom: 5, left: 5, right: 5}}
                                        slotProps={{legend: {hidden: true}}}
                                    />
                                ) : (
                                    <Box sx={{height: 200, display: "flex", alignItems: "center", justifyContent: "center"}}>
                                        <Typography variant="body2" color="text.secondary">No data</Typography>
                                    </Box>
                                )}
                                <Stack spacing={0.75} sx={{mt: 1}}>
                                    {pieData.map(d => (
                                        <Stack key={d.id} direction="row" spacing={1} alignItems="center">
                                            <Box sx={{width: 8, height: 8, borderRadius: 1, bgcolor: d.color, flexShrink: 0}}/>
                                            <Typography variant="caption" sx={{textTransform: "capitalize", flex: 1}}>{d.label}</Typography>
                                            <Typography variant="caption" sx={{fontFamily: "'GoogleSans', sans-serif", fontWeight: 600}}>{d.value}</Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                            </ChartCard>
                        </Grid>
                    </Grid>

                    {/* Charts Row 2 */}
                    <Grid container spacing={2.5} sx={{mb: 2.5}}>
                        <Grid size={{xs: 12, md: 5}}>
                            <ChartCard title="Monthly Revenue" subtitle="Revenue by month" delay={0.2}>
                                <BarChart
                                    xAxis={[{scaleType: "band", data: monthLabels}]}
                                    series={[{data: monthlyRevenue, label: "Revenue (£)", color: accent}]}
                                    height={chartHeight}
                                    margin={{left: 50, right: 10, top: 10, bottom: 30}}
                                />
                            </ChartCard>
                        </Grid>
                        <Grid size={{xs: 12, md: 7}}>
                            <ChartCard title="Top Products" subtitle="Best sellers by revenue" delay={0.25}
                                action={<Link to="/products" style={{textDecoration: "none"}}><Button size="small" variant="outlined" color="secondary" endIcon={<ArrowForward sx={{fontSize: 12}}/>}>All Products</Button></Link>}>
                                {topProducts.length > 0 ? (
                                    <Stack spacing={1.5}>
                                        {topProducts.map((p, i) => (
                                            <Stack key={i} direction="row" spacing={1.5} alignItems="center">
                                                <Typography variant="caption" sx={{fontFamily: "'GoogleSans', sans-serif", fontWeight: 700, width: 18, color: i < 3 ? "secondary.main" : "text.secondary"}}>
                                                    {i + 1}
                                                </Typography>
                                                <Avatar variant="rounded" src={p.img} sx={{width: 36, height: 36, bgcolor: "background.default"}}>
                                                    <InventoryOutlined sx={{fontSize: 16}}/>
                                                </Avatar>
                                                <Box sx={{flex: 1, minWidth: 0}}>
                                                    <Typography variant="body2" sx={{fontWeight: 500}} noWrap>{p.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{p.sales} sold</Typography>
                                                </Box>
                                                <Typography variant="body2" sx={{fontFamily: "'GoogleSans', sans-serif", fontWeight: 700, color: "text.green"}}>
                                                    £{p.revenue.toLocaleString()}
                                                </Typography>
                                            </Stack>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{py: 4, textAlign: "center"}}>No product data yet</Typography>
                                )}
                            </ChartCard>
                        </Grid>
                    </Grid>

                    {/* Bottom Row */}
                    <Grid container spacing={2.5}>
                        {/* Recent Orders */}
                        <Grid size={{xs: 12, md: 8}}>
                            <ChartCard title="Recent Orders" subtitle="Latest order activity" delay={0.3}
                                action={<Link to="/orders" style={{textDecoration: "none"}}><Button size="small" variant="outlined" color="secondary" endIcon={<ArrowForward sx={{fontSize: 12}}/>}>All Orders</Button></Link>}>
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
                                            <TableRow><TableCell colSpan={5}><Typography variant="body2" color="text.secondary" align="center">No orders</Typography></TableCell></TableRow>
                                        ) : recentOrders.map(order => (
                                            <TableRow key={order._id} sx={{"&:hover": {backgroundColor: "action.hover"}}}>
                                                <TableCell>
                                                    <Link to={`/orders/${order._id}`} style={{textDecoration: "none"}}>
                                                        <Typography variant="body2" color="secondary.main" sx={{fontWeight: 500}}>{order.number}</Typography>
                                                    </Link>
                                                </TableCell>
                                                <TableCell><Typography variant="body2">{(() => { const c = order.customer_id ?? order.customer; if (!c) return "—"; if (typeof c === "object") return c.display_name || c.name || (c.first_name ? `${c.first_name} ${c.last_name || ""}`.trim() : c.email || "—"); return "—"; })()}</Typography></TableCell>
                                                <TableCell><Chip label={order.status} size="small" color={statusChipColor(order.status)} sx={{textTransform: "capitalize", fontWeight: 500}}/></TableCell>
                                                <TableCell align="right"><Typography variant="body2" sx={{fontFamily: "'GoogleSans', sans-serif", fontWeight: 600}}>£{Number(order.total?.amount || 0).toFixed(2)}</Typography></TableCell>
                                                <TableCell><Typography variant="caption" color="text.secondary">{moment(order.date_created || order.created_at || order.createdAt).fromNow()}</Typography></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ChartCard>
                        </Grid>

                        {/* Quick Stats + Revenue by Status */}
                        <Grid size={{xs: 12, md: 4}}>
                            <Stack spacing={2.5} sx={{height: "100%"}}>
                                {/* Revenue by Status */}
                                <ChartCard title="Revenue by Status" delay={0.35}>
                                    <Stack spacing={1.5}>
                                        {Object.entries(statusGroups).map(([status, data]) => {
                                            const pct = totalRevenue > 0 ? (data.total / totalRevenue) * 100 : 0;
                                            return (
                                                <Box key={status}>
                                                    <Stack direction="row" justifyContent="space-between" sx={{mb: 0.5}}>
                                                        <Typography variant="caption" sx={{textTransform: "capitalize", fontWeight: 500}}>{status}</Typography>
                                                        <Typography variant="caption" sx={{fontFamily: "'GoogleSans', sans-serif", fontWeight: 600}}>£{data.total.toLocaleString()}</Typography>
                                                    </Stack>
                                                    <Box sx={{width: "100%", height: 6, borderRadius: 3, backgroundColor: "divider", overflow: "hidden"}}>
                                                        <motion.div
                                                            initial={{width: 0}}
                                                            animate={{width: `${pct}%`}}
                                                            transition={{duration: 0.8, delay: 0.5, ease: "easeOut"}}
                                                            style={{height: "100%", borderRadius: 3, backgroundColor: STATUS_COLORS[status] || "#9CA3AF"}}
                                                        />
                                                    </Box>
                                                </Box>
                                            );
                                        })}
                                    </Stack>
                                </ChartCard>

                                {/* Quick Links */}
                                <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5, delay: 0.4}}>
                                    <Paper elevation={0} sx={{p: 2.5}}>
                                        <Typography variant="subtitle2" sx={{fontWeight: 600, mb: 1.5}}>Quick Actions</Typography>
                                        <Stack spacing={1}>
                                            {[
                                                {label: "Add Product", path: "/product/new", icon: <InventoryOutlined sx={{fontSize: 16}}/>},
                                                {label: "View Customers", path: "/customers", icon: <PeopleOutlined sx={{fontSize: 16}}/>},
                                                {label: "Manage Coupons", path: "/coupons", icon: <StarOutlined sx={{fontSize: 16}}/>},
                                                {label: "Payment Gateways", path: "/payment-gateways", icon: <ReceiptOutlined sx={{fontSize: 16}}/>},
                                            ].map(item => (
                                                <Link key={item.path} to={item.path} style={{textDecoration: "none"}}>
                                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{
                                                        p: 1, borderRadius: 1, cursor: "pointer",
                                                        transition: "all 0.2s",
                                                        "&:hover": {backgroundColor: "light.secondary"},
                                                    }}>
                                                        <Box sx={{
                                                            width: 30, height: 30, borderRadius: 1,
                                                            backgroundColor: "light.secondary", color: "secondary.main",
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                        }}>
                                                            {item.icon}
                                                        </Box>
                                                        <Typography variant="body2" sx={{color: "text.primary", fontWeight: 500, flex: 1}}>{item.label}</Typography>
                                                        <ArrowForward sx={{fontSize: 14, color: "text.secondary"}}/>
                                                    </Stack>
                                                </Link>
                                            ))}
                                        </Stack>
                                    </Paper>
                                </motion.div>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default OverviewPage;
