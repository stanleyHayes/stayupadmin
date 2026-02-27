// src/pages/overview/OverviewPage.jsx
import React, {useMemo, useState} from "react";
import Layout from "../../components/shared/layout.jsx";
import {
    Box,
    Container,
    Grid,
    Paper,
    Stack,
    Typography,
    Divider,
    Button,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import {LineChart, BarChart, PieChart} from "@mui/x-charts";
import KPIBox from "../../components/shared/kpi-box.jsx";


const OverviewPage = () => {
    const [startDate, setStartDate] = useState(moment().subtract(30, "days"));
    const [endDate, setEndDate] = useState(moment());

    // Fake data – swap out with API/Redux later
    const revenueData = useMemo(() => {
        const days = [];
        const revenue = [];
        const orders = [];
        for (let i = 14; i >= 0; i--) {
            const d = moment(endDate).clone().subtract(i, "days");
            days.push(d.format("MM/DD"));
            revenue.push(200 + Math.round(Math.random() * 1800));
            orders.push(5 + Math.round(Math.random() * 40));
        }
        return {days, revenue, orders};
    }, [endDate]);

    const categorySales = [
        {label: "Clothing", value: 4200},
        {label: "Shoes", value: 3100},
        {label: "Electronics", value: 2600},
        {label: "Home & Kitchen", value: 1900},
    ];

    const orderStatusData = [
        {label: "Completed", value: 62},
        {label: "Processing", value: 21},
        {label: "Pending", value: 9},
        {label: "Refunded", value: 8},
    ];

    const recentOrders = [
        {id: "ORD-1005", customer: "Jane Doe", total: "$189.00", status: "Completed", date: "2025-11-17"},
        {id: "ORD-1004", customer: "Kwame Mensah", total: "$79.00", status: "Processing", date: "2025-11-17"},
        {id: "ORD-1003", customer: "Aisha Kamara", total: "$320.00", status: "Completed", date: "2025-11-16"},
        {id: "ORD-1002", customer: "John Smith", total: "$59.99", status: "Pending", date: "2025-11-16"},
    ];

    return (
        <Layout>
            <Container sx={{py: 4}}>
                {/* Header + filters */}
                <Box
                    sx={{
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        flexWrap: "wrap",
                    }}
                >
                    <Box>
                        <Typography variant="h4" sx={{color: "text.secondary"}}>
                            Overview
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Snapshot of your store performance
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                                label="Start"
                                value={startDate}
                                onChange={(d) => setStartDate(d)}
                                slotProps={{textField: {size: "small"}}}
                            />
                            <DatePicker
                                label="End"
                                value={endDate}
                                onChange={(d) => setEndDate(d)}
                                slotProps={{textField: {size: "small"}}}
                            />
                        </LocalizationProvider>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                                setStartDate(moment().subtract(30, "days"));
                                setEndDate(moment());
                            }}
                        >
                            Last 30 days
                        </Button>
                    </Stack>
                </Box>

                <Divider sx={{mb: 3}}/>

                {/* KPIs */}
                <Grid container spacing={2} sx={{mb: 3}}>
                    <Grid size={{xs: 12, md: 3}}>
                        <KPIBox label="Total Revenue" value="$24,320" subtitle="Last 30 days"/>
                    </Grid>
                    <Grid size={{xs: 12, md: 3}}>
                        <KPIBox label="Total Orders" value="1,284" subtitle="All channels"/>
                    </Grid>
                    <Grid size={{xs: 12, md: 3}}>
                        <KPIBox label="Average Order Value" value="$18.93" subtitle="Per order"/>
                    </Grid>
                    <Grid size={{xs: 12, md: 3}}>
                        <KPIBox label="New Customers" value="312" subtitle="Last 30 days"/>
                    </Grid>
                </Grid>

                {/* Charts row */}
                <Grid container spacing={2} sx={{mb: 3}}>
                    {/* Revenue / orders line chart */}
                    <Grid size={{xs: 12, md: 8}}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderColor: "border.default",
                                height: "100%",
                            }}
                        >
                            <Typography variant="h6" sx={{mb: 1.5}}>
                                Revenue & Orders
                            </Typography>
                            <LineChart
                                height={280}
                                xAxis={[
                                    {
                                        data: revenueData.days,
                                        scaleType: "point",
                                    },
                                ]}
                                series={[
                                    {
                                        data: revenueData.revenue,
                                        label: "Revenue",
                                        color: "#7C3AED", // purple
                                        area: true,
                                    },
                                    {
                                        data: revenueData.orders,
                                        label: "Orders",
                                        color: "#06B6D4", // teal
                                    },
                                ]}
                                slotProps={{
                                    legend: {direction: "row", position: {vertical: "top", horizontal: "right"}},
                                }}
                                margin={{left: 40, right: 20, top: 16, bottom: 32}}
                            />
                        </Paper>
                    </Grid>

                    {/* Category bar chart */}
                    <Grid size={{xs: 12, md: 4}}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderColor: "border.default",
                                height: "100%",
                            }}
                        >
                            <Typography variant="h6" sx={{mb: 1.5}}>
                                Sales by Category
                            </Typography>
                            <BarChart
                                height={280}
                                xAxis={[
                                    {
                                        data: categorySales.map((c) => c.label),
                                        scaleType: "band",
                                    },
                                ]}
                                series={[
                                    {
                                        data: categorySales.map((c) => c.value),
                                        label: "Sales",
                                        color: "#F97316", // orange
                                    },
                                ]}
                                margin={{left: 40, right: 10, top: 16, bottom: 40}}
                            />
                        </Paper>
                    </Grid>
                </Grid>

                {/* Pie chart + recent orders */}
                <Grid container spacing={2}>
                    <Grid size={{xs: 12, md: 4}}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderColor: "border.default",
                                height: "100%",
                            }}
                        >
                            <Typography variant="h6" sx={{mb: 1.5}}>
                                Orders by Status
                            </Typography>
                            <PieChart
                                height={260}
                                series={[
                                    {
                                        data: orderStatusData.map((s, i) => ({
                                            id: i,
                                            label: s.label,
                                            value: s.value,
                                            color:
                                                s.label === "Completed"
                                                    ? "#22C55E" // green
                                                    : s.label === "Processing"
                                                        ? "#3B82F6" // blue
                                                        : s.label === "Pending"
                                                            ? "#EAB308" // yellow
                                                            : "#EF4444", // red
                                        })),
                                        innerRadius: 40,
                                        outerRadius: 90,
                                        paddingAngle: 2,
                                    },
                                ]}
                                slotProps={{
                                    legend: {direction: "column", position: {vertical: "middle", horizontal: "right"}},
                                }}
                            />
                        </Paper>
                    </Grid>
                    <Grid size={{xs: 12, md: 8}}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderColor: "border.default",
                                height: "100%",
                            }}
                        >
                            <Typography variant="h6" sx={{mb: 1.5}}>
                                Recent Orders
                            </Typography>
                            <TableContainer>
                                <Table size="small">
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
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{order.id}</TableCell>
                                                <TableCell>{order.customer}</TableCell>
                                                <TableCell>{order.total}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        size="small"
                                                        label={order.status}
                                                        color={
                                                            order.status === "Completed"
                                                                ? "success"
                                                                : order.status === "Processing"
                                                                    ? "info"
                                                                    : order.status === "Pending"
                                                                        ? "warning"
                                                                        : "default"
                                                        }
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell>{order.date}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Layout>
    );
};

export default OverviewPage;
