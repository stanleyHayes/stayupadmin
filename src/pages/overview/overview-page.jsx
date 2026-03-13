// src/pages/overview/OverviewPage.jsx
import React, { useMemo, useState } from "react";
import Layout from "../../components/shared/layout.jsx";
import {
    Box,
    Chip,
    Container,
    Divider,
    Button,
    Grid,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { LineChart, BarChart, PieChart } from "@mui/x-charts";
import KPIBox from "../../components/shared/kpi-box.jsx";
import {
    AttachMoneyOutlined,
    ShoppingCartOutlined,
    PeopleOutlined,
    ReceiptOutlined,
} from "@mui/icons-material";

const statusChipSx = (status) => {
    const map = {
        Completed:  { color: "text.green",      bg: "light.green" },
        Processing: { color: "text.processing", bg: "light.processing" },
        Pending:    { color: "text.pending",    bg: "light.pending" },
        Refunded:   { color: "text.refunded",   bg: "light.refunded" },
    };
    const s = map[status] ?? { color: "text.secondary", bg: "light.grey" };
    return { color: s.color, backgroundColor: s.bg, fontWeight: 500, fontSize: "0.72rem" };
};

const ChartCard = ({ title, children }) => (
    <Paper
        elevation={0}
        sx={{
            p: { xs: 2, sm: 2.5 },
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "border.default",
            height: "100%",
            overflow: "hidden",
        }}
    >
        <Typography variant="subtitle1" sx={{ mb: 1.5 }}>{title}</Typography>
        {children}
    </Paper>
);

const OverviewPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.down("md"));

    const [startDate, setStartDate] = useState(moment().subtract(30, "days"));
    const [endDate, setEndDate] = useState(moment());

    const revenueData = useMemo(() => {
        const days = [];
        const revenue = [];
        const orders = [];
        const points = isMobile ? 7 : 14;
        for (let i = points - 1; i >= 0; i--) {
            const d = moment(endDate).clone().subtract(i, "days");
            days.push(d.format("MM/DD"));
            revenue.push(200 + Math.round(Math.random() * 1800));
            orders.push(5 + Math.round(Math.random() * 40));
        }
        return { days, revenue, orders };
    }, [endDate, isMobile]);

    const categorySales = [
        { label: "Clothing",    value: 4200 },
        { label: "Shoes",       value: 3100 },
        { label: "Electronics", value: 2600 },
        { label: "Home",        value: 1900 },
    ];

    const orderStatusData = [
        { label: "Completed",  value: 62, color: "#22C55E" },
        { label: "Processing", value: 21, color: "#3B82F6" },
        { label: "Pending",    value: 9,  color: "#EAB308" },
        { label: "Refunded",   value: 8,  color: "#EF4444" },
    ];

    const recentOrders = [
        { id: "ORD-1005", customer: "Jane Doe",     total: "$189.00", status: "Completed",  date: "2025-11-17" },
        { id: "ORD-1004", customer: "Kwame Mensah", total: "$79.00",  status: "Processing", date: "2025-11-17" },
        { id: "ORD-1003", customer: "Aisha Kamara", total: "$320.00", status: "Completed",  date: "2025-11-16" },
        { id: "ORD-1002", customer: "John Smith",   total: "$59.99",  status: "Pending",    date: "2025-11-16" },
    ];

    const chartHeight = isMobile ? 220 : 280;

    return (
        <Layout>
            <Container sx={{ py: 4 }}>

                {/* Header */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    justifyContent="space-between"
                    spacing={2}
                    sx={{ mb: 3 }}
                >
                    <Box>
                        <Typography variant="h4" sx={{ color: "text.heading" }}>Overview</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Snapshot of your store performance
                        </Typography>
                    </Box>

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.5}
                        alignItems={{ xs: "stretch", sm: "center" }}
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                    >
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <Stack direction="row" spacing={1.5}>
                                <DatePicker
                                    label="Start"
                                    value={startDate}
                                    onChange={(d) => setStartDate(d)}
                                    slotProps={{ textField: { size: "small", sx: { flex: 1 } } }}
                                />
                                <DatePicker
                                    label="End"
                                    value={endDate}
                                    onChange={(d) => setEndDate(d)}
                                    slotProps={{ textField: { size: "small", sx: { flex: 1 } } }}
                                />
                            </Stack>
                        </LocalizationProvider>
                        <Button
                            size="small"
                            variant="outlined"
                            fullWidth={isMobile}
                            onClick={() => {
                                setStartDate(moment().subtract(30, "days"));
                                setEndDate(moment());
                            }}
                        >
                            Last 30 days
                        </Button>
                    </Stack>
                </Stack>

                <Divider sx={{ mb: 3 }} />

                {/* KPIs — 2-up on mobile, 4-up on desktop */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <KPIBox
                            label="Total Revenue"
                            value="$24,320"
                            subtitle="Last 30 days"
                            trend={12.4}
                            icon={<AttachMoneyOutlined fontSize="small" />}
                            iconColor="text.green"
                            iconBg="light.green"
                        />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <KPIBox
                            label="Total Orders"
                            value="1,284"
                            subtitle="All channels"
                            trend={8.1}
                            icon={<ShoppingCartOutlined fontSize="small" />}
                            iconColor="text.blue"
                            iconBg="light.blue"
                        />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <KPIBox
                            label="Avg. Order Value"
                            value="$18.93"
                            subtitle="Per order"
                            trend={-2.3}
                            icon={<ReceiptOutlined fontSize="small" />}
                            iconColor="text.orange"
                            iconBg="light.orange"
                        />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <KPIBox
                            label="New Customers"
                            value="312"
                            subtitle="Last 30 days"
                            trend={5.7}
                            icon={<PeopleOutlined fontSize="small" />}
                            iconColor="secondary.main"
                            iconBg="light.secondary"
                        />
                    </Grid>
                </Grid>

                {/* Charts row 1 */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <ChartCard title="Revenue & Orders">
                            <Box sx={{ overflowX: "auto" }}>
                                <LineChart
                                    height={chartHeight}
                                    xAxis={[{ data: revenueData.days, scaleType: "point" }]}
                                    series={[
                                        { data: revenueData.revenue, label: "Revenue", color: "#7C3AED", area: true },
                                        { data: revenueData.orders,  label: "Orders",  color: "#06B6D4" },
                                    ]}
                                    slotProps={{
                                        legend: {
                                            direction: "row",
                                            position: { vertical: "top", horizontal: "right" },
                                        },
                                    }}
                                    margin={{ left: 40, right: 20, top: 16, bottom: 32 }}
                                />
                            </Box>
                        </ChartCard>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <ChartCard title="Sales by Category">
                            <Box sx={{ overflowX: "auto" }}>
                                <BarChart
                                    height={chartHeight}
                                    xAxis={[{
                                        data: categorySales.map((c) => c.label),
                                        scaleType: "band",
                                    }]}
                                    series={[{
                                        data: categorySales.map((c) => c.value),
                                        label: "Sales",
                                        color: "#F97316",
                                    }]}
                                    margin={{ left: 40, right: 10, top: 16, bottom: 40 }}
                                />
                            </Box>
                        </ChartCard>
                    </Grid>
                </Grid>

                {/* Charts row 2 */}
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <ChartCard title="Orders by Status">
                            <Box sx={{ overflowX: "auto" }}>
                                <PieChart
                                    height={isMobile ? 220 : 260}
                                    series={[{
                                        data: orderStatusData.map((s, i) => ({
                                            id: i,
                                            label: s.label,
                                            value: s.value,
                                            color: s.color,
                                        })),
                                        innerRadius: 40,
                                        outerRadius: 90,
                                        paddingAngle: 2,
                                    }]}
                                    slotProps={{
                                        legend: {
                                            direction: isTablet ? "row" : "column",
                                            position: isTablet
                                                ? { vertical: "bottom", horizontal: "middle" }
                                                : { vertical: "middle", horizontal: "right" },
                                        },
                                    }}
                                />
                            </Box>
                        </ChartCard>
                    </Grid>

                    <Grid size={{ xs: 12, md: 8 }}>
                        <ChartCard title="Recent Orders">
                            <Box sx={{ overflowX: "auto" }}>
                                <Table size="small" sx={{ minWidth: 480 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>#</TableCell>
                                            <TableCell>Order</TableCell>
                                            <TableCell>Customer</TableCell>
                                            <TableCell>Total</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Date</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {recentOrders.map((order, index) => (
                                            <TableRow key={order.id}>
                                                <TableCell>
                                                    <Typography variant="caption" color="text.secondary">{index + 1}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{order.id}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" color="text.secondary">{order.customer}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">{order.total}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip size="small" label={order.status} sx={statusChipSx(order.status)} />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="caption" color="text.secondary">{order.date}</Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </ChartCard>
                    </Grid>
                </Grid>

            </Container>
        </Layout>
    );
};

export default OverviewPage;
