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
import React, {useState} from "react";
import {DatePicker} from "@mui/x-date-pickers";
import moment from "moment";
import {useSelector} from "react-redux";
import Empty from "../../components/shared/empty.jsx";
import {motion} from "framer-motion";
import {Close, SearchOutlined} from "@mui/icons-material";
import {selectCoupons} from "../../redux/features/coupons/coupons-slice";
import Coupon from "../../components/shared/coupon.jsx";

const CouponsPage = () => {

    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("all");
    const [startDate, setStartDate] = useState(moment(new Date()));
    const [endDate, setEndDate] = useState(moment(new Date()));
    const {coupons, couponLoading, couponError} = useSelector(selectCoupons)

    const handleSearch = () => {
        console.log(query)
    }

    return (
        <Layout>
            {couponLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 8}}>
                {couponError && (
                    <Alert severity="error" variant="standard">
                        <AlertTitle>
                            {couponError}
                        </AlertTitle>
                    </Alert>
                )}
                <Container>
                    <Grid spacing={4} container={true} alignItems="center" justifyContent="space-between">
                        <Grid item={true} size={{xs: 12, md: 'auto'}}>
                            <Grid container={true} spacing={2} alignItems="center">
                                <Grid item={true} size={{xs: 12, md: 'auto'}}>
                                    <Typography variant="h4" sx={{color: "text.secondary"}}>Coupons</Typography>
                                </Grid>
                                <Grid item={true} size={{xs: 12, md: 'auto'}}>
                                    <Link
                                        to="/coupon/new"
                                        style={{textDecoration: "none", width: "100%", display: "block"}}>
                                        <Button
                                            sx={{
                                                textTransform: "capitalize",
                                                borderWidth: 2
                                            }}
                                            size="small"
                                            color="secondary"
                                            variant="outlined"
                                            fullWidth={true}>Add Coupon</Button>
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
                                        fullWidth={true}>Search Coupon</Button>
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
                        <Grid item={true} size={{xs: 12, md: 3}}>
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
                        <Grid item={true} size={{xs: 12, md: 3}}>
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

                    <Divider variant="fullWidth" sx={{my: 4}}/>

                    <TableContainer component={Paper} elevation={0} variant="elevation">
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

                    {coupons && coupons.length === 0 ? (
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
                                title="Coupons"
                                message="No coupons available"
                                button={
                                    <Link to="/coupon/new" style={{textDecoration: "none"}}>
                                        <Button
                                            sx={{
                                                textTransform: "capitalize",
                                                borderWidth: 2
                                            }}
                                            size="small"
                                            color="secondary"
                                            variant="outlined"
                                            fullWidth={true}>Create Coupon</Button>
                                    </Link>
                                }
                            />
                        </Box>
                    ) : (
                        <TableContainer component={Paper} elevation={0} variant="elevation">
                            <Table>
                                <TableBody>
                                    {coupons.map((coupon, index) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <Coupon index={index} coupon={coupon}/>
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

export default CouponsPage;