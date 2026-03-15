import React, {useEffect, useMemo, useState} from "react";
import {
    Alert, AlertTitle, Avatar, Box, Button, Card, CardActions, CardContent,
    Chip, Container, Dialog, DialogActions, DialogContent, DialogTitle,
    Divider, FormControl, Grid, InputLabel, LinearProgress, MenuItem,
    Paper, Select, Stack, Switch, TextField, Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import Layout from "../../components/shared/layout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchPaymentGateways, updatePaymentGateway, createPaymentGateway,
    selectPaymentGateways
} from "../../redux/features/payment-gateways/payment-gateways-slice";
import {
    SettingsOutlined, PaymentOutlined, CheckCircleOutlined, CancelOutlined,
    AccountBalanceOutlined, AddOutlined, CurrencyBitcoinOutlined,
    PhoneAndroidOutlined, CreditCardOutlined, StorefrontOutlined
} from "@mui/icons-material";
import KPIBox from "../../components/shared/kpi-box.jsx";

const CATEGORY_META = {
    all:          {label: "All Gateways", icon: <PaymentOutlined/>},
    card:         {label: "Card / Online", icon: <CreditCardOutlined/>, color: "#3B82F6", bg: "#EFF6FF"},
    mobile_money: {label: "Mobile Money", icon: <PhoneAndroidOutlined/>, color: "#F59E0B", bg: "#FFFBEB"},
    crypto:       {label: "Cryptocurrency", icon: <CurrencyBitcoinOutlined/>, color: "#8B5CF6", bg: "#F5F3FF"},
    offline:      {label: "Offline / Manual", icon: <StorefrontOutlined/>, color: "#10B981", bg: "#ECFDF5"},
};

const getCategoryIcon = (cat) => {
    const meta = CATEGORY_META[cat];
    if (!meta) return <PaymentOutlined/>;
    return React.cloneElement(meta.icon, {sx: {color: meta.color, fontSize: 28}});
};

const PaymentGatewaysPage = () => {
    const dispatch = useDispatch();
    const {paymentGateways, paymentGatewayLoading, paymentGatewayError} = useSelector(selectPaymentGateways);
    const [filter, setFilter] = useState("all");
    const [addOpen, setAddOpen] = useState(false);
    const [newGw, setNewGw] = useState({title: "", description: "", category: "card", method_title: "", method_description: ""});

    useEffect(() => { dispatch(fetchPaymentGateways()); }, [dispatch]);

    const handleToggle = (gateway) => {
        dispatch(updatePaymentGateway({id: gateway._id, data: {enabled: !gateway.enabled}}));
    };

    const filtered = useMemo(() => {
        if (!paymentGateways) return [];
        if (filter === "all") return paymentGateways;
        return paymentGateways.filter(g => g.category === filter);
    }, [paymentGateways, filter]);

    const totalGateways = paymentGateways?.length || 0;
    const enabledCount = paymentGateways?.filter(g => g.enabled).length || 0;
    const disabledCount = paymentGateways?.filter(g => !g.enabled).length || 0;
    const categories = [...new Set((paymentGateways || []).map(g => g.category).filter(Boolean))];

    const handleAddGateway = () => {
        if (!newGw.title.trim()) return;
        dispatch(createPaymentGateway({
            ...newGw,
            enabled: false,
            settings: {},
        }));
        setNewGw({title: "", description: "", category: "card", method_title: "", method_description: ""});
        setAddOpen(false);
    };

    return (
        <Layout>
            {paymentGatewayLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {paymentGatewayError && <Alert severity="error" sx={{mb: 2}}><AlertTitle>{paymentGatewayError}</AlertTitle></Alert>}
                <Container>
                    {/* Header */}
                    <Stack direction={{xs: "column", sm: "row"}} alignItems={{xs: "flex-start", sm: "center"}} justifyContent="space-between" spacing={2} sx={{mb: 3}}>
                        <Box>
                            <Typography variant="h4" sx={{color: "text.heading", fontWeight: 700}}>Payment Gateways</Typography>
                            <Typography variant="body2" color="text.secondary">Configure how your store accepts payments</Typography>
                        </Box>
                        <Button startIcon={<AddOutlined/>} variant="contained" color="secondary" size="small" onClick={() => setAddOpen(true)}>
                            Add Gateway
                        </Button>
                    </Stack>

                    <Divider sx={{mb: 3}}/>

                    {/* KPIs */}
                    <Grid container spacing={2} sx={{mb: 3}}>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Total Gateways" value={totalGateways} icon={<PaymentOutlined fontSize="small"/>} iconColor="secondary.main" iconBg="light.secondary"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Enabled" value={enabledCount} icon={<CheckCircleOutlined fontSize="small"/>} iconColor="text.green" iconBg="light.green"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Disabled" value={disabledCount} icon={<CancelOutlined fontSize="small"/>} iconColor="text.red" iconBg="light.red"/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Categories" value={categories.length} icon={<AccountBalanceOutlined fontSize="small"/>} iconColor="text.blue" iconBg="light.blue"/>
                        </Grid>
                    </Grid>

                    {/* Category Filter */}
                    <Stack direction="row" spacing={1} sx={{mb: 3, flexWrap: "wrap", gap: 1}}>
                        {Object.entries(CATEGORY_META).map(([key, meta]) => (
                            <Chip
                                key={key}
                                label={meta.label}
                                icon={React.cloneElement(meta.icon, {sx: {fontSize: 16}})}
                                variant={filter === key ? "filled" : "outlined"}
                                color={filter === key ? "secondary" : "default"}
                                onClick={() => setFilter(key)}
                                sx={{fontWeight: filter === key ? 600 : 400}}
                            />
                        ))}
                    </Stack>

                    {/* Gateway Cards */}
                    <Grid container spacing={2.5}>
                        {filtered.length === 0 && (
                            <Grid size={{xs: 12}}>
                                <Paper elevation={0} sx={{p: 4, textAlign: "center"}}>
                                    <Typography variant="body2" color="text.secondary">No payment gateways found in this category</Typography>
                                </Paper>
                            </Grid>
                        )}
                        {filtered.map(gateway => {
                            const catMeta = CATEGORY_META[gateway.category] || CATEGORY_META.card;
                            return (
                                <Grid key={gateway._id} size={{xs: 12, sm: 6, md: 4}}>
                                    <Card elevation={0} sx={{
                                        height: "100%", display: "flex", flexDirection: "column",
                                        border: "1px solid", borderColor: gateway.enabled ? "border.green" : "divider",
                                        transition: "all 0.2s", "&:hover": {borderColor: "secondary.main", boxShadow: "0 4px 20px rgba(0,0,0,0.08)"}
                                    }}>
                                        <CardContent sx={{flex: 1, pb: 1}}>
                                            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{mb: 1.5}}>
                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                    <Avatar sx={{width: 40, height: 40, bgcolor: catMeta.bg, color: catMeta.color}}>
                                                        {getCategoryIcon(gateway.category)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2" sx={{fontWeight: 600, lineHeight: 1.3}}>{gateway.title}</Typography>
                                                        <Chip
                                                            label={catMeta.label}
                                                            size="small"
                                                            sx={{mt: 0.5, height: 20, fontSize: 10, fontWeight: 600, backgroundColor: catMeta.bg, color: catMeta.color}}
                                                        />
                                                    </Box>
                                                </Stack>
                                                <Switch
                                                    checked={Boolean(gateway.enabled)}
                                                    onChange={() => handleToggle(gateway)}
                                                    color="secondary"
                                                    size="small"
                                                />
                                            </Stack>
                                            <Typography variant="caption" color="text.secondary" sx={{
                                                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                                                overflow: "hidden", lineHeight: 1.5
                                            }}>
                                                {gateway.description}
                                            </Typography>
                                            <Stack direction="row" spacing={1} alignItems="center" sx={{mt: 1.5}}>
                                                <Chip
                                                    label={gateway.enabled ? "Active" : "Inactive"}
                                                    size="small"
                                                    color={gateway.enabled ? "success" : "default"}
                                                    sx={{height: 22, fontSize: 11, fontWeight: 600}}
                                                />
                                                <Typography variant="caption" color="text.secondary">
                                                    {Object.keys(gateway.settings || {}).length} settings
                                                </Typography>
                                            </Stack>
                                        </CardContent>
                                        <CardActions sx={{px: 2, pb: 2, pt: 0}}>
                                            <Link to={`/payment-gateways/${gateway._id}`} style={{textDecoration: "none", flex: 1}}>
                                                <Button startIcon={<SettingsOutlined/>} size="small" variant="outlined" color="secondary" fullWidth>
                                                    Configure
                                                </Button>
                                            </Link>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Container>
            </Box>

            {/* Add Gateway Dialog */}
            <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth PaperProps={{sx: {borderRadius: 0}}}>
                <DialogTitle sx={{fontWeight: 600}}>Add Payment Gateway</DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{mt: 1}}>
                        <TextField label="Gateway Name" value={newGw.title} onChange={e => setNewGw(p => ({...p, title: e.target.value}))} size="small" fullWidth required placeholder="e.g. M-Pesa"/>
                        <TextField label="Method Title" value={newGw.method_title} onChange={e => setNewGw(p => ({...p, method_title: e.target.value}))} size="small" fullWidth placeholder="Display name at checkout"/>
                        <FormControl fullWidth size="small">
                            <InputLabel>Category</InputLabel>
                            <Select value={newGw.category} onChange={e => setNewGw(p => ({...p, category: e.target.value}))} label="Category">
                                <MenuItem value="card">Card / Online</MenuItem>
                                <MenuItem value="mobile_money">Mobile Money</MenuItem>
                                <MenuItem value="crypto">Cryptocurrency</MenuItem>
                                <MenuItem value="offline">Offline / Manual</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField label="Description" value={newGw.description} onChange={e => setNewGw(p => ({...p, description: e.target.value}))} size="small" fullWidth multiline rows={2} placeholder="Short description of this payment method"/>
                        <TextField label="Method Description" value={newGw.method_description} onChange={e => setNewGw(p => ({...p, method_description: e.target.value}))} size="small" fullWidth multiline rows={2} placeholder="Detailed description shown to customers"/>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{p: 2, gap: 1}}>
                    <Button variant="outlined" color="inherit" onClick={() => setAddOpen(false)}>Cancel</Button>
                    <Button variant="contained" color="secondary" onClick={handleAddGateway} disabled={!newGw.title.trim()}>Add Gateway</Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
};

export default PaymentGatewaysPage;
