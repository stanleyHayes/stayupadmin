import React, {useEffect, useState} from "react";
import {
    Alert, AlertTitle, Box, Button, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, Tooltip, Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchTaxRates, deleteTaxRate, selectTaxRates} from "../../redux/features/tax-rates/tax-rates-slice";
import {SearchOutlined, VisibilityOutlined, EditOutlined, DeleteForeverOutlined, Add} from "@mui/icons-material";

const TaxRatesPage = () => {
    const dispatch = useDispatch();
    const {taxRates, taxRateLoading, taxRateError} = useSelector(selectTaxRates);
    const [query, setQuery] = useState("");

    useEffect(() => { dispatch(fetchTaxRates()); }, [dispatch]);

    const handleSearch = () => dispatch(fetchTaxRates({search: query}));
    const handleDelete = async (rate) => {
        if (!window.confirm(`Delete tax rate "${rate.name}"? This cannot be undone.`)) return;
        await dispatch(deleteTaxRate(rate._id));
    };

    return (
        <Layout>
            {taxRateLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {taxRateError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{taxRateError}</AlertTitle></Alert>}
                <Container>
                    <Grid spacing={4} container alignItems="center" justifyContent="space-between">
                        <Grid size={{xs: 12, md: "auto"}}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{xs: 12, md: "auto"}}>
                                    <Typography variant="h4" sx={{color: "text.secondary"}}>Tax Rates</Typography>
                                </Grid>
                                <Grid size={{xs: 12, md: "auto"}}>
                                    <Link to="/tax-rate/new" style={{textDecoration: "none"}}>
                                        <Button startIcon={<Add/>} size="small" color="secondary" variant="outlined">Add Tax Rate</Button>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid size={{xs: 12, md: "auto"}}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{xs: 12, md: 8}}>
                                    <Stack direction="row" spacing={1} sx={{backgroundColor: "background.paper", p: 1, borderRadius: 2}}>
                                        <TextField value={query} size="small" placeholder="Search tax rates..." onChange={e => setQuery(e.target.value)} variant="standard" slotProps={{ input: { disableUnderline: true } }} fullWidth/>
                                        <SearchOutlined onClick={handleSearch} sx={{cursor: "pointer", alignSelf: "center"}}/>
                                    </Stack>
                                </Grid>
                                <Grid size={{xs: 12, md: 4}}>
                                    <Button size="small" color="secondary" variant="outlined" fullWidth onClick={handleSearch}>Search</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider sx={{my: 4}}/>
                    <Paper elevation={0}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Country</TableCell>
                                        <TableCell>State</TableCell>
                                        <TableCell>Rate (%)</TableCell>
                                        <TableCell>Class</TableCell>
                                        <TableCell>Priority</TableCell>
                                        <TableCell>Shipping</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {taxRates && taxRates.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={9}>
                                                <Typography variant="body2" color="text.secondary" align="center">No tax rates found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {taxRates && taxRates.map((rate, i) => (
                                        <TableRow key={rate._id}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell><Typography variant="body2">{rate.name || "—"}</Typography></TableCell>
                                            <TableCell><Typography variant="body2" color="text.secondary">{rate.country || "*"}</Typography></TableCell>
                                            <TableCell><Typography variant="body2" color="text.secondary">{rate.state || "*"}</Typography></TableCell>
                                            <TableCell><Typography variant="body2">{rate.rate != null ? `${rate.rate}%` : "—"}</Typography></TableCell>
                                            <TableCell><Typography variant="body2" color="text.secondary">{rate.tax_class || "standard"}</Typography></TableCell>
                                            <TableCell><Typography variant="body2">{rate.priority ?? "—"}</Typography></TableCell>
                                            <TableCell><Typography variant="body2">{rate.shipping ? "Yes" : "No"}</Typography></TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Tooltip title="View Tax Rate">
                                                        <Link to={`/tax-rates/${rate._id}`} style={{textDecoration: "none"}}>
                                                            <VisibilityOutlined
                                                                sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: "25%", borderColor: "light.green", color: "icon.green", backgroundColor: "light.green", cursor: "pointer"}}
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Edit Tax Rate">
                                                        <Link to={`/tax-rates/${rate._id}/update`} style={{textDecoration: "none"}}>
                                                            <EditOutlined
                                                                sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: "25%", borderColor: "light.secondary", color: "secondary.main", backgroundColor: "light.secondary", cursor: "pointer"}}
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Tax Rate">
                                                        <DeleteForeverOutlined
                                                            onClick={() => handleDelete(rate)}
                                                            sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: "25%", borderColor: "light.red", color: "icon.red", backgroundColor: "light.red", cursor: "pointer"}}
                                                        />
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Container>
            </Box>
        </Layout>
    );
};

export default TaxRatesPage;
