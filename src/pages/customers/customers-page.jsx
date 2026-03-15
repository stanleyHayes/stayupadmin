import Layout from "../../components/shared/layout.jsx";
import {
    Alert,
    AlertTitle,
    Box,
    Button,
    Container,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    LinearProgress,
    MenuItem,
    Paper,
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
import React, {useMemo, useState} from "react";
import {DatePicker} from "@mui/x-date-pickers";
import moment from "moment";
import {useSelector} from "react-redux";
import Empty from "../../components/shared/empty.jsx";
import {motion} from "framer-motion";
import {Close, PeopleOutlined, PersonAddOutlined, BlockOutlined, VerifiedUserOutlined} from "@mui/icons-material";
import PageHeader from "../../components/shared/page-header.jsx";
import KPIBox from "../../components/shared/kpi-box.jsx";
import Customer from "../../components/shared/customer.jsx";
import {selectCustomer} from "../../redux/features/customers/customers-slice";

const CustomersPage = () => {

    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("all");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const {customers, customerLoading, customerError} = useSelector(selectCustomer)

    const totalCustomers = customers?.length || 0;
    const activeCustomers = customers?.filter(c => (c.status || "ACTIVE") === "ACTIVE").length || 0;
    const suspendedCustomers = customers?.filter(c => c.status === "SUSPENDED").length || 0;
    const verifiedCustomers = customers?.filter(c => c.is_verified).length || 0;

    const filteredCustomers = useMemo(() => {
        if (!Array.isArray(customers)) return [];
        const q = query.trim().toLowerCase();
        return customers.filter(c => {
            if (status !== "all" && (c.status || "ACTIVE").toUpperCase() !== status.toUpperCase()) return false;
            if (c.created_at) {
                const d = moment(c.created_at);
                if (startDate && d.isBefore(moment(startDate).startOf("day"))) return false;
                if (endDate && d.isAfter(moment(endDate).endOf("day"))) return false;
            }
            if (!q) return true;
            return [c.name, c.email, c.username, c.phone].join(" ").toLowerCase().includes(q);
        });
    }, [customers, query, status, startDate, endDate]);

    return (
        <Layout>
            {customerLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {customerError && (
                    <Alert severity="error" sx={{mb: 2}}>
                        <AlertTitle>
                            {customerError}
                        </AlertTitle>
                    </Alert>
                )}
                <Container>
                    <PageHeader
                        title="Customers"
                        query={query}
                        onQueryChange={setQuery}
                        searchPlaceholder="Search customers..."
                        action={
                            <Link to="/customer/new" style={{textDecoration: "none"}}>
                                <Button size="small" color="secondary" variant="contained">Add Customer</Button>
                            </Link>
                        }
                    />
                    <Divider variant="fullWidth" sx={{my: 3}}/>

                    <Grid container spacing={2} sx={{mt: 3, mb: 4}}>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Total Customers" value={totalCustomers} icon={<PeopleOutlined/>} iconColor="secondary.main" iconBg="light.secondary" trend={18}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Active" value={activeCustomers} icon={<PersonAddOutlined/>} iconColor="text.green" iconBg="light.green" trend={14}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Suspended" value={suspendedCustomers} icon={<BlockOutlined/>} iconColor="text.red" iconBg="light.red" trend={-5}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Verified" value={verifiedCustomers} icon={<VerifiedUserOutlined/>} iconColor="text.blue" iconBg="light.blue" trend={10}/>
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
                        <Grid size={{xs: 12, md: 3}}>
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
                                        <MenuItem value="PENDING">Pending</MenuItem>
                                        <MenuItem value="DELETED">Deleted</MenuItem>
                                        <MenuItem value="SUSPENDED">Suspended</MenuItem>
                                        <MenuItem value="ACTIVE">Active</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Grid>
                        <Grid size={{xs: 12, md: 3}}>
                            <Button
                                size="small"
                                color="secondary"
                                variant="outlined"
                                fullWidth={true}>Filter</Button>
                        </Grid>
                    </Grid>

                    <Divider variant="fullWidth" sx={{my: 4}}/>

                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                        </Table>
                    </TableContainer>

                    {filteredCustomers.length === 0 ? (
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
                                                borderRadius: 0,
                                                borderColor: "light.secondary",
                                                color: "secondary.main",
                                                backgroundColor: "light.secondary",
                                                cursor: "pointer"
                                            }}
                                        />
                                    </Box>
                                }
                                title="Orders"
                                message="No customers available"
                                button={
                                    <Link to="/customer/new" style={{textDecoration: "none"}}>
                                        <Button
                                            size="small"
                                            color="secondary"
                                            variant="outlined"
                                            fullWidth={true}>Create Customer</Button>
                                    </Link>
                                }
                            />
                        </Box>
                    ) : (
                        <TableContainer component={Paper} elevation={0}>
                            <Table>
                                <TableBody>
                                    {filteredCustomers.map((customer, index) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <Customer index={index} customer={customer}/>
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

export default CustomersPage;