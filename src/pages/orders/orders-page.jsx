import Layout from "../../components/shared/layout.jsx";
import {
    Alert,
    AlertTitle,
    Autocomplete,
    Box,
    Button,
    Container,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    LinearProgress,
    MenuItem, Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import React, {useEffect, useMemo, useState} from "react";
import {DatePicker} from "@mui/x-date-pickers";
import CustomerProfile from "../../components/shared/customer-profile.jsx";
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import {fetchCustomers, selectCustomer} from "../../redux/features/customers/customers-slice";
import {fetchOrders, selectOrder} from "../../redux/features/orders/orders-slice";
import Order from "../../components/shared/order.jsx";
import Empty from "../../components/shared/empty.jsx";
import {motion} from "framer-motion";
import {Close, ShoppingCartOutlined, AttachMoneyOutlined, LocalShippingOutlined, CancelOutlined} from "@mui/icons-material";
import KPIBox from "../../components/shared/kpi-box.jsx";
import PageHeader from "../../components/shared/page-header.jsx";
import {ListSkeleton} from "../../components/shared/page-skeleton.jsx";

const OrdersPage = () => {
    const dispatch = useDispatch();
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("all");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const {customers} = useSelector(selectCustomer);
    const {orders, orderLoading, orderError} = useSelector(selectOrder);

    useEffect(() => { dispatch(fetchOrders()); dispatch(fetchCustomers()); }, [dispatch]);

    const totalOrders = orders?.length || 0;
    const revenue = orders ? orders.reduce((sum, o) => sum + Number(o.total || 0), 0) : 0;
    const completedOrders = orders?.filter(o => o.status === "completed" || o.status === "delivered").length || 0;
    const pendingOrders = orders?.filter(o => o.status === "pending" || o.status === "processing").length || 0;
    const shippedOrders = orders?.filter(o => o.status === "shipped" || o.status === "in-transit").length || 0;

    const filteredOrders = useMemo(() => {
        if (!Array.isArray(orders)) return [];
        const q = query.trim().toLowerCase();
        return orders.filter(o => {
            if (status !== "all" && o.status !== status) return false;
            const custId = typeof o.customer_id === "object" ? o.customer_id?._id : o.customer_id;
            if (selectedCustomer && custId !== selectedCustomer._id) return false;
            const dateStr = o.date_created || o.created_at || o.createdAt;
            if (dateStr) {
                const d = moment(dateStr);
                if (startDate && d.isBefore(moment(startDate).startOf("day"))) return false;
                if (endDate && d.isAfter(moment(endDate).endOf("day"))) return false;
            }
            if (!q) return true;
            const c = o.customer_id ?? o.customer;
            const custName = typeof c === "object" ? (c?.display_name || c?.name || c?.first_name || "") : "";
            return [o.number, custName, o.status].join(" ").toLowerCase().includes(q);
        });
    }, [orders, query, status, selectedCustomer, startDate, endDate]);

    if (orderLoading && orders.length === 0) return <Layout><Box sx={{pt: 4, pb: 6}}><ListSkeleton cols={6}/></Box></Layout>;

    return (
        <Layout>
            {orderLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {orderError && (
                    <Alert severity="error" sx={{mb: 2}}>
                        <AlertTitle>
                            {orderError}
                        </AlertTitle>
                    </Alert>
                )}
                <Container>
                    <PageHeader
                        title="Orders"
                        query={query}
                        onQueryChange={setQuery}
                        searchPlaceholder="Search orders..."
                        action={
                            <Link to="/order/new" style={{textDecoration: "none"}}>
                                <Button size="small" color="secondary" variant="contained">Add Order</Button>
                            </Link>
                        }
                    />

                    <Divider variant="fullWidth" sx={{my: 3}}/>

                    <Grid container spacing={2} sx={{mt: 3, mb: 4}}>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Total Orders" value={totalOrders} icon={<ShoppingCartOutlined/>} iconColor="secondary.main" iconBg="light.secondary"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Pending" value={pendingOrders} icon={<CancelOutlined/>} iconColor="text.orange" iconBg="light.orange"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Shipped" value={shippedOrders} icon={<LocalShippingOutlined/>} iconColor="text.blue" iconBg="light.blue"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Completed" value={completedOrders} icon={<AttachMoneyOutlined/>} iconColor="text.green" iconBg="light.green"/>
                        </Grid>
                    </Grid>

                    <Grid container={true} spacing={2} alignItems="center">
                        <Grid size={{xs: 12, md: 3}}>
                            <DatePicker
                                slotProps={{
                                    textField: {
                                        size: "small",
                                        fullWidth: true
                                    }
                                }}
                                value={startDate}
                                onChange={date => setStartDate(date)}
                                disableFuture={true}
                                label="Start Date"
                            />
                        </Grid>
                        <Grid size={{xs: 12, md: 3}}>
                            <DatePicker
                                slotProps={{
                                    textField: {
                                        size: "small",
                                        fullWidth: true
                                    }
                                }}
                                value={endDate}
                                onChange={date => setEndDate(date)}
                                disableFuture={true}
                                label="End Date"
                            />
                        </Grid>
                        <Grid size={{xs: 12, md: 2}}>
                            <Box>
                                <FormControl fullWidth={true} variant="outlined">
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        onChange={event => setStatus(event.target.value)}
                                        value={status}
                                        fullWidth={true}
                                        size="small"
                                        label="Status"
                                        variant="outlined">
                                        <MenuItem value="all">All</MenuItem>
                                        <MenuItem value="pending">Pending</MenuItem>
                                        <MenuItem value="processing">Processing</MenuItem>
                                        <MenuItem value="on-hold">On Hold</MenuItem>
                                        <MenuItem value="shipped">Shipped</MenuItem>
                                        <MenuItem value="in-transit">In Transit</MenuItem>
                                        <MenuItem value="delivered">Delivered</MenuItem>
                                        <MenuItem value="completed">Completed</MenuItem>
                                        <MenuItem value="cancelled">Cancelled</MenuItem>
                                        <MenuItem value="refunded">Refunded</MenuItem>
                                        <MenuItem value="failed">Failed</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Grid>
                        <Grid size={{xs: 12, md: 4}}>
                            <Grid alignItems="center" container={true} spacing={2}>
                                <Grid size={{xs: 12, md: 8}}>
                                    <Autocomplete
                                        onChange={(event, value) => setSelectedCustomer(value)}
                                        value={selectedCustomer}
                                        size="small"
                                        getOptionLabel={option => option?.display_name || option?.name || (option?.first_name ? `${option.first_name} ${option.last_name || ""}`.trim() : option?.email || "")}
                                        renderOption={(props, option) =>
                                            (
                                                <Box {...props}>
                                                    <CustomerProfile customer={option}/>
                                                </Box>
                                            )
                                        }
                                        noOptionsText="No customers found"
                                        fullWidth={true}
                                        clearOnEscape={true}
                                        clearOnBlur={true}
                                        renderInput={params => (
                                            <TextField
                                                placeholder="Search by registered customer"
                                                label="Search customer" {...params}
                                            />
                                        )}
                                        options={customers}
                                    />
                                </Grid>
                                <Grid alignItems="center" size={{xs: 12, md: 4}}>
                                    <Button
                                        onClick={() => {}}
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                        fullWidth={true}>Filter</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Divider variant="fullWidth" sx={{my: 4}}/>

                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Customer</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Total</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                        </Table>
                    </TableContainer>

                    {filteredOrders.length === 0 ? (
                        <Box>
                            <Empty
                                icon={
                                    <Box component={motion.div} exit={{}}>
                                        <Close
                                            sx={{
                                                padding: 1,
                                                fontSize: 36,
                                                borderWidth: 1,
                                                borderStyle: "solid",
                                                borderRadius: 1,
                                                borderColor: "light.secondary",
                                                color: "secondary.main",
                                                backgroundColor: "light.secondary",
                                                cursor: "pointer"
                                            }}
                                        />
                                    </Box>
                                }
                                title="Orders"
                                message="No orders available"
                                button={
                                    <Link to="/order/new" style={{textDecoration: "none"}}>
                                        <Button
                                            size="small"
                                            color="secondary"
                                            variant="outlined"
                                            fullWidth={true}>Create Order</Button>
                                    </Link>
                                }
                            />
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableBody>
                                    {filteredOrders.map((order, index) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <Order order={order}/>
                                            </React.Fragment>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Container>
            </Box>
        </Layout>
    )
}

export default OrdersPage;