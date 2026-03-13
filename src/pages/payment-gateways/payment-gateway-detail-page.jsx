import React, {useEffect} from "react";
import {
    Alert, AlertTitle, Box, Button, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Switch, Typography
} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchPaymentGateway, updatePaymentGateway, selectPaymentGateways} from "../../redux/features/payment-gateways/payment-gateways-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

const InfoRow = ({label, value}) => (
    <Box sx={{display: "flex", gap: 1, alignItems: "flex-start", py: 0.5}}>
        <Typography variant="caption" color="text.secondary" sx={{minWidth: 160, fontWeight: 600}}>{label}</Typography>
        <Typography variant="body2">{value ?? "—"}</Typography>
    </Box>
);

const PaymentGatewayDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {gatewayID} = useParams();
    const {paymentGateway, paymentGatewayLoading, paymentGatewayError} = useSelector(selectPaymentGateways);

    useEffect(() => {
        if (gatewayID) dispatch(fetchPaymentGateway(gatewayID));
    }, [dispatch, gatewayID]);

    const handleToggleEnabled = () => {
        if (!paymentGateway) return;
        dispatch(updatePaymentGateway({id: gatewayID, data: {enabled: !paymentGateway.enabled}}));
    };

    const handleSave = () => {
        if (!paymentGateway) return;
        dispatch(updatePaymentGateway({id: gatewayID, data: {enabled: paymentGateway.enabled}}));
    };

    const gw = paymentGateway || {};
    const settings = gw.settings || {};
    const settingEntries = Object.entries(settings);

    return (
        <Layout>
            {paymentGatewayLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {paymentGatewayError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{paymentGatewayError}</AlertTitle></Alert>}
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{mb: 3}}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                            <Typography variant="h5">{gw.title || "Payment Gateway"}</Typography>
                        </Stack>
                        <Button startIcon={<SaveIcon/>} variant="contained" color="secondary" size="small" onClick={handleSave} disabled={paymentGatewayLoading}>Save Changes</Button>
                    </Stack>

                    <Grid container spacing={3}>
                        <Grid size={{xs: 12, md: 7}}>
                            <Paper elevation={0} sx={{p: 3, mb: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Gateway Details</Typography>
                                <InfoRow label="Title" value={gw.title}/>
                                <InfoRow label="Method Title" value={gw.method_title}/>
                                <InfoRow label="Description" value={gw.description}/>
                                {gw.method_description && (
                                    <>
                                        <Divider sx={{my: 1.5}}/>
                                        <Typography variant="caption" color="text.secondary" sx={{fontWeight: 600}}>Method Description</Typography>
                                        <Typography variant="body2" sx={{mt: 0.5}}>{gw.method_description}</Typography>
                                    </>
                                )}
                            </Paper>

                            {settingEntries.length > 0 && (
                                <Paper elevation={0} sx={{p: 3}}>
                                    <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Settings</Typography>
                                    {settingEntries.map(([key, val]) => (
                                        <InfoRow key={key} label={key} value={typeof val === "object" ? JSON.stringify(val) : String(val)}/>
                                    ))}
                                </Paper>
                            )}
                        </Grid>
                        <Grid size={{xs: 12, md: 5}}>
                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Status</Typography>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Switch checked={Boolean(gw.enabled)} onChange={handleToggleEnabled} color="secondary"/>
                                    <Typography variant="body2">{gw.enabled ? "Enabled" : "Disabled"}</Typography>
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default PaymentGatewayDetailPage;
