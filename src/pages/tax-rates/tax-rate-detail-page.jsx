import React, {useEffect} from "react";
import {
    Alert, AlertTitle, Box, Button, Container, Divider, Grid,
    LinearProgress, Paper, Stack, Typography
} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchTaxRate, deleteTaxRate, selectTaxRates} from "../../redux/features/tax-rates/tax-rates-slice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const InfoRow = ({label, value}) => (
    <Box sx={{display: "flex", gap: 1, alignItems: "flex-start", py: 0.5}}>
        <Typography variant="caption" color="text.secondary" sx={{minWidth: 140, fontWeight: 600}}>{label}</Typography>
        <Typography variant="body2">{value ?? "—"}</Typography>
    </Box>
);

const TaxRateDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {taxRateID} = useParams();
    const {taxRate, taxRateLoading, taxRateError} = useSelector(selectTaxRates);

    useEffect(() => {
        if (taxRateID) dispatch(fetchTaxRate(taxRateID));
    }, [dispatch, taxRateID]);

    const handleDelete = async () => {
        if (!window.confirm(`Delete tax rate "${taxRate?.name}"? This cannot be undone.`)) return;
        await dispatch(deleteTaxRate(taxRateID));
        navigate("/tax-rates");
    };

    const t = taxRate || {};

    return (
        <Layout>
            {taxRateLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {taxRateError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{taxRateError}</AlertTitle></Alert>}
                <Container>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{mb: 3}}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(-1)} variant="outlined" size="small">Back</Button>
                            <Typography variant="h5">Tax Rate</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Link to={`/tax-rates/${taxRateID}/update`} style={{textDecoration: "none"}}>
                                <Button startIcon={<EditIcon/>} variant="outlined" color="secondary" size="small">Edit</Button>
                            </Link>
                            <Button startIcon={<DeleteIcon/>} variant="outlined" color="error" size="small" onClick={handleDelete}>Delete</Button>
                        </Stack>
                    </Stack>

                    <Grid container spacing={3}>
                        <Grid size={{xs: 12, md: 7}}>
                            <Paper elevation={0} sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{mb: 2, fontWeight: 600}}>Rate Details</Typography>
                                <InfoRow label="Name" value={t.name}/>
                                <InfoRow label="Country" value={t.country || "*"}/>
                                <InfoRow label="State" value={t.state || "*"}/>
                                <InfoRow label="Postcode" value={t.postcode || "*"}/>
                                <InfoRow label="City" value={t.city || "*"}/>
                                <InfoRow label="Rate" value={t.rate != null ? `${t.rate}%` : null}/>
                                <InfoRow label="Tax Class" value={t.tax_class || "standard"}/>
                                <Divider sx={{my: 2}}/>
                                <InfoRow label="Priority" value={t.priority}/>
                                <InfoRow label="Compound" value={t.compound ? "Yes" : "No"}/>
                                <InfoRow label="Apply to Shipping" value={t.shipping ? "Yes" : "No"}/>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default TaxRateDetailPage;
