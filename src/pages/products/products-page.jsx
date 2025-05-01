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
import moment from "moment";
import {useSelector} from "react-redux";
import Empty from "../../components/shared/empty.jsx";
import {motion} from "framer-motion";
import {Close, SearchOutlined} from "@mui/icons-material";
import {selectProducts} from "../../redux/features/products/products-slice";
import Product from "../../components/shared/product.jsx";

const ProductsPage = () => {

    const [query, setQuery] = useState("");
    const [startDate, setStartDate] = useState(moment(new Date()));
    const [endDate, setEndDate] = useState(moment(new Date()));
    const [selectedCategory, setSelectedCategory] = useState(null);
    const {products, productLoading, productError} = useSelector(selectProducts)

    const handleSearch = () => {
        console.log(query)
    }

    return (
        <Layout>
            {productLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {productError && (
                    <Alert severity="error" variant="standard">
                        <AlertTitle>
                            {productError}
                        </AlertTitle>
                    </Alert>
                )}
                <Container>
                    <Grid spacing={4} container={true} alignItems="center" justifyContent="space-between">
                        <Grid size={{xs: 12, md: 'auto'}}>
                            <Grid container={true} spacing={2} alignItems="center">
                                <Grid size={{xs: 12, md: 'auto'}}>
                                    <Typography variant="h4" sx={{color: "text.secondary"}}>Products</Typography>
                                </Grid>
                                <Grid size={{xs: 12, md: 'auto'}}>
                                    <Link
                                        to="/product/new"
                                        style={{textDecoration: "none", width: "100%", display: "block"}}>
                                        <Button
                                            sx={{
                                                textTransform: "capitalize",
                                                borderWidth: 2
                                            }}
                                            size="large"
                                            color="secondary"
                                            variant="outlined"
                                            fullWidth={true}>Add Product</Button>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid size={{xs: 12, md: 'auto'}}>
                            <Grid container={true} spacing={2} alignItems="center">
                                <Grid size={{xs: 12, md: 7}}>
                                    <Stack
                                        divider={
                                            <Divider
                                                sx={{color: "light.secondary", backgroundColor: "light.secondary"}}
                                                flexItem={true}
                                                variant="inset"
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
                                            placeholder="Search products..."
                                            InputProps={{disableUnderline: true}}
                                        />
                                        <SearchOutlined
                                            onClick={handleSearch}
                                            sx={{color: "background.icon"}}
                                            color="secondary"
                                        />
                                    </Stack>
                                </Grid>
                                <Grid size={{xs: 12, md: 5}}>
                                    <Button
                                        sx={{
                                            textTransform: "capitalize",
                                            borderWidth: 2
                                        }}
                                        size="large"
                                        color="secondary"
                                        variant="outlined"
                                        fullWidth={true}>Search Products</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Divider variant="fullWidth" sx={{my: 4}}/>

                    <Grid container={true} spacing={2} alignItems="center">
                        <Grid size={{xs: 12, md: 3}}>
                            <DatePicker
                                slotProps={{
                                    textField: {
                                        size: "medium",
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
                                        size: "medium",
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
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        onChange={event => setSelectedCategory(event.target.value)}
                                        value={selectedCategory}
                                        fullWidth={true}
                                        size="medium"
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
                        <Grid size={{xs: 12, md: 2}}>
                            <Box>
                                <FormControl fullWidth={true} variant="outlined">
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        onChange={event => setSelectedCategory(event.target.value)}
                                        value={selectedCategory}
                                        fullWidth={true}
                                        size="medium"
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
                        <Grid size={{xs: 12, md: 2}}>
                            <Grid alignItems="center" container={true} spacing={2}>
                                <Grid alignItems="center" xs={12}>
                                    <Button
                                        sx={{
                                            textTransform: "capitalize",
                                            borderWidth: 2,
                                            py: 1.5
                                        }}
                                        size="large"
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
                                    <TableCell>Product</TableCell>
                                    <TableCell>SKU</TableCell>
                                    <TableCell>Stock</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Featured</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                        </Table>
                    </TableContainer>

                    {products && products.length === 0 ? (
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
                                title="Products"
                                message="No products available"
                                button={
                                    <Link to="/product/new" style={{textDecoration: "none"}}>
                                        <Button
                                            sx={{
                                                textTransform: "capitalize",
                                                borderWidth: 2
                                            }}
                                            size="small"
                                            color="secondary"
                                            variant="outlined"
                                            fullWidth={true}>Create Product</Button>
                                    </Link>
                                }
                            />
                        </Box>
                    ) : (
                        <TableContainer component={Paper} elevation={0} variant="outlined">
                            <Table>
                                <TableBody>
                                    {products.map((product, index) => {
                                        return (
                                            <React.Fragment key={index}>
                                                <Product index={index} product={product}/>
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

export default ProductsPage;