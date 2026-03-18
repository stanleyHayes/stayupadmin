import React, {useEffect, useMemo, useState} from "react";
import {
    Alert, AlertTitle, Box, Button, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, Tooltip, Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchTaxRates, deleteTaxRate, selectTaxRates} from "../../redux/features/tax-rates/tax-rates-slice";
import {VisibilityOutlined, EditOutlined, DeleteForeverOutlined, ReceiptOutlined, PercentOutlined, PublicOutlined, CheckCircleOutlined} from "@mui/icons-material";
import PageHeader from "../../components/shared/page-header.jsx";
import KPIBox from "../../components/shared/kpi-box.jsx";
import {ListSkeleton} from "../../components/shared/page-skeleton.jsx";

const TaxRatesPage = () => {
    const dispatch = useDispatch();
    const {taxRates, taxRateLoading, taxRateError} = useSelector(selectTaxRates);
    const [query, setQuery] = useState("");

    useEffect(() => { dispatch(fetchTaxRates()); }, [dispatch]);

    const filteredTaxRates = useMemo(() => {
        if (!Array.isArray(taxRates)) return [];
        const q = query.trim().toLowerCase();
        if (!q) return taxRates;
        return taxRates.filter(item =>
            [item.country, item.state, item.name, item.rate].join(" ").toLowerCase().includes(q)
        );
    }, [taxRates, query]);

    const handleDelete = async (rate) => {
        if (!window.confirm(`Delete tax rate "${rate.name}"? This cannot be undone.`)) return;
        await dispatch(deleteTaxRate(rate._id));
    };

    if (taxRateLoading && taxRates.length === 0) return <Layout><Box sx={{pt: 4, pb: 6}}><ListSkeleton cols={6}/></Box></Layout>;

    return (
        <Layout>
            {taxRateLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {taxRateError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{taxRateError}</AlertTitle></Alert>}
                <Container>
                    <PageHeader
                        title="Tax Rates"
                        query={query}
                        onQueryChange={setQuery}
                        searchPlaceholder="Search tax rates..."
                        action={
                            <Link to="/tax-rate/new" style={{textDecoration: "none"}}>
                                <Button size="small" color="secondary" variant="contained">Add Tax Rate</Button>
                            </Link>
                        }
                    />
                    <Divider variant="fullWidth" sx={{my: 3}}/>
                    <Grid container spacing={2} sx={{mt: 3, mb: 4}}>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Total Tax Rates" value={taxRates?.length || 0} icon={<ReceiptOutlined/>} iconColor="secondary" iconBg="secondary"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Avg Rate" value={taxRates?.length > 0 ? (taxRates.reduce((s, t) => s + Number(t.rate || 0), 0) / taxRates.length).toFixed(1) + "%" : "0%"} icon={<PercentOutlined/>} iconColor="text.blue" iconBg="light.blue"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Countries" value={new Set(taxRates?.map(t => t.country).filter(Boolean) || []).size} icon={<PublicOutlined/>} iconColor="text.green" iconBg="light.green"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Active" value={taxRates?.filter(t => t.status !== "inactive").length || 0} icon={<CheckCircleOutlined/>} iconColor="text.orange" iconBg="light.orange"/>
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
                                    {filteredTaxRates.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={9}>
                                                <Typography variant="body2" color="text.secondary" align="center">No tax rates found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {filteredTaxRates.map((rate, i) => (
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
                                                                sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 1, borderColor: "light.green", color: "icon.green", backgroundColor: "light.green", cursor: "pointer"}}
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Edit Tax Rate">
                                                        <Link to={`/tax-rates/${rate._id}/update`} style={{textDecoration: "none"}}>
                                                            <EditOutlined
                                                                sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 1, borderColor: "light.secondary", color: "secondary.main", backgroundColor: "light.secondary", cursor: "pointer"}}
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Tax Rate">
                                                        <DeleteForeverOutlined
                                                            onClick={() => handleDelete(rate)}
                                                            sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 1, borderColor: "light.red", color: "icon.red", backgroundColor: "light.red", cursor: "pointer"}}
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
