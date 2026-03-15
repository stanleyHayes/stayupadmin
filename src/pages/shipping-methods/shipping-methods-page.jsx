import React, {useEffect} from "react";
import {
    Alert, AlertTitle, Box, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Switch, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Typography
} from "@mui/material";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchShippingMethods, updateShippingMethod, selectShippingMethods} from "../../redux/features/shipping-methods/shipping-methods-slice";
import {LocalShippingOutlined, CheckCircleOutlined, CancelOutlined} from "@mui/icons-material";
import KPIBox from "../../components/shared/kpi-box.jsx";

const ShippingMethodsPage = () => {
    const dispatch = useDispatch();
    const {shippingMethods, shippingMethodLoading, shippingMethodError} = useSelector(selectShippingMethods);

    useEffect(() => { dispatch(fetchShippingMethods()); }, [dispatch]);

    const handleToggle = (method) => {
        dispatch(updateShippingMethod({id: method._id, data: {enabled: !method.enabled}}));
    };

    return (
        <Layout>
            {shippingMethodLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {shippingMethodError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{shippingMethodError}</AlertTitle></Alert>}
                <Container>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid size={{xs: 12, md: "auto"}}>
                            <Typography variant="h4" sx={{color: "text.secondary"}}>Shipping Methods</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{mt: 3, mb: 4}}>
                        <Grid size={{xs: 6, sm: 4}}>
                            <KPIBox label="Total Methods" value={shippingMethods?.length || 0} icon={<LocalShippingOutlined/>} iconColor="secondary" iconBg="secondary"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 4}}>
                            <KPIBox label="Enabled" value={shippingMethods?.filter(m => m.enabled).length || 0} icon={<CheckCircleOutlined/>} iconColor="text.green" iconBg="light.green"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 4}}>
                            <KPIBox label="Disabled" value={shippingMethods?.filter(m => !m.enabled).length || 0} icon={<CancelOutlined/>} iconColor="text.red" iconBg="light.red"/>
                        </Grid>
                    </Grid>
                    <Divider sx={{my: 4}}/>
                    <Paper elevation={0}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Method ID</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {shippingMethods && shippingMethods.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5}>
                                                <Typography variant="body2" color="text.secondary" align="center">No shipping methods found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {shippingMethods && shippingMethods.map((method, i) => (
                                        <TableRow key={method._id}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell><Typography variant="body2">{method.title || "—"}</Typography></TableCell>
                                            <TableCell><Typography variant="body2" color="text.secondary">{method.method_id || "—"}</Typography></TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary" sx={{maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                                                    {method.description || "—"}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <Switch
                                                        checked={Boolean(method.enabled)}
                                                        onChange={() => handleToggle(method)}
                                                        color="secondary"
                                                        size="small"
                                                    />
                                                    <Typography variant="caption" color="text.secondary">{method.enabled ? "Enabled" : "Disabled"}</Typography>
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

export default ShippingMethodsPage;
