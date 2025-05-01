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
import React, {useState} from "react";
import {DatePicker} from "@mui/x-date-pickers";
import CustomerProfile from "../../components/shared/customer-profile.jsx";
import moment from "moment";
import {useSelector} from "react-redux";
import {selectCustomer} from "../../redux/features/customers/customers-slice";
import {selectOrder} from "../../redux/features/orders/orders-slice";
import Order from "../../components/shared/order.jsx";
import Empty from "../../components/shared/empty.jsx";
import {motion} from "framer-motion";
import {Close, SearchOutlined} from "@mui/icons-material";

const OrdersPage = () => {

    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("all");
    const [startDate, setStartDate] = useState(moment(new Date()));
    const [endDate, setEndDate] = useState(moment(new Date()));
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const {customers} = useSelector(selectCustomer);
    const {orders, orderLoading, orderError} = useSelector(selectOrder)

    const handleSearch = () => {
        console.log(query)
    }

    return (
        <Layout>
            {orderLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {orderError && (
                    <Alert severity="error" variant="standard">
                        <AlertTitle>
                            {orderError}
                        </AlertTitle>
                    </Alert>
                )}
                <Container>
                    <Grid spacing={4} container={true} alignItems="center" justifyContent="space-between">
                        <Grid item={true} size={{xs: 12, md: 'auto'}}>
                            <Grid container={true} spacing={2} alignItems="center">
                                <Grid item={true} size={{xs: 12, md: 'auto'}}>
                                    <Typography variant="h4" sx={{color: "text.secondary"}}>Orders</Typography>
                                </Grid>
                                <Grid item={true} size={{xs: 12, md: 'auto'}}>
                                    <Link
                                        to="/order/new"
                                        style={{textDecoration: "none", width: "100%", display: "block"}}>
                                        <Button
                                            sx={{
                                                textTransform: "capitalize",
                                                borderWidth: 2
                                            }}
                                            size="small"
                                            color="secondary"
                                            variant="outlined"
                                            fullWidth={true}>Add Order</Button>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item={true} size={{xs: 12, md: 'auto'}}>
                            <Grid container={true} spacing={2} alignItems="center">
                                <Grid item={true} size={{xs: 12, md: 8}}>
                                    <Stack
                                        divider={
                                            <Divider
                                                sx={{color: "light.secondary", backgroundColor: "light.secondary"}}
                                                flexItem={true}
                                                variant="inset"
                                                light={true}
                                                orientation="vertical"
                                            />
                                        }
                                        sx={{
                                            backgroundColor: "background.paper",
                                            borderRadius: 3,
                                            padding: 1,
                                            px: 2
                                        }}
                                        spacing={2}
                                        alignItems="center"
                                        direction="row">
                                        <TextField
                                            value={query}
                                            size="small"
                                            onChange={event => setQuery(event.target.value)}
                                            fullWidth={true}
                                            variant="standard"
                                            type="text"
                                            placeholder="Search orders..."
                                            InputProps={{disableUnderline: true}}
                                        />
                                        <SearchOutlined
                                            onClick={handleSearch}
                                            sx={{color: "background.icon"}}
                                            color="secondary"
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item={true} size={{xs: 12, md: 4}}>
                                    <Button
                                        sx={{
                                            textTransform: "capitalize",
                                            borderWidth: 2
                                        }}
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                        fullWidth={true}>Search Orders</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Divider variant="fullWidth" sx={{my: 4}}/>

                    <Grid container={true} spacing={2} alignItems="center">
                        <Grid item={true} size={{xs: 12, md: 3}}>
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
                        <Grid item={true} size={{xs: 12, md: 3}}>
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
                        <Grid item={true} size={{xs: 12, md: 2}}>
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
                                        <MenuItem value="pending payment">Pending Payment</MenuItem>
                                        <MenuItem value="on hold">On Hold</MenuItem>
                                        <MenuItem value="completed">Completed</MenuItem>
                                        <MenuItem value="cancelled">Cancelled</MenuItem>
                                        <MenuItem value="refunded">Refunded</MenuItem>
                                        <MenuItem value="failed">Failed</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Grid>
                        <Grid item={true} size={{xs: 12, md: 4}}>
                            <Grid alignItems="center" container={true} spacing={2}>
                                <Grid item={true} size={{xs: 12, md: 8}}>
                                    <Autocomplete
                                        onChange={(event, value) => setSelectedCustomer(value)}
                                        value={selectedCustomer}
                                        size="small"
                                        getOptionLabel={option => option.name}
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
                                <Grid alignItems="center" item={true} size={{xs: 12, md: 4}}>
                                    <Button
                                        sx={{
                                            textTransform: "capitalize",
                                            borderWidth: 2
                                        }}
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                        fullWidth={true}>Filter</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Divider variant="fullWidth" sx={{my: 4}}/>

                    <TableContainer component={Paper} elevation={0} variant="elevation">
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

                    {orders && orders.length === 0 ? (
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
                                                borderRadius: '30%',
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
                                            sx={{
                                                textTransform: "capitalize",
                                                borderWidth: 2
                                            }}
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
                                    {orders.map((order, index) => {
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