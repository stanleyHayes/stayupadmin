import React, {useEffect, useMemo, useState} from "react";
import {
    Box, Button, Chip, Container, Divider, FormControl, Grid, InputLabel,
    LinearProgress, MenuItem, Paper, Select, Stack, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Typography,
    useMediaQuery, useTheme
} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchOrders, selectOrder} from "../../redux/features/orders/orders-slice";
import {LineChart} from "@mui/x-charts/LineChart";
import {BarChart} from "@mui/x-charts/BarChart";
import {PieChart} from "@mui/x-charts/PieChart";
import moment from "moment";
import KPIBox from "../../components/shared/kpi-box.jsx";
import {
    AttachMoneyOutlined, TrendingUpOutlined, TrendingDownOutlined,
    ShoppingCartOutlined, CompareArrowsOutlined, CalendarMonthOutlined,
    AccountBalanceWalletOutlined, ReceiptOutlined, LocalShippingOutlined
} from "@mui/icons-material";

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

const RevenuePage = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const {orders, orderLoading} = useSelector(selectOrder);
    const accent = theme.palette.secondary.main;

    const [startDate, setStartDate] = useState(moment().subtract(12, "months"));
    const [endDate, setEndDate] = useState(moment());
    const [groupBy, setGroupBy] = useState("month");
    const [compareMode, setCompareMode] = useState(false);

    useEffect(() => { dispatch(fetchOrders()); }, [dispatch]);

    const filteredOrders = useMemo(() => {
        if (!orders) return [];
        return orders.filter(o => {
            const d = moment(o.date_created || o.created_at || o.createdAt);
            return d.isSameOrAfter(startDate, "day") && d.isSameOrBefore(endDate, "day");
        });
    }, [orders, startDate, endDate]);

    // Core metrics
    const totalRevenue = filteredOrders.reduce((s, o) => s + Number(o.total?.amount ?? o.total ?? 0), 0);
    const completedRevenue = filteredOrders.filter(o => o.status === "completed").reduce((s, o) => s + Number(o.total?.amount ?? o.total ?? 0), 0);
    const pendingRevenue = filteredOrders.filter(o => o.status === "pending payment" || o.status === "processing").reduce((s, o) => s + Number(o.total?.amount ?? o.total ?? 0), 0);
    const refundedRevenue = filteredOrders.filter(o => o.status === "refunded").reduce((s, o) => s + Number(o.total?.amount ?? o.total ?? 0), 0);
    const totalOrders = filteredOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const shippingRevenue = filteredOrders.reduce((s, o) => s + Number(o.shipping?.fee || 0), 0);
    const discountTotal = filteredOrders.reduce((s, o) => s + Number(o.discount?.amount || 0), 0);
    const taxTotal = filteredOrders.reduce((s, o) => s + Number(o.tax?.amount || 0), 0);
    const netRevenue = completedRevenue - refundedRevenue - discountTotal;

    // Previous period for comparison
    const periodDays = endDate.diff(startDate, "days");
    const prevStart = startDate.clone().subtract(periodDays, "days");
    const prevEnd = startDate.clone().subtract(1, "day");
    const prevOrders = useMemo(() => {
        if (!orders) return [];
        return orders.filter(o => {
            const d = moment(o.date_created || o.created_at || o.createdAt);
            return d.isSameOrAfter(prevStart, "day") && d.isSameOrBefore(prevEnd, "day");
        });
    }, [orders, prevStart, prevEnd]);
    const prevRevenue = prevOrders.reduce((s, o) => s + Number(o.total?.amount ?? o.total ?? 0), 0);
    const revenueTrend = prevRevenue > 0 ? (((totalRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1) : null;

    // Time-series data
    const timeSeriesData = useMemo(() => {
        const labels = [];
        const currentData = [];
        const previousData = [];
        const format = groupBy === "day" ? "MM/DD" : groupBy === "week" ? "[W]WW" : "MMM";
        const unit = groupBy === "day" ? "day" : groupBy === "week" ? "week" : "month";

        let cursor = startDate.clone().startOf(unit);
        const end = endDate.clone().endOf(unit);
        while (cursor.isSameOrBefore(end)) {
            labels.push(cursor.format(format));
            const periodRevenue = filteredOrders
                .filter(o => moment(o.date_created || o.created_at || o.createdAt).isSame(cursor, unit))
                .reduce((s, o) => s + Number(o.total?.amount ?? o.total ?? 0), 0);
            currentData.push(periodRevenue);

            if (compareMode) {
                const prevCursor = cursor.clone().subtract(periodDays, "days");
                const prevPeriodRevenue = (orders || [])
                    .filter(o => moment(o.date_created || o.created_at || o.createdAt).isSame(prevCursor, unit))
                    .reduce((s, o) => s + Number(o.total?.amount ?? o.total ?? 0), 0);
                previousData.push(prevPeriodRevenue);
            }

            cursor.add(1, unit);
        }
        return {labels, current: currentData, previous: previousData};
    }, [filteredOrders, orders, startDate, endDate, groupBy, compareMode, periodDays]);

    // Revenue by payment method
    const paymentBreakdown = useMemo(() => {
        const map = {};
        filteredOrders.forEach(o => {
            const method = o.billing?.method || "Unknown";
            if (!map[method]) map[method] = {method, orders: 0, revenue: 0};
            map[method].orders += 1;
            map[method].revenue += Number(o.total?.amount ?? o.total ?? 0);
        });
        return Object.values(map).sort((a, b) => b.revenue - a.revenue);
    }, [filteredOrders]);

    const paymentPieData = paymentBreakdown.map((p, i) => ({
        id: i, value: p.revenue, label: p.method,
        color: ["#6366F1", "#3B82F6", "#22C55E", "#F59E0B", "#EF4444", "#8B5CF6"][i % 6],
    }));

    // Revenue by status
    const statusBreakdown = useMemo(() => {
        const map = {};
        filteredOrders.forEach(o => {
            const s = o.status || "unknown";
            if (!map[s]) map[s] = {status: s, orders: 0, revenue: 0};
            map[s].orders += 1;
            map[s].revenue += Number(o.total?.amount ?? o.total ?? 0);
        });
        return Object.values(map).sort((a, b) => b.revenue - a.revenue);
    }, [filteredOrders]);

    // Monthly comparison table
    const monthlyComparison = useMemo(() => {
        const data = [];
        for (let i = 0; i < 12; i++) {
            const monthOrders = (orders || []).filter(o => moment(o.date_created || o.created_at || o.createdAt).month() === i);
            const rev = monthOrders.reduce((s, o) => s + Number(o.total?.amount ?? o.total ?? 0), 0);
            const count = monthOrders.length;
            data.push({month: moment().month(i).format("MMMM"), revenue: rev, orders: count, avg: count > 0 ? rev / count : 0});
        }
        return data;
    }, [orders]);

    const chartHeight = isMobile ? 220 : 300;
    const statusColors = {completed: "success", processing: "info", "pending payment": "warning", "on-hold": "warning", refunded: "default", cancelled: "default", failed: "error"};

    return (
        <Layout>
            {orderLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                <Container>
                    {/* Header */}
                    <Stack direction={{xs: "column", md: "row"}} alignItems={{xs: "flex-start", md: "center"}} justifyContent="space-between" spacing={2} sx={{mb: 3}}>
                        <Box>
                            <Typography variant="h4" sx={{color: "text.heading", fontWeight: 700}}>Revenue</Typography>
                            <Typography variant="body2" color="text.secondary">Track, analyze, and compare your revenue performance</Typography>
                        </Box>
                        <Stack direction={{xs: "column", sm: "row"}} spacing={1.5} alignItems={{xs: "stretch", sm: "center"}}>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <Stack direction="row" spacing={1}>
                                    <DatePicker label="From" value={startDate} onChange={d => setStartDate(d)} slotProps={{textField: {size: "small", sx: {maxWidth: 150}}}}/>
                                    <DatePicker label="To" value={endDate} onChange={d => setEndDate(d)} slotProps={{textField: {size: "small", sx: {maxWidth: 150}}}}/>
                                </Stack>
                            </LocalizationProvider>
                            <Stack direction="row" spacing={1}>
                                <FormControl size="small" sx={{minWidth: 100}}>
                                    <InputLabel>Group By</InputLabel>
                                    <Select value={groupBy} onChange={e => setGroupBy(e.target.value)} label="Group By">
                                        <MenuItem value="day">Day</MenuItem>
                                        <MenuItem value="week">Week</MenuItem>
                                        <MenuItem value="month">Month</MenuItem>
                                    </Select>
                                </FormControl>
                                <Button size="small" variant={compareMode ? "contained" : "outlined"} color="secondary" onClick={() => setCompareMode(!compareMode)} startIcon={<CompareArrowsOutlined/>}>
                                    Compare
                                </Button>
                            </Stack>
                        </Stack>
                    </Stack>

                    <Divider sx={{mb: 3}}/>

                    {/* Top KPI Row */}
                    <Grid container spacing={2} sx={{mb: 3}}>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Total Revenue" value={`£${totalRevenue.toLocaleString()}`} icon={<AttachMoneyOutlined fontSize="small"/>} iconColor="text.green" iconBg="light.green" trend={revenueTrend ? Number(revenueTrend) : null}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Net Revenue" value={`£${netRevenue.toLocaleString()}`} icon={<AccountBalanceWalletOutlined fontSize="small"/>} iconColor="secondary.main" iconBg="light.secondary"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Avg Order Value" value={`£${avgOrderValue.toFixed(2)}`} icon={<TrendingUpOutlined fontSize="small"/>} iconColor="text.orange" iconBg="light.orange"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Orders" value={totalOrders} icon={<ShoppingCartOutlined fontSize="small"/>} iconColor="text.blue" iconBg="light.blue"/>
                        </Grid>
                    </Grid>

                    {/* Secondary KPI Row */}
                    <Grid container spacing={2} sx={{mb: 4}}>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Completed" value={`£${completedRevenue.toLocaleString()}`} icon={<AttachMoneyOutlined fontSize="small"/>} iconColor="text.green" iconBg="light.green"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Pending" value={`£${pendingRevenue.toLocaleString()}`} icon={<CalendarMonthOutlined fontSize="small"/>} iconColor="text.orange" iconBg="light.orange"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Refunded" value={`£${refundedRevenue.toLocaleString()}`} icon={<TrendingDownOutlined fontSize="small"/>} iconColor="text.red" iconBg="light.red"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Shipping Fees" value={`£${shippingRevenue.toFixed(2)}`} icon={<LocalShippingOutlined fontSize="small"/>} iconColor="text.blue" iconBg="light.blue"/>
                        </Grid>
                    </Grid>

                    {/* Main Revenue Chart */}
                    <Paper elevation={0} sx={{p: 3, mb: 3}}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 2}}>
                            <Box>
                                <Typography variant="subtitle1" sx={{fontWeight: 600}}>Revenue Over Time</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {startDate.format("MMM D, YYYY")} — {endDate.format("MMM D, YYYY")}
                                    {compareMode && " (vs previous period)"}
                                </Typography>
                            </Box>
                            <Stack direction="row" spacing={1}>
                                {[{l: "7D", v: 7}, {l: "30D", v: 30}, {l: "90D", v: 90}, {l: "6M", v: 180}, {l: "1Y", v: 365}].map(p => (
                                    <Button key={p.l} size="small" variant="outlined" color="secondary" sx={{minWidth: 40}} onClick={() => {
                                        setStartDate(moment().subtract(p.v, "days"));
                                        setEndDate(moment());
                                    }}>
                                        {p.l}
                                    </Button>
                                ))}
                            </Stack>
                        </Stack>
                        <LineChart
                            xAxis={[{scaleType: "point", data: timeSeriesData.labels}]}
                            series={[
                                {data: timeSeriesData.current, label: "Current Period (£)", color: accent, area: true, showMark: false},
                                ...(compareMode && timeSeriesData.previous.length > 0
                                    ? [{data: timeSeriesData.previous, label: "Previous Period (£)", color: "#94A3B8", showMark: false}]
                                    : []),
                            ]}
                            height={chartHeight}
                            margin={{left: 70, right: 20, top: 20, bottom: 30}}
                            sx={{"& .MuiAreaElement-root": {fillOpacity: 0.1}}}
                        />
                    </Paper>

                    {/* Charts Row */}
                    <Grid container spacing={3} sx={{mb: 3}}>
                        <Grid size={{xs: 12, md: 5}}>
                            <ChartCard title="Revenue by Payment Method" subtitle="Breakdown by payment type">
                                {paymentPieData.length > 0 ? (
                                    <PieChart
                                        series={[{data: paymentPieData, innerRadius: 45, outerRadius: 90, paddingAngle: 3, cornerRadius: 4}]}
                                        height={200}
                                        margin={{top: 5, bottom: 5, left: 5, right: 5}}
                                        slotProps={{legend: {hidden: true}}}
                                    />
                                ) : (
                                    <Box sx={{height: 200, display: "flex", alignItems: "center", justifyContent: "center"}}>
                                        <Typography variant="body2" color="text.secondary">No data</Typography>
                                    </Box>
                                )}
                                <Stack spacing={0.75} sx={{mt: 2}}>
                                    {paymentBreakdown.map((p, i) => (
                                        <Stack key={i} direction="row" spacing={1} alignItems="center">
                                            <Box sx={{width: 8, height: 8, borderRadius: 1, bgcolor: paymentPieData[i]?.color, flexShrink: 0}}/>
                                            <Typography variant="caption" sx={{flex: 1}}>{p.method}</Typography>
                                            <Typography variant="caption" color="text.secondary">{p.orders} orders</Typography>
                                            <Typography variant="caption" sx={{fontWeight: 600}}>£{p.revenue.toLocaleString()}</Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                            </ChartCard>
                        </Grid>
                        <Grid size={{xs: 12, md: 7}}>
                            <ChartCard title="Revenue by Status" subtitle="How revenue breaks down by order status">
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Status</TableCell>
                                                <TableCell align="right">Orders</TableCell>
                                                <TableCell align="right">Revenue</TableCell>
                                                <TableCell align="right">% of Total</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {statusBreakdown.map((s, i) => (
                                                <TableRow key={i}>
                                                    <TableCell><Chip label={s.status} size="small" color={statusColors[s.status] || "default"} sx={{textTransform: "capitalize"}}/></TableCell>
                                                    <TableCell align="right"><Typography variant="body2">{s.orders}</Typography></TableCell>
                                                    <TableCell align="right"><Typography variant="body2" sx={{fontWeight: 600}}>£{s.revenue.toLocaleString()}</Typography></TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body2" color="text.secondary">
                                                            {totalRevenue > 0 ? ((s.revenue / totalRevenue) * 100).toFixed(1) : 0}%
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </ChartCard>
                        </Grid>
                    </Grid>

                    {/* Financials Summary */}
                    <Grid container spacing={3} sx={{mb: 3}}>
                        <Grid size={{xs: 12, md: 4}}>
                            <Paper elevation={0} sx={{p: 3, height: "100%", borderColor: "border.secondary", borderWidth: 1.5, borderStyle: "solid"}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Financial Summary</Typography>
                                <Stack spacing={1.5}>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">Gross Revenue</Typography>
                                        <Typography variant="body2" sx={{fontWeight: 600}}>£{totalRevenue.toLocaleString()}</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">Shipping Collected</Typography>
                                        <Typography variant="body2">£{shippingRevenue.toFixed(2)}</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">Tax Collected</Typography>
                                        <Typography variant="body2">£{taxTotal.toFixed(2)}</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2" sx={{color: "text.red"}}>Discounts Given</Typography>
                                        <Typography variant="body2" sx={{color: "text.red"}}>-£{discountTotal.toFixed(2)}</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2" sx={{color: "text.red"}}>Refunds Issued</Typography>
                                        <Typography variant="body2" sx={{color: "text.red"}}>-£{refundedRevenue.toLocaleString()}</Typography>
                                    </Stack>
                                    <Divider/>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="subtitle2" sx={{fontWeight: 700}}>Net Revenue</Typography>
                                        <Typography variant="subtitle2" sx={{fontWeight: 700, color: "secondary.main", fontSize: 16}}>£{netRevenue.toLocaleString()}</Typography>
                                    </Stack>
                                </Stack>
                            </Paper>
                        </Grid>
                        <Grid size={{xs: 12, md: 8}}>
                            <Paper elevation={0} sx={{p: 3, height: "100%"}}>
                                <Typography variant="subtitle1" sx={{mb: 0.5, fontWeight: 600}}>Monthly Breakdown</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{mb: 2, display: "block"}}>Revenue performance month over month</Typography>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Month</TableCell>
                                                <TableCell align="right">Orders</TableCell>
                                                <TableCell align="right">Revenue</TableCell>
                                                <TableCell align="right">Avg Order</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {monthlyComparison.filter(m => m.revenue > 0 || m.orders > 0).map((m, i) => (
                                                <TableRow key={i}>
                                                    <TableCell><Typography variant="body2" sx={{fontWeight: 500}}>{m.month}</Typography></TableCell>
                                                    <TableCell align="right"><Typography variant="body2">{m.orders}</Typography></TableCell>
                                                    <TableCell align="right"><Typography variant="body2" sx={{fontWeight: 600, color: "text.green"}}>£{m.revenue.toLocaleString()}</Typography></TableCell>
                                                    <TableCell align="right"><Typography variant="body2" color="text.secondary">£{m.avg.toFixed(2)}</Typography></TableCell>
                                                </TableRow>
                                            ))}
                                            {monthlyComparison.every(m => m.revenue === 0 && m.orders === 0) && (
                                                <TableRow><TableCell colSpan={4}><Typography variant="body2" color="text.secondary" align="center">No data for this period</Typography></TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Period Comparison */}
                    {prevRevenue > 0 && (
                        <Paper elevation={0} sx={{p: 3}}>
                            <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Period Comparison</Typography>
                            <Grid container spacing={3}>
                                <Grid size={{xs: 12, sm: 4}}>
                                    <Box sx={{p: 2, borderRadius: 1, backgroundColor: "light.secondary", textAlign: "center"}}>
                                        <Typography variant="caption" color="text.secondary">Current Period</Typography>
                                        <Typography variant="h5" sx={{fontWeight: 700, color: "secondary.main"}}>£{totalRevenue.toLocaleString()}</Typography>
                                        <Typography variant="caption" color="text.secondary">{filteredOrders.length} orders</Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{xs: 12, sm: 4}}>
                                    <Box sx={{p: 2, borderRadius: 1, backgroundColor: "light.default", textAlign: "center"}}>
                                        <Typography variant="caption" color="text.secondary">Previous Period</Typography>
                                        <Typography variant="h5" sx={{fontWeight: 700}}>£{prevRevenue.toLocaleString()}</Typography>
                                        <Typography variant="caption" color="text.secondary">{prevOrders.length} orders</Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{xs: 12, sm: 4}}>
                                    <Box sx={{p: 2, borderRadius: 1, backgroundColor: Number(revenueTrend) >= 0 ? "light.green" : "light.red", textAlign: "center"}}>
                                        <Typography variant="caption" color="text.secondary">Change</Typography>
                                        <Typography variant="h5" sx={{fontWeight: 700, color: Number(revenueTrend) >= 0 ? "text.green" : "text.red"}}>
                                            {Number(revenueTrend) >= 0 ? "+" : ""}{revenueTrend}%
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {Number(revenueTrend) >= 0 ? "Growth" : "Decline"} vs previous
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    )}
                </Container>
            </Box>
        </Layout>
    );
};

export default RevenuePage;
