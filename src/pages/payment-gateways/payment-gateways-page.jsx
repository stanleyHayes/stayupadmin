import React, {useEffect} from "react";
import {
    Alert, AlertTitle, Box, Button, Card, CardContent, CardActions,
    Container, Divider, Grid, LinearProgress, Stack, Switch, Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchPaymentGateways, updatePaymentGateway, selectPaymentGateways} from "../../redux/features/payment-gateways/payment-gateways-slice";
import SettingsIcon from "@mui/icons-material/Settings";

const PaymentGatewaysPage = () => {
    const dispatch = useDispatch();
    const {paymentGateways, paymentGatewayLoading, paymentGatewayError} = useSelector(selectPaymentGateways);

    useEffect(() => { dispatch(fetchPaymentGateways()); }, [dispatch]);

    const handleToggle = (gateway) => {
        dispatch(updatePaymentGateway({id: gateway._id, data: {enabled: !gateway.enabled}}));
    };

    return (
        <Layout>
            {paymentGatewayLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {paymentGatewayError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{paymentGatewayError}</AlertTitle></Alert>}
                <Container>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 3}}>
                        <Typography variant="h4" sx={{color: "text.secondary"}}>Payment Gateways</Typography>
                    </Stack>
                    <Divider sx={{my: 4}}/>
                    <Grid container spacing={3}>
                        {paymentGateways && paymentGateways.length === 0 && (
                            <Grid size={{xs: 12}}>
                                <Typography variant="body2" color="text.secondary" align="center">No payment gateways found</Typography>
                            </Grid>
                        )}
                        {paymentGateways && paymentGateways.map((gateway) => (
                            <Grid key={gateway._id} size={{xs: 12, md: 6}}>
                                <Card elevation={0} variant="outlined" sx={{height: "100%", display: "flex", flexDirection: "column"}}>
                                    <CardContent sx={{flex: 1}}>
                                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 1}}>
                                            <Box>
                                                <Typography variant="h6">{gateway.title || gateway.method_title}</Typography>
                                                {gateway.method_title && gateway.title !== gateway.method_title && (
                                                    <Typography variant="caption" color="text.secondary">{gateway.method_title}</Typography>
                                                )}
                                            </Box>
                                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                                <Typography variant="caption" color="text.secondary">{gateway.enabled ? "Enabled" : "Disabled"}</Typography>
                                                <Switch
                                                    checked={Boolean(gateway.enabled)}
                                                    onChange={() => handleToggle(gateway)}
                                                    color="secondary"
                                                    size="small"
                                                />
                                            </Stack>
                                        </Stack>
                                        <Typography variant="body2" color="text.secondary">{gateway.description || "—"}</Typography>
                                    </CardContent>
                                    <CardActions sx={{px: 2, pb: 2}}>
                                        <Link to={`/payment-gateways/${gateway._id}`} style={{textDecoration: "none"}}>
                                            <Button startIcon={<SettingsIcon/>} size="small" variant="outlined" color="secondary">Configure</Button>
                                        </Link>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default PaymentGatewaysPage;
